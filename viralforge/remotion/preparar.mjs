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

// ── Efectos de sonido: se colocan solos según lo que pasa en cada escena ──
const SFX = ["whoosh", "pop", "ding", "boing", "impacto", "tension", "explosion", "scratch", "tictac", "silbato"];
function planSonidos(escenas) {
  const ev = [];
  const poner = (t, nombre, vol) => { if (SFX.includes(nombre) && t >= 0) ev.push({ t: +t.toFixed(3), nombre, vol }); };
  escenas.forEach((e, i) => {
    const dur = e.hasta - e.desde;
    if (e.sonido) poner(e.desde, e.sonido, 0.55);
    else if (i === 0) poner(0, "impacto", 0.55);
    else poner(Math.max(e.desde - 0.08, 0), i % 3 === 2 ? "silbato" : "whoosh", 0.32);
    if (e.camara === "temblor") poner(e.desde + 0.05, "impacto", 0.45);
    let pops = 0;
    for (const x of e.elementos || []) {
      const t = e.desde + (Number(x.en) || 0) * dur + 0.05;
      const n = String(x.nombre || x.tipo || "");
      if (x.sonido) poner(t, x.sonido, 0.5);
      else if (x.tipo === "efecto" && n === "explosion") poner(t, "explosion", 0.5);
      else if (x.tipo === "efecto" && n === "destello") poner(t, "ding", 0.4);
      else if (x.tipo === "contador") poner(t, "tictac", 0.4);
      else if (n === "interrogacion") poner(t, "boing", 0.45);
      else if (n === "exclamacion") poner(t, "scratch", 0.45);
      else if (n === "bombilla" || n === "check") poner(t, "ding", 0.45);
      else if (n === "reloj") poner(t, "tictac", 0.35);
      else if (x.entra === "pop" && pops < 1 && Number(x.en) > 0.05) { poner(t, "pop", 0.4); pops++; }
    }
  });
  // tensión justo antes de la escena final (la revelación)
  if (escenas.length > 3) { const u = escenas[escenas.length - 1]; poner(Math.max(u.desde - 1.6, 0), "tension", 0.35); }
  ev.sort((a, b) => a.t - b.t);
  const limpio = [];
  for (const x of ev) if (!limpio.length || x.t - limpio[limpio.length - 1].t >= 0.35) limpio.push(x);
  return limpio;
}

if (job.composicion === "Historia") {
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
    return { ...resto, desde, hasta };
  });
  const props = {
    id: job.id, titulo: job.titulo || "", reparto: job.reparto || {}, palabras, escenas: out,
    sonidos: job.sin_efectos ? [] : planSonidos(out), volumenEfectos: job.volumen_efectos ?? 1,
    voz: "job/voz.mp3", musica: job.musica_url ? await bajar(job.musica_url, "musica.mp3") : null, volumenMusica: job.volumen_musica ?? 0.1,
  };
  fs.writeFileSync(path.join(dir, "props.json"), JSON.stringify(props, null, 1));
  fs.writeFileSync(path.join(dir, "composicion.txt"), "Historia");
  console.log(`Encargo ${job.id} (Historia): ${out.length} escenas, ${palabras.length} palabras, ${props.sonidos.length} efectos de sonido`);
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
