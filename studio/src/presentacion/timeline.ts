/**
 * Tiempos del vídeo de presentación de QOORA AI.
 * V = frases con tiempo absoluto en la toma de voz. CUTS = cortes de escena (en silencios).
 * Tiempos medidos palabra a palabra con ElevenLabs Scribe sobre la toma real (49,4 s).
 */
export const VOICE_FILE = "presentacion/voz_presentacion.mp3";
export const LEAD = 0.15;
export const HAS_VOICE = true;

export const V: [string, number, number][] = [
  ["Tu empresa no necesita otro chatbot.", 0.0, 2.24],
  ["Necesita seis agentes.", 2.56, 4.4],
  ["Un chatbot contesta preguntas.", 4.56, 6.44],
  ["Un agente investiga, decide… y actúa.", 6.56, 9.76],
  ["Incluso a las tres de la madrugada.", 10.08, 11.84],
  ["Somos QOORA.", 12.24, 13.12],
  ["Ingeniería de inteligencia agéntica.", 13.36, 15.52],
  ["Diseñamos agentes especializados.", 15.76, 17.8],
  ["Investigación. Datos. Estrategia. Operaciones. Atención al cliente. Automatización.", 17.92, 24.08],
  ["Y los hacemos trabajar juntos, como un equipo.", 24.24, 27.08],
  ["Los conectamos con lo que ya usas:", 27.2, 29.12],
  ["tu CRM, tus bases de datos, tus herramientas.", 29.16, 32.32],
  ["Una orden se convierte en acciones.", 32.56, 34.68],
  ["Una tarea manual… en un proceso que funciona solo.", 34.8, 38.0],
  ["Y siempre con personas al mando:", 38.04, 40.08],
  ["el agente propone, tú apruebas.", 40.16, 42.56],
  ["No automatices tareas. Construye inteligencia.", 42.72, 45.88],
  ["¿Qué agente necesita tu negocio?", 46.0, 47.92],
  ["Comenta AGENTE.", 48.0, 49.44],
];

