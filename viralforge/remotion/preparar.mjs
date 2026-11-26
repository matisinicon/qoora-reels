// VIRALFORGE · Descarga los recursos de un encargo a public/job/ y escribe props.json
// Uso: node preparar.mjs ../jobs/VF-0002.json
import fs from "node:fs";
import path from "node:path";

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
const palabras = (job.palabras || []).map((w) => (Array.isArray(w) ? { t: String(w[0]), s: +w[1], e: +w[2] } : { t: String(w.texto), s: +w.inicio, e: +w.fin }));

if (job.composicion === "Historia") {
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
    const desde = i === 0 ? 0 : Math.max(palabras[e._pos].s - 0.12, 0);
    const sig = escenas[i + 1];
    const hasta = sig ? Math.max(palabras[sig._pos].s - 0.12, desde + 0.4) : palabras[palabras.length - 1].e + 0.6;
    const { _pos, texto, ...resto } = e;
    return { ...resto, desde, hasta };
  });
  const props = {
    id: job.id, titulo: job.titulo || "", reparto: job.reparto || {}, palabras, escenas: out,
    voz: await bajar(job.voz_url, "voz.mp3"), musica: job.musica_url ? await bajar(job.musica_url, "musica.mp3") : null, volumenMusica: job.volumen_musica ?? 0.1,
  };
  fs.writeFileSync(path.join(dir, "props.json"), JSON.stringify(props, null, 1));
  fs.writeFileSync(path.join(dir, "composicion.txt"), "Historia");
  console.log(`Encargo ${job.id} (Historia): ${out.length} escenas, ${palabras.length} palabras`);
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
