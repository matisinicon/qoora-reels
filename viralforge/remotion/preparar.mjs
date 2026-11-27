// VIRALFORGE · Descarga los recursos de un encargo a public/job/ y escribe props.json
// Uso: node preparar.mjs ../jobs/VF-0002.json
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const jobPath = process.argv[2];
if (!jobPath) throw new Error("Falta la ruta del encargo");
const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
const dir = path.join("public", "job");
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

async function bajar(url, nombre) {
  const r = await fetch(url, { headers: { "User-Agent": "viralforge-remotion/1.0" }, redirect: "follow" });
  if (!r.ok) throw new Error(`No pude descargar ${url}: ${r.status}`);
  fs.writeFileSync(path.join(dir, nombre), Buffer.from(await r.arrayBuffer()));
  return `job/${nombre}`;
}

// Normaliza una palabra para poder compararla (sin tildes ni signos)
const norm = (w) => String(w).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ]/g, "");
let palabras = (job.palabras || []).map((w) => (Array.isArray(w) ? { t: String(w[0]), s: +w[1], e: +w[2] } : { t: String(w.texto), s: +w.inicio, e: +w.fin }));

// ── Ritmo: quita las pausas largas de la voz y recoloca los tiempos de cada palabra ──
function quitarPausas(origen, destino, pal, maxPausa = 0.42, deja = 0.28) {
  if (!pal.length) { fs.copyFileSync(origen, destino); return pal; }
  const tramos = []; // [inicio, fin] del audio original que se conserva
  let ini = Math.max(pal[0].s - 0.04, 0);
  for (let i = 0; i < pal.length - 1; i++) {
    const hueco = pal[i + 1].s - pal[i].e;
    if (hueco > maxPausa) {
      tramos.push([ini, pal[i].e + deja / 2]);
      ini = pal[i + 1].s - deja / 2;
    }
  }
  tramos.push([ini, pal[pal.length - 1].e + 0.12]);
  // cada tramo se recorta por separado y se encadenan (más fiable que aselect en cualquier versión de ffmpeg)
  const partes = tramos.map(([a, b], k) => `[0:a]atrim=start=${a.toFixed(3)}:end=${b.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st=${Math.max(b - a - 0.006, 0).toFixed(3)}:d=0.006[p${k}]`);
  const grafo = partes.join(";") + ";" + tramos.map((_, k) => `[p${k}]`).join("") + `concat=n=${tramos.length}:v=0:a=1[out]`;
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", origen, "-filter_complex", grafo, "-map", "[out]", "-ar", "44100", "-b:a", "192k", destino]);
  const real = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", destino]).toString().trim());
  console.log(`Voz recortada: ${real.toFixed(2)} s en el archivo`);
  // tiempo nuevo = tiempo original menos todo lo recortado antes
  const nuevo = (t) => {
    let quitado = tramos[0][0];
    for (let k = 1; k < tramos.length; k++) { if (t >= tramos[k][0]) quitado += tramos[k][0] - tramos[k - 1][1]; else break; }
    return Math.max(t - quitado, 0);
  };
  const salida = pal.map((w) => ({ ...w, s: +nuevo(w.s).toFixed(3), e: +nuevo(w.e).toFixed(3) }));
  const antes = pal[pal.length - 1].e, despues = salida[salida.length - 1].e;
  console.log(`Ritmo: ${tramos.length - 1} pausas recortadas, voz de ${antes.toFixed(1)} s a ${despues.toFixed(1)} s`);
  return salida;
}