export const WORDS: [string, number, number][] = [
  ["Tu", 0.0, 0.16],
  ["empresa", 0.4, 0.64],
  ["no", 0.72, 0.8],
  ["necesita", 0.88, 1.36],
  ["otro", 1.44, 1.68],
  ["chatbot.", 1.8, 2.24],
  ["Necesita", 2.56, 3.12],
  ["seis", 3.28, 3.52],
  ["agentes.", 3.6, 4.4],
  ["Un", 4.56, 4.64],
  ["chatbot", 4.72, 5.2],
  ["contesta", 5.32, 5.68],
  ["preguntas.", 5.76, 6.44],
  ["Un", 6.56, 6.64],
  ["agente", 6.72, 7.12],
  ["investiga,", 7.28, 8.16],
  ["decide…", 8.28, 9.04],
  ["y", 9.08, 9.12],
  ["actúa.", 9.2, 9.76],
  ["Incluso", 10.08, 10.48],
  ["a", 10.52, 10.56],
  ["las", 10.64, 10.72],
  ["tres", 10.8, 10.96],
  ["de", 11.04, 11.12],
  ["la", 11.16, 11.2],
  ["madrugada.", 11.28, 11.84],
  ["Somos", 12.24, 12.64],
  ["QOORA.", 12.72, 13.12],
  ["Ingeniería", 13.36, 14.0],
  ["de", 14.04, 14.08],
  ["inteligencia", 14.16, 14.8],
  ["agéntica.", 14.88, 15.52],
  ["Diseñamos", 15.76, 16.24],
  ["agentes", 16.32, 16.72],
  ["especializados.", 16.8, 17.8],
  ["Investigación.", 17.92, 18.8],
  ["Datos.", 19.12, 19.72],
  ["Estrategia.", 19.84, 20.68],
  ["Operaciones.", 20.8, 21.6],
  ["Atención", 21.68, 22.16],
  ["al", 22.24, 22.32],
  ["cliente.", 22.4, 22.96],
  ["Automatización.", 23.04, 24.08],
  ["Y", 24.24, 24.32],
  ["los", 24.4, 24.48],
  ["hacemos", 24.56, 24.88],
  ["trabajar", 24.92, 25.28],
  ["juntos,", 25.36, 26.08],
  ["como", 26.2, 26.32],
  ["un", 26.4, 26.48],
  ["equipo.", 26.56, 27.08],
  ["Los", 27.2, 27.36],
  ["conectamos", 27.4, 27.84],
  ["con", 27.92, 28.0],
  ["lo", 28.08, 28.12],
  ["que", 28.16, 28.24],
  ["ya", 28.32, 28.4],
  ["usas:", 28.48, 29.12],
  ["tu", 29.16, 29.2],
  ["CRM,", 29.28, 30.16],
  ["tus", 30.213, 30.32],
  ["bases", 30.4, 30.64],
  ["de", 30.68, 30.72],
  ["datos,", 30.8, 31.36],
  ["tus", 31.4, 31.52],
  ["herramientas.", 31.6, 32.32],
  ["Una", 32.56, 32.72],
  ["orden", 32.8, 33.12],
  ["se", 33.2, 33.28],
  ["convierte", 33.36, 33.76],
  ["en", 33.84, 33.92],
  ["acciones.", 34.24, 34.68],
  ["Una", 34.8, 34.96],
  ["tarea", 35.04, 35.28],
  ["manual…", 35.52, 35.92],
  ["en", 36.0, 36.08],
  ["un", 36.12, 36.16],
  ["proceso", 36.24, 36.64],
  ["que", 36.72, 36.8],
  ["funciona", 36.88, 37.36],
  ["solo.", 37.52, 38.0],
  ["Y", 38.04, 38.08],
  ["siempre", 38.24, 38.64],
  ["con", 38.72, 38.8],
  ["personas", 38.88, 39.36],
  ["al", 39.44, 39.52],
  ["mando:", 39.68, 40.08],
  ["el", 40.16, 40.24],
  ["agente", 40.32, 40.56],
  ["propone,", 40.64, 41.36],
  ["tú", 41.413, 41.52],
  ["apruebas.", 41.76, 42.56],
  ["No", 42.72, 42.8],
  ["automatices", 43.08, 43.44],
  ["tareas.", 43.52, 44.12],
  ["Construye", 44.24, 44.88],
  ["inteligencia.", 45.0, 45.88],
  ["¿Qué", 46.0, 46.08],
  ["agente", 46.16, 46.56],
  ["necesita", 46.6, 47.04],
  ["tu", 47.08, 47.12],
  ["negocio?", 47.2, 47.92],
  ["Comenta", 48.0, 48.4],
  ["AGENTE.", 48.64, 49.44],
];

export const CUTS = {
  hook: 0,
  versus: 4.48,
  reveal: 12.0,
  system: 15.64,
  order: 32.44,
  process: 34.74,
  human: 38.02,
  manifesto: 42.64,
  cta: 45.94,
  end: 50.3,
};

type Phrase = { text: string; start: number; end: number };

/** Escena: duración, frases relativas y conversor de tiempo de voz → tiempo de escena */
export const scene = (from: number, to: number, first = false) => {
  const s0 = first ? 0 : from + LEAD;
  const s1 = to + LEAD;
  const phrases: Phrase[] = V.filter(([, a]) => a >= from - 0.01 && a < to).map(([text, a, b]) => ({ text, start: a + LEAD - s0, end: b + LEAD - s0 }));
  const rel = (voiceT: number) => voiceT + LEAD - s0;
  return { dur: +(s1 - s0).toFixed(3), phrases, rel };
};

const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, "");
/** Momento exacto (tiempo de voz) en que empieza la palabra `word` dentro de la frase `phraseIdx` */
export const wordTime = (phraseIdx: number, word: string) => {
  const [, a, b] = V[phraseIdx];
  const hit = WORDS.find(([w, s0]) => s0 >= a - 0.01 && s0 <= b && norm(w).startsWith(norm(word)));
  return hit ? hit[1] : a;
};

export const S = {
  hook: scene(CUTS.hook, CUTS.versus, true),
  versus: scene(CUTS.versus, CUTS.reveal),
  reveal: scene(CUTS.reveal, CUTS.system),
  system: scene(CUTS.system, CUTS.order),
  order: scene(CUTS.order, CUTS.process),
  process: scene(CUTS.process, CUTS.human),
  human: scene(CUTS.human, CUTS.manifesto),
  manifesto: scene(CUTS.manifesto, CUTS.cta),
  cta: scene(CUTS.cta, CUTS.end),
};

export const TOTAL = Object.values(S).reduce((a, s) => a + s.dur, 0);
