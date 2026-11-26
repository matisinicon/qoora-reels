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

const escenas = [...job.escenas].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
const props = {
  id: job.id,
  gancho: job.gancho || "",
  subtitulos: job.subtitulos !== false,
  volumenMusica: job.volumen_musica ?? 0.12,
  palabras: (job.palabras || []).map((w) => (Array.isArray(w) ? { t: String(w[0]), s: +w[1], e: +w[2] } : { t: String(w.texto), s: +w.inicio, e: +w.fin })),
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
console.log(`Encargo ${job.id}: ${props.escenas.length} escenas, ${props.palabras.length} palabras`);
