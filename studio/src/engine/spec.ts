/**
 * QOORA Reels Engine · formato del guion estructurado (ReelSpec) y cálculo de tiempos.
 *
 * El agente de montaje solo escribe un JSON con este formato. El motor:
 *  1. alinea cada frase del guion con las palabras medidas por Scribe (words),
 *  2. corta las escenas en los silencios entre frases,
 *  3. coloca cada evento visual en el instante exacto de su palabra clave.
 */
import { z } from "zod";

const word = z.tuple([z.string(), z.number(), z.number()]);
const line = z.union([z.string(), z.object({ say: z.string(), show: z.string() })]);

const base = { phrases: z.tuple([z.number(), z.number()]) }; // [primera, última] frase de la escena (índices de `script`)

export const sceneSchema = z.discriminatedUnion("type", [
  // ---------- línea oscura (marca) ----------
  z.object({ ...base, type: z.literal("hook_burst"), title: z.string(), accent: z.string().optional(), bubble: z.string(), strikeWord: z.string(), burstWord: z.string(), count: z.number().min(2).max(8), big: z.string(), bigAccent: z.string().optional() }),
  z.object({
    ...base,
    type: z.literal("versus"),
    title: z.string(),
    accent: z.string().optional(),
    left: z.object({ label: z.string(), lines: z.array(z.string()).min(1).max(3), end: z.string() }),
    right: z.object({ label: z.string(), steps: z.array(z.object({ label: z.string(), word: z.string() })).min(2).max(4) }),
    badge: z.object({ text: z.string(), word: z.string() }).optional(),
  }),
  z.object({ ...base, type: z.literal("core_reveal"), name: z.string(), nameAccent: z.string().optional(), tagline: z.string(), nameWord: z.string(), taglineWord: z.string() }),
  z.object({
    ...base,
    type: z.literal("system"),
    titles: z.array(z.object({ text: z.string(), accent: z.string().optional(), word: z.string() })).min(1).max(3),
    modules: z.array(z.object({ label: z.string(), word: z.string() })).min(3).max(6),
    teamWord: z.string().optional(),
    tools: z.array(z.object({ label: z.string(), word: z.string() })).max(6).optional(),
    toolsWord: z.string().optional(),
  }),
  z.object({ ...base, type: z.literal("command_split"), title: z.string(), accent: z.string().optional(), command: z.string(), actions: z.array(z.string()).length(4), word: z.string() }),
  z.object({ ...base, type: z.literal("pipeline"), title: z.string(), accent: z.string().optional(), from: z.string(), to: z.string(), steps: z.array(z.string()).length(4), word: z.string() }),
  z.object({ ...base, type: z.literal("approval"), title: z.string(), accent: z.string().optional(), proposal: z.string(), proposeWord: z.string(), approveWord: z.string(), result: z.string() }),
  z.object({ ...base, type: z.literal("manifesto"), line1: z.string(), line2: z.string(), accent: z.string().optional(), en: z.string().optional(), word: z.string() }),
  z.object({ ...base, type: z.literal("cta_dark"), question: z.string(), accent: z.string().optional(), ctaWord: z.string(), ctaText: z.string().optional() }),
  // móvil que reproduce un vídeo real (p. ej. un Short de VIRALFORGE)
  z.object({ ...base, type: z.literal("phone_clip"), title: z.string(), accent: z.string().optional(), clip: z.string(), tag: z.string().optional() }),
  // circuito de agentes alrededor de una ventana que muestra lo que produce cada uno
  z.object({
    ...base,
    type: z.literal("agent_chain"),
    agents: z
      .array(
        z.object({
          label: z.string(),
          word: z.string(),
          title: z.string(),
          accent: z.string().optional(),
          preview: z.enum(["thumbs", "chart", "ficha", "guion", "hoja", "video", "check", "calendario"]),
        })
      )
      .min(3)
      .max(8),
    connect: z.object({ word: z.string(), title: z.string(), accent: z.string().optional() }).optional(),
    loop: z.object({ word: z.string(), title: z.string(), accent: z.string().optional() }).optional(),
    learn: z.object({ word: z.string(), title: z.string(), accent: z.string().optional() }).optional(),
    clip: z.string().optional(),
    images: z.array(z.string()).optional(),
    sheet: z.string().optional(),
  }),
  // ---------- línea de casos (crema) ----------
  z.object({ ...base, type: z.literal("hook_chat"), pre: z.string(), slam: z.string(), business: z.string(), time: z.string(), message: z.string(), stamp: z.string(), stampWord: z.string() }),
  z.object({ ...base, type: z.literal("chips"), title: z.string(), accent: z.string().optional(), chips: z.array(z.object({ text: z.string(), tone: z.enum(["bad", "warn", "neutral", "ok"]), word: z.string() })).min(3).max(5) }),
  z.object({ ...base, type: z.literal("mascot_reveal"), pre: z.string(), name: z.string(), slogan: z.string(), nameWord: z.string(), headset: z.boolean().optional() }),
  z.object({
    ...base,
    type: z.literal("chat_steps"),
    step: z.number(),
    title: z.string(),
    accent: z.string().optional(),
    business: z.string(),
    time: z.string(),
    messages: z.array(z.object({ from: z.enum(["client", "agent"]), text: z.string(), word: z.string(), ok: z.boolean().optional() })).min(2).max(5),
  }),
  z.object({
    ...base,
    type: z.literal("agenda"),
    step: z.number().optional(),
    title: z.string(),
    accent: z.string().optional(),
    heading: z.string(),
    slots: z.array(z.object({ time: z.string(), who: z.string(), state: z.enum(["ok", "cancel", "empty", "filled"]), becomes: z.enum(["ok", "cancel", "empty", "filled"]).optional(), whoAfter: z.string().optional(), word: z.string().optional() })).min(1).max(5),
    confetti: z.boolean().optional(),
    note: z.string().optional(),
  }),
  z.object({ ...base, type: z.literal("cta_cream"), name: z.string(), ctaWord: z.string(), headset: z.boolean().optional() }),
]);