// ── Sonido: biblioteca Epidemic Sound en public/sfx (ver SONIDOS.md) ──
const HAY = (n) => fs.existsSync(path.resolve("public/sfx", `${n}.mp3`));
// Sonido de cada evento visual (Eventos.tsx)
const SFX_EVENTO = {
  apagon: [["interruptor", 0.7], ["zumbido", 0.25, 0.25]], oscurecer: [["riser_misterio", 0.35]], foco: [["boom_corto", 0.45]],
  destello: [["flash", 0.55]], relampago: [["boom", 0.6]], temblor: [["terremoto", 0.55]], zoom: [["boom_corto", 0.4]],
  brillo: [["brillo", 0.55]], monedas: [["monedas", 0.65]], lluvia_objetos: [["pop2", 0.5]], humo: [["poof", 0.6]],
  explosion: [["explosion2", 0.7], ["boom", 0.45]], cambio: [["transformacion", 0.55]], rotulo: [["golpe_comico", 0.5]],
};
// Ambiente de fondo según el escenario
const AMBIENTE = {
  taberna: "amb_taberna", campo: "amb_campo", granja: "amb_campo", campo_tulipanes: "amb_campo", jardin_mansion: "amb_bosque",
  bosque: "amb_bosque", montana: "amb_viento", nieve: "amb_viento", desierto: "amb_viento", cielo: "amb_viento",
  playa: "amb_mar", mar: "amb_mar", puerto: "amb_mar", rio_puente: "amb_bosque",
  ciudad: "amb_ciudad", calle_antigua: "amb_ciudad", estacion_tren: "amb_ciudad", via_tren: "amb_campo",
  laboratorio: "amb_laboratorio", taller: "amb_fuego", oficina: "amb_oficina", mercado: "amb_mercado", pueblo_medieval: "amb_mercado",
  espacio: "amb_espacio", castillo: "amb_viento", salon_castillo: "amb_fuego", casa: "amb_fuego",
};
const TRANSICIONES = ["whoosh_1", "whoosh_2", "whoosh_3"];
function planSonidos(escenas) {
  const ev = [];
  const poner = (t, nombre, vol, prioridad = 1) => { if (nombre && HAY(nombre) && t >= 0) ev.push({ t: +t.toFixed(3), nombre, vol, prioridad }); };
  escenas.forEach((e, i) => {
    const dur = e.hasta - e.desde;
    // corte de escena: whoosh (la primera, golpe de entrada)
    if (i === 0) poner(0, "boom_corto", 0.5, 2);
    else poner(Math.max(e.desde - 0.12, 0), TRANSICIONES[i % TRANSICIONES.length], 0.3, 0);
    if (e.sonido) poner(e.desde + 0.05, e.sonido, 0.55, 2);
    // giro / revelación: riser que sube hasta el corte y golpe seco
    if (e.momento === "giro" || e.momento === "revelacion") {
      poner(Math.max(e.desde - 2.5, 0), "riser_corto", 0.45, 2);
      poner(e.desde, "boom", 0.6, 3);
    }
    for (const x of e.eventos || []) {
      const t = e.desde + (Number(x.t) || 0);
      for (const [n, v, retraso] of SFX_EVENTO[x.tipo] || []) poner(t + (retraso || 0), x.sonido && !retraso ? x.sonido : n, v, 3);
    }
    let pops = 0;
    for (const x of e.elementos || []) {
      const t = e.desde + (Number(x.en) || 0) * dur + 0.05;
      const n = String(x.nombre || x.tipo || "");
      if (x.sonido) poner(t, x.sonido, 0.5, 2);
      else if (x.tipo === "efecto" && n === "explosion") poner(t, "explosion2", 0.6, 2);
      else if (x.tipo === "efecto" && n === "destello") poner(t, "flash", 0.5, 2);
      else if (x.tipo === "contador") poner(t, "tictac", 0.4);
      else if (n === "interrogacion") poner(t, "boing", 0.45);
      else if (n === "exclamacion") poner(t, "scratch", 0.45);
      else if (n === "bombilla" || n === "check") poner(t, "idea", 0.5);
      else if (n === "reloj") poner(t, "tictac", 0.35);
      else if (x.entra === "pop" && pops < 1 && Number(x.en) > 0.05) { poner(t, "pop2", 0.4); pops++; }
    }
  });
  // sin giro marcado: la última escena es la revelación
  if (escenas.length > 3 && !escenas.some((e) => e.momento === "giro" || e.momento === "revelacion")) {
    const u = escenas[escenas.length - 1];
    poner(Math.max(u.desde - 2.5, 0), "riser_corto", 0.4, 2);
    poner(u.desde, "boom_corto", 0.5, 3);
  }
  // si dos sonidos chocan (menos de 0,3 s), se queda el más importante
  ev.sort((a, b) => a.t - b.t);
  const limpio = [];
  for (const x of ev) {
    const prev = limpio[limpio.length - 1];
    if (prev && x.t - prev.t < 0.3) { if (x.prioridad > prev.prioridad) limpio[limpio.length - 1] = x; else if (x.prioridad === prev.prioridad && x.prioridad >= 3) limpio.push(x); continue; }
    limpio.push(x);
  }
  return limpio.map(({ prioridad, ...r }) => r);
}
// Ambientes: tramos seguidos con el mismo ambiente se juntan
function planAmbientes(escenas) {
  const tramos = [];
  for (const e of escenas) {
    const f = e.fondo || {};
    let n = e.ambiente || AMBIENTE[String(f.tipo || "").toLowerCase()] || null;
    if (!e.ambiente && (f.momento === "noche") && ["campo", "bosque", "pueblo_medieval", "castillo", "granja", "via_tren", "jardin_mansion"].includes(f.tipo)) n = "amb_noche";
    if (!e.ambiente && e.atmosfera === "lluvia") n = "amb_lluvia";
    if (!n || !HAY(n)) continue;
    const u = tramos[tramos.length - 1];
    if (u && u.nombre === n && Math.abs(u.hasta - e.desde) < 0.2) u.hasta = e.hasta;
    else tramos.push({ nombre: n, desde: e.desde, hasta: e.hasta });
  }
  return tramos.map((t) => ({ ...t, vol: t.nombre === "amb_taberna" || t.nombre === "amb_mercado" ? 0.16 : 0.22 }));
}
// Normaliza una palabra para buscarla en la voz
const normP = (w) => norm(w || "");

