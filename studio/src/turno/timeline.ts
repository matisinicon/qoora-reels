/**
 * Tiempos del vídeo TURNO, alineados con la toma real de voz (voz_turno.mp3, 31,16 s).
 * Frases detectadas por silencios (ffmpeg silencedetect −35 dB, 0,18 s).
 * Cada escena empieza en el hueco entre frases y dura lo que dura su locución.
 */
export const VOICE_FILE = "turno/voz_turno.mp3";
export const LEAD = 0.15; // la voz entra 0,15 s después del primer fotograma

type Phrase = { text: string; start: number; end: number };

// Frases con tiempo absoluto en la toma de voz
const V: [string, number, number][] = [
  ["Son las once y cuarenta y siete de la noche…", 0.0, 2.21],
  ["y este salón acaba de perder una clienta.", 2.77, 5.32],
  ["Mensajes sin contestar.", 5.75, 7.16],
  ["Cancelaciones de última hora.", 7.46, 8.94],
  ["Huecos vacíos en la agenda.", 9.2, 10.88],
  ["Por eso diseñamos esto.", 11.22, 12.81],
  ["Así funcionaría TURNO.", 13.12, 14.6],
  ["Responde al momento,", 14.91, 15.94],
  ["mira la agenda real…", 16.18, 17.32],
  ["y reserva la cita.", 17.55, 18.61],
  ["¿Que alguien cancela?", 18.92, 19.72],
  ["TURNO avisa a la lista de espera…", 20.01, 21.66],
  ["y el hueco se llena solo.", 21.85, 23.31],
  ["Mientras tú duermes…", 23.63, 24.71],
  ["tu agenda sigue trabajando.", 24.92, 26.47],
  ["¿Tu negocio también necesita un agente personalizado?", 26.76, 29.38],
  ["Comenta AGENTE.", 29.68, 30.82],
];

// Cortes de escena en tiempo de voz (en los silencios)
const CUTS = { problem: 5.53, reveal: 11.05, step1: 14.75, step2: 18.76, step3: 19.9, result: 23.47, final: 26.6, end: 31.75 };

const scene = (from: number, to: number, startAtZero = false) => {
  const s0 = startAtZero ? 0 : from + LEAD;
  const s1 = to + LEAD;
  const phrases: Phrase[] = V.filter(([, a]) => a >= from - 0.01 && a < to)
    .map(([text, a, b]) => ({ text, start: a + LEAD - s0, end: b + LEAD - s0 }));
  return { dur: +(s1 - s0).toFixed(3), phrases, rel: (voiceT: number) => voiceT + LEAD - s0 };
};

const hook = scene(0, CUTS.problem, true);
const problem = scene(CUTS.problem, CUTS.reveal);
const reveal = scene(CUTS.reveal, CUTS.step1);
const step1 = scene(CUTS.step1, CUTS.step2);
const step2 = scene(CUTS.step2, CUTS.step3);
const step3 = scene(CUTS.step3, CUTS.result);
const result = scene(CUTS.result, CUTS.final);
const final = scene(CUTS.final, CUTS.end);

export const SCENES = {
  hook,
  problem,
  reveal,
  step1: { ...step1, reserved: step1.rel(17.55) },
  step2: { ...step2, cancel: step2.rel(19.3) },
  step3: { ...step3, fill: step3.rel(22.55) },
  result,
  final: { ...final, cta: final.rel(29.68) },
};

export const TOTAL = Object.values(SCENES).reduce((a, s) => a + s.dur, 0);