export const reelSpecSchema = z.object({
  id: z.string(),
  line: z.enum(["dark", "cream"]),
  signature: z.object({ name: z.string(), tagline: z.string() }).optional(), // solo línea crema
  voice: z.string(), // archivo en public/
  script: z.array(line), // frases tal y como se dicen (say) y se muestran (show)
  words: z.array(word), // Scribe: [texto, inicio, fin]
  scenes: z.array(sceneSchema).min(3),
});
export type ReelSpec = z.infer<typeof reelSpecSchema>;
export type Scene = z.infer<typeof sceneSchema>;

export const LEAD = 0.15;
export const TAIL = 0.85;

const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, "");
const sayOf = (l: ReelSpec["script"][number]) => (typeof l === "string" ? l : l.say);
const showOf = (l: ReelSpec["script"][number]) => (typeof l === "string" ? l : l.show);

/** Asigna a cada frase su rango de palabras (secuencial: mismo número de tokens) */
export const alignPhrases = (spec: ReelSpec) => {
  let w = 0;
  return spec.script.map((l) => {
    const n = sayOf(l).split(/\s+/).filter(Boolean).length;
    const first = Math.min(w, spec.words.length - 1);
    const last = Math.min(w + n - 1, spec.words.length - 1);
    w += n;
    return { show: showOf(l), say: sayOf(l), start: spec.words[first][1], end: spec.words[last][2], first, last };
  });
};

export type Timed = {
  scene: Scene;
  from: number; // segundo absoluto del vídeo en que empieza la escena
  dur: number;
  phrases: { text: string; start: number; end: number }[]; // relativas a la escena
  at: (word: string, fallback?: number) => number; // instante (relativo) en que se dice la palabra dentro de la escena
};

export const timeline = (spec: ReelSpec): { scenes: Timed[]; total: number } => {
  const P = alignPhrases(spec);
  const cutBefore = (i: number) => (i === 0 ? 0 : (P[i - 1].end + P[i].start) / 2 + LEAD);
  const out: Timed[] = spec.scenes.map((scene, k) => {
    const [a, b] = scene.phrases;
    const from = k === 0 ? 0 : cutBefore(a);
    const to = k === spec.scenes.length - 1 ? P[P.length - 1].end + LEAD + TAIL : cutBefore(b + 1);
    const words = spec.words.slice(P[a].first, P[b].last + 1);
    return {
      scene,
      from,
      dur: to - from,
      phrases: P.slice(a, b + 1).map((p) => ({ text: p.show, start: p.start + LEAD - from, end: p.end + LEAD - from })),
      at: (word: string, fallback = 0.3) => {
        const hit = words.find(([w]) => norm(w).startsWith(norm(word)));
        return hit ? hit[1] + LEAD - from : fallback;
      },
    };
  });
  return { scenes: out, total: out.reduce((s, x) => s + x.dur, 0) };
};