if (job.composicion === "Historia") {
  // Efectos a medida generados con ElevenLabs para esta historia → a la biblioteca del montaje
  for (const x of job.sfx_extra || []) {
    try {
      const r = await fetch(x.url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      fs.writeFileSync(path.resolve("public/sfx", `${x.nombre}.mp3`), Buffer.from(await r.arrayBuffer()));
      console.log(`Efecto a medida ${x.nombre} descargado`);
    } catch (e) { console.log(`Efecto a medida ${x.nombre} no disponible (${e.message}); se usa el estándar`); }
  }
  // La voz puede venir en mp3 (ElevenLabs) o wav (Gemini): siempre se pasa a mp3
  const ext = (String(job.voz_url).split("?")[0].match(/\.(\w+)$/) || [, "mp3"])[1].toLowerCase();
  await bajar(job.voz_url, `voz_descargada.${ext}`);
  if (ext === "mp3") fs.renameSync(path.join(dir, "voz_descargada.mp3"), path.join(dir, "voz_original.mp3"));
  else { execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, `voz_descargada.${ext}`), "-ac", "1", "-ar", "44100", "-b:a", "160k", path.join(dir, "voz_original.mp3")]); fs.rmSync(path.join(dir, `voz_descargada.${ext}`)); }
  // Sin tiempos por palabra (voz de Gemini): Whisper los saca y se alinean con la narración
  if (!palabras.length) {
    const salida = path.join(dir, "tiempos.json");
    execFileSync("python3", [path.resolve("tiempos_whisper.py"), path.join(dir, "voz_original.mp3"), job.narracion || "", salida], { stdio: "inherit" });
    palabras = JSON.parse(fs.readFileSync(salida, "utf8")).map((w) => ({ t: String(w[0]), s: +w[1], e: +w[2] }));
    if (!palabras.length) throw new Error("Whisper no encontró palabras en la voz");
  }
  palabras = job.sin_recorte_pausas ? palabras : quitarPausas(path.join(dir, "voz_original.mp3"), path.join(dir, "voz.mp3"), palabras, job.pausa_max ?? 0.42);
  if (job.sin_recorte_pausas) fs.copyFileSync(path.join(dir, "voz_original.mp3"), path.join(dir, "voz.mp3"));
  // Cada escena trae el fragmento de narración donde empieza: se busca en orden en las palabras de la voz
  const pal = palabras.map((w) => norm(w.t));
  let cursor = 0;
  const escenas = job.escenas.map((e, i) => {
    const clave = String(e.texto || "").split(/\s+/).map(norm).filter(Boolean).slice(0, 3);
    let pos = -1;
    for (let k = cursor; k < pal.length && clave.length; k++) {
      if (clave.every((c, j) => pal[k + j] === c)) { pos = k; break; }
    }
    if (pos < 0) for (let k = cursor; k < pal.length && clave.length; k++) if (pal[k] === clave[0]) { pos = k; break; }
    if (pos < 0) pos = Math.min(cursor + 1, pal.length - 1);
    if (i === 0) pos = 0;
    cursor = pos + 1;
    return { ...e, _pos: pos };
  });
  const out = escenas.map((e, i) => {
    const desde = i === 0 ? 0 : Math.max(palabras[e._pos].s - 0.08, 0);
    const sig = escenas[i + 1];
    const hasta = sig ? Math.max(palabras[sig._pos].s - 0.08, desde + 0.4) : palabras[palabras.length - 1].e + 0.4;
    const { _pos, texto, ...resto } = e;
    // Eventos: la palabra que los dispara se busca dentro de lo que se narra en esta escena
    const fin = sig ? sig._pos : palabras.length;
    const eventos = (e.eventos || []).map((x) => {
      let t = x.t != null ? Number(x.t) : null;
      const clave = normP(String(x.palabra || "").split(/\s+/)[0]);
      if (clave) {
        for (let k = e._pos; k < fin; k++) if (normP(palabras[k].t) === clave || (clave.length > 4 && normP(palabras[k].t).startsWith(clave.slice(0, -1)))) { t = Math.max(palabras[k].s - desde, 0); break; }
      }
      if (t == null) t = (hasta - desde) * 0.4;
      return { ...x, t: +t.toFixed(3) };
    });
    return { ...resto, eventos, desde, hasta };
  });
  const props = {
    id: job.id, titulo: job.titulo || "", reparto: job.reparto || {}, palabras, escenas: out,
    sonidos: job.sin_efectos ? [] : planSonidos(out), volumenEfectos: job.volumen_efectos ?? 1,
    ambientes: job.sin_efectos ? [] : planAmbientes(out),
    // Música: la pista que venga en el encargo o, si no hay, un fondo sonoro de la biblioteca según el tono
    voz: "job/voz.mp3",
    musica: job.musica_url ? await bajar(job.musica_url, "musica.mp3") : ({ tension: "sfx/drone_tension.mp3", misterio: "sfx/drone_misterio.mp3" }[job.fondo_sonoro] ?? null),
    volumenMusica: job.volumen_musica ?? (job.musica_url ? 0.14 : 0.2),
  };
  fs.writeFileSync(path.join(dir, "props.json"), JSON.stringify(props, null, 1));
  fs.writeFileSync(path.join(dir, "composicion.txt"), "Historia");
  // Portada hecha a propósito (diseño de FRAME); si no hay diseño, montar.sh usa la de respaldo
  if (job.portada && typeof job.portada === "object") {
    fs.writeFileSync(path.join(dir, "portada_props.json"), JSON.stringify({ diseno_portada: job.portada, reparto: job.reparto || {}, titulo: job.titulo || "" }, null, 1));
  } else if (fs.existsSync(path.join(dir, "portada_props.json"))) fs.rmSync(path.join(dir, "portada_props.json"));
  console.log(`Encargo ${job.id} (Historia): ${out.length} escenas, ${palabras.length} palabras, ${props.sonidos.length} efectos de sonido, ${props.ambientes.length} ambientes`);
  out.forEach((e, i) => console.log(`  escena ${i + 1}: ${e.desde.toFixed(2)}–${e.hasta.toFixed(2)} s`));
  process.exit(0);
}

const escenas = [...job.escenas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
const props = {
  id: job.id,
  gancho: job.gancho || "",
  subtitulos: job.subtitulos !== false,
  volumenMusica: job.volumen_musica ?? 0.12,
  palabras,
  voz: await bajar(job.voz_url, "voz.mp3"),
  musica: job.musica_url ? await bajar(job.musica_url, "musica.mp3") : null,
  escenas: [],
};
for (const [i, e] of escenas.entries()) {
  const n = String(i + 1).padStart(2, "0");
  props.escenas.push({
    duracion: Math.max(Number(e.duracion) || 4, 1.5),
    efecto: e.efecto || null,
    texto: e.texto_pantalla || null,
    clip: e.clip_url ? await bajar(e.clip_url, `clip_${n}.mp4`) : null,
    imagen: !e.clip_url && e.imagen_url ? await bajar(e.imagen_url, `escena_${n}.png`) : null,
  });
}
fs.writeFileSync(path.join(dir, "props.json"), JSON.stringify(props, null, 1));
fs.writeFileSync(path.join(dir, "composicion.txt"), "Short");
console.log(`Encargo ${job.id}: ${props.escenas.length} escenas, ${props.palabras.length} palabras`);
