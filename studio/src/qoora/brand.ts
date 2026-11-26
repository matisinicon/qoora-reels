/**
 * QOORA AI · Brand DNA v1.0 en Remotion.
 * Valores de brand/VISUAL_BIBLE.md, CAMERA_LANGUAGE.md y SOUND_BIBLE.md.
 * No cambies nada aquí sin subir la versión en brand/BRAND_VERSION.md.
 */
import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

export const BRAND_VERSION = "1.0";

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export const C = {
  bg: "#FAF7F2",
  ink: "#1C1B19",
  accent: "#F07D1A",
  accentSoft: "#FDEAD6",
  muted: "#706A62",
  line: "#E8E1D6",
  card: "#FFFFFF",
  ok: "#2E9E5B",
  okSoft: "#DEF3E6",
  bad: "#D64545",
  badSoft: "#FAE1E1",
  amber: "#CD8C14",
  confetti: "#FFC43D",
} as const;

export const FONT = { head: "Poppins", body: "Inter" } as const;

export const loadBrandFonts = () =>
  Promise.all([
    loadFont({ family: FONT.head, url: staticFile("qoora/fonts/Poppins-Bold.ttf"), weight: "700" }),
    loadFont({ family: FONT.head, url: staticFile("qoora/fonts/Poppins-Medium.ttf"), weight: "500" }),
    loadFont({ family: FONT.body, url: staticFile("qoora/fonts/Inter-Regular.otf"), weight: "400" }),
    loadFont({ family: FONT.body, url: staticFile("qoora/fonts/Inter-Medium.otf"), weight: "500" }),
    loadFont({ family: FONT.body, url: staticFile("qoora/fonts/Inter-SemiBold.otf"), weight: "600" }),
    loadFont({ family: FONT.body, url: staticFile("qoora/fonts/Inter-Bold.otf"), weight: "700" }),
  ]);

/** Curvas de la marca */
export const EASE = {
  out: Easing.out(Easing.cubic), // QOORA_EASE_OUT
  inOut: Easing.inOut(Easing.cubic), // QOORA_EASE_IN_OUT
  back: Easing.out(Easing.back(1.7)), // QOORA_EASE_BACK
};

/** Biblioteca de efectos QOORA_SFX con su volumen de mezcla (efectos ×0.6 sobre la voz). */
export const SFX = {
  OPEN: { file: "QOORA_SFX_OPEN.wav", vol: 0.8 },
  WHOOSH: { file: "QOORA_SFX_WHOOSH.wav", vol: 0.55 },
  POP: { file: "QOORA_SFX_POP.wav", vol: 0.5 },
  TICK: { file: "QOORA_SFX_TICK.wav", vol: 0.5 },
  TYPE: { file: "QOORA_SFX_TYPE.wav", vol: 0.55 },
  CLICK: { file: "QOORA_SFX_CLICK.wav", vol: 0.7 },
  DING: { file: "QOORA_SFX_DING.wav", vol: 0.5 },
  BUZZ: { file: "QOORA_SFX_BUZZ.wav", vol: 0.6 },
  BOOM: { file: "QOORA_SFX_BOOM.wav", vol: 0.8 },
  RISER: { file: "QOORA_SFX_RISER.wav", vol: 0.6 },
  REVEAL: { file: "QOORA_SFX_REVEAL.wav", vol: 0.8 },
  REWARD: { file: "QOORA_SFX_REWARD.wav", vol: 0.6 },
  IMPACT: { file: "QOORA_SFX_IMPACT.wav", vol: 0.8 },
} as const;
export type SfxName = keyof typeof SFX;
export const SHAKE_SFX: SfxName[] = ["BOOM", "IMPACT", "BUZZ", "REWARD", "REVEAL", "OPEN"];
export const MIX = { voice: 0.9, sfx: 0.6 } as const;

/** Voz oficial (VOICE_BIBLE.md) */
export const VOICE = {
  provider: "ElevenLabs",
  model: "eleven_v4",
  name: "Manu Arias - Español Viral",
  voiceId: "cfU714yVeokYQrpdyev5",
} as const;
