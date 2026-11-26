/**
 * QOORA AI · Componentes de marca (Brand DNA v1.0)
 * Nombres = presets de brand/CAMERA_LANGUAGE.md, MOTION_PRESETS.md y SOUND_BIBLE.md
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT, MIX, SFX, SfxName } from "./brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------------------------------------------------------------- cámara */
export type CameraPreset =
  | { preset: "QOORA_PUSH_IN_01"; focus?: [number, number] }
  | { preset: "QOORA_SLOW_ZOOM_01"; focus?: [number, number] }
  | { preset: "QOORA_PULL_OUT_01" | "QOORA_PULL_OUT_02"; focus?: [number, number] }
  | { preset: "QOORA_TILT_IN_R" | "QOORA_TILT_IN_L" }
  | { preset: "QOORA_DRIFT_LAT_01" };

/**
 * Escena de marca: aplica UN movimiento principal + QOORA_PUNCH_IN_01 al entrar
 * + QOORA_WHIP_OUT_01 al salir (desactivable en la última escena) + QOORA_IMPACT_SHAKE_01.
 */
export const BrandScene: React.FC<{
  camera: CameraPreset;
  whipOut?: boolean;
  shakeAt?: number[]; // segundos (desde el inicio de la escena) donde suena un impacto
  bg?: string; // color de lienzo (por defecto, crema de la marca)
  background?: React.ReactNode; // fondo propio (por defecto, QOORA_LIVING_BG)
  children: React.ReactNode;
}> = ({ camera, whipOut = true, shakeAt = [], bg = C.bg, background, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;
  const dur = durationInFrames / fps;
  const focus = "focus" in camera && camera.focus ? camera.focus : [540, 900];

  let scale = 1;
  let rotateY = 0;
  let tx = 0;
  switch (camera.preset) {
    case "QOORA_PUSH_IN_01":
      scale = interpolate(t, [0, dur], [1, 1.07], { ...clamp, easing: EASE.inOut });
      break;
    case "QOORA_SLOW_ZOOM_01":
      scale = interpolate(t, [0, dur], [1, 1.03], { ...clamp, easing: EASE.inOut });
      break;
    case "QOORA_PULL_OUT_01":
      scale = interpolate(t, [0, 0.7], [1.9, 1], { ...clamp, easing: EASE.out });
      break;
    case "QOORA_PULL_OUT_02":
      scale = interpolate(t, [0, 0.7], [1.5, 1], { ...clamp, easing: EASE.out });
      break;
    case "QOORA_TILT_IN_R":
    case "QOORA_TILT_IN_L": {
      const side = camera.preset === "QOORA_TILT_IN_R" ? 1 : -1;
      const k = interpolate(t, [0, 0.6], [1, 0], { ...clamp, easing: EASE.out });
      rotateY = -14 * k * side;
      tx = 120 * k * side;
      scale = interpolate(t, [0, dur], [1, 1.05], { ...clamp, easing: EASE.inOut });
      break;
    }
    case "QOORA_DRIFT_LAT_01":
      tx = interpolate(t, [0, dur], [-20, 20], { ...clamp, easing: EASE.inOut });
      break;
  }

  // QOORA_PUNCH_IN_01
  scale *= interpolate(t, [0, 0.22], [1.14, 1], { ...clamp, easing: EASE.out });
  // QOORA_WHIP_OUT_01
  let blur = 0;
  if (whipOut && t > dur - 0.14) {
    const q = (t - (dur - 0.14)) / 0.14;
    scale *= 1 + 0.35 * q * q;
    blur = 6 * q;
  }
  // QOORA_IMPACT_SHAKE_01
  let sx = 0;
  let sy = 0;
  for (const h of shakeAt) {
    const dt = t - h;
    if (dt >= 0 && dt < 0.28) {
      const amp = 16 * (1 - dt / 0.28);
      sx += amp * Math.sin(dt * 90);
      sy += amp * Math.cos(dt * 70);
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bg, perspective: 1400, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          width,
          height,
          transformOrigin: `${focus[0]}px ${focus[1]}px`,
          scale: String(scale),
          rotate: `y ${rotateY}deg`,
          translate: `${tx + sx}px ${sy}px`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        {background ?? <LivingBackground />}
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- fondo */
/** QOORA_LIVING_BG: 5 círculos naranja suaves que flotan + rejilla de puntos que baja a 18 px/s */
export const LivingBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const blobs: [number, number, number, number][] = [
    [120, 300, 160, 0.35],
    [980, 760, 210, 0.28],
    [90, 1250, 130, 0.42],
    [930, 1650, 180, 0.31],
    [560, 120, 90, 0.5],
  ];
  const offset = (t * 18) % 80;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(205,195,180,.35) 3px, transparent 3.5px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `0px ${offset}px`,
        }}
      />
      {blobs.map(([bx, by, r, v], k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: bx + 40 * Math.sin(t * v + k) - r,
            top: by + 50 * Math.cos(t * v * 0.8 + k * 2) - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: "rgba(240,125,26,.086)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- textos */
/** QOORA_SIGNATURE: firma superior izquierda */
export const Signature: React.FC<{ name: string; tagline: string }> = ({ name, tagline }) => (
  <div style={{ position: "absolute", left: 70, top: 112, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 22, height: 22, borderRadius: 6, background: C.accent }} />
    <span style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 34, color: C.ink }}>{name}</span>
    <span style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: 28, color: C.muted }}>· {tagline}</span>
  </div>
);

/** QOORA_TEXT_RISE: titular que sube 30 px y aparece. `accent` = palabra en naranja */
export const Title: React.FC<{
  text: string;
  accent?: string;
  y: number;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ text, accent, y, size = 84, delay = 0, color = C.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - delay;
  const parts = accent ? text.split(accent) : [text];
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        color,
        opacity: interpolate(t, [0, 0.45], [0, 1], { ...clamp, easing: EASE.out }),
        translate: `0px ${interpolate(t, [0, 0.5], [30, 0], { ...clamp, easing: EASE.out })}px`,
      }}
    >
      {parts[0]}
      {accent && <span style={{ color: C.accent }}>{accent}</span>}
      {parts[1]}
    </div>
  );
};

/** QOORA_TEXT_SLAM: palabra de impacto gigante con rebote */
export const Slam: React.FC<{ word: string; y: number; delay: number; size?: number }> = ({ word, y, delay, size = 190 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - delay;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: size,
        color: C.accent,
        opacity: t < 0 ? 0 : 1,
        scale: String(interpolate(t, [0, 0.3], [2.2, 1], { ...clamp, easing: EASE.back })),
      }}
    >
      {word}
    </div>
  );
};

/** Etiqueta "PASO 0X" */
export const StepLabel: React.FC<{ n: number; y: number }> = ({ n, y }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: 32,
        color: C.accent,
        background: C.accentSoft,
        borderRadius: 14,
        padding: "8px 22px",
      }}
    >
      PASO {String(n).padStart(2, "0")}
    </span>
  </div>
);

/* ---------------------------------------------------------------- subtítulos */
type Word = { text: string; start: number; end: number };
/** Reparte una frase en palabras (tiempo proporcional a la longitud), igual que en el vídeo de RASTRO */
export const wordsFromPhrase = (text: string, start: number, end: number): Word[] => {
  const ws = text.split(" ");
  const w = ws.map((x) => x.length + 2);
  const tot = w.reduce((a, b) => a + b, 0);
  let t = start;
  return ws.map((x, i) => {
    const d = ((end - start) * w[i]) / tot;
    const o = { text: x, start: t, end: t + d };
    t += d;
    return o;
  });
};
const groupWords = (words: Word[]) => {
  const groups: Word[][] = [];
  let g: Word[] = [];
  for (const w of words) {
    // ≤3 palabras y ≤16 letras por grupo: si la palabra no cabe, abre grupo nuevo
    const letters = g.reduce((a, b) => a + b.text.length, 0);
    if (g.length && letters + w.text.length > 16) {
      groups.push(g);
      g = [];
    }
    g.push(w);
    if (g.length === 3 || /[.,:?…]$/.test(w.text)) {
      groups.push(g);
      g = [];
    }
  }
  if (g.length) groups.push(g);
  return groups;
};

/** QOORA_SUBS_KARAOKE: grupos de ≤3 palabras, pastilla blanca, palabra activa en naranja */
export const Subtitles: React.FC<{
  phrases: { text: string; start: number; end: number }[];
  y?: number; // borde superior de la pastilla
  dark?: boolean; // versión línea corporativa oscura
}> = ({ phrases, y = 1442, dark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groups = phrases.flatMap((p) => groupWords(wordsFromPhrase(p.text, p.start, p.end)));
  const g = groups.find((x) => t >= x[0].start && t < x[x.length - 1].end + 0.05);
  if (!g) return null;
  const s = interpolate(t, [g[0].start, g[0].start + 0.12], [0.82, 1], { ...clamp, easing: EASE.out });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          scale: String(s),
          transformOrigin: "50% 100%",
          background: dark ? "rgba(16,16,16,.88)" : "rgba(255,255,255,.92)",
          border: dark ? "2px solid #2a2a2a" : "2px solid rgba(0,0,0,.1)",
          borderRadius: 30,
          padding: "14px 34px",
          display: "flex",
          gap: 20,
          fontFamily: FONT.head,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.2,
        }}
      >
        {g.map((w, i) => (
          <span key={i} style={{ color: t >= w.start && t < w.end + 0.02 ? (dark ? "#FF8500" : C.accent) : dark ? "#FFFFFF" : C.ink }}>
            {w.text.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- mascota */
/** Mascota con QOORA_JUMP_01 (agacharse, vuelo, aterrizaje con aplastamiento) + QOORA_MASCOT_SHADOW */
export const Mascot: React.FC<{
  view?: "frente" | "tres_cuartos" | "lado" | "espalda";
  name?: string;
  cx: number;
  baseY: number;
  width: number;
  jumpAt?: number; // segundos
  dropFrom?: number; // px: cae desde arriba al empezar (BRAND_REVEAL)
  accessory?: React.ReactNode; // capa encima de la mascota (p. ej. auriculares de TURNO), en coordenadas de la imagen
}> = ({ view = "frente", name = "RASTRO", cx, baseY, width, jumpAt, dropFrom, accessory }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let dy = 0;
  let sx = 1;
  let sy = 1;
  if (dropFrom) {
    const k = interpolate(t, [0, 0.45], [1, 0], { ...clamp, easing: Easing2.inQuad });
    dy = -dropFrom * k;
    const land = t - 0.45;
    if (land >= 0 && land < 0.25) {
      const s = Math.sin((Math.PI * land) / 0.25);
      sx = 1 + 0.14 * s;
      sy = 1 - 0.16 * s;
    }
  }
  if (jumpAt !== undefined) {
    const x = (t - jumpAt) / 0.55;
    if (x >= 0 && x < 0.12) {
      const k = x / 0.12;
      sx = 1 + 0.12 * k;
      sy = 1 - 0.14 * k;
    } else if (x >= 0.12 && x < 1) {
      const k = (x - 0.12) / 0.88;
      dy = -140 * 4 * k * (1 - k);
      sx = 0.94;
      sy = 1.08;
    } else if (x >= 1 && x < 1.25) {
      const s = Math.sin(Math.PI * ((x - 1) / 0.25));
      sx = 1 + 0.14 * s;
      sy = 1 - 0.16 * s;
    }
  }
  const shadowK = 1 / (1 + Math.max(0, -dy) / 300);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: cx - (width * 0.6 * shadowK) / 2,
          top: baseY - 12,
          width: width * 0.6 * shadowK,
          height: 26,
          borderRadius: "50%",
          background: `rgba(70,50,30,${0.2 * shadowK})`,
          filter: "blur(9px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - width / 2,
          bottom: 1920 - baseY,
          width,
          transformOrigin: "50% 100%",
          scale: `${sx} ${sy}`,
          translate: `0px ${dy}px`,
        }}
      >
        <Img src={staticFile(`qoora/mascota/${name}_${view}.png`)} style={{ width: "100%", display: "block" }} />
        {accessory}
      </div>
    </>
  );
};
const Easing2 = { inQuad: (x: number) => x * x };

/** Halo naranja suave detrás del protagonista */
export const Halo: React.FC<{ cx: number; cy: number; r: number; delay?: number }> = ({ cx, cy, r, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame / fps - delay, [0, 0.5], [0.6, 1], { ...clamp, easing: EASE.out });
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: C.accentSoft,
        scale: String(k),
        opacity: interpolate(frame / fps - delay, [0, 0.3], [0, 1], clamp),
      }}
    />
  );
};

/** QOORA_POP_IN_01: cualquier hijo aparece con rebote */
export const PopIn: React.FC<{ delay: number; origin?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  origin = "50% 50%",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - delay;
  return (
    <div
      style={{
        ...style,
        transformOrigin: origin,
        opacity: t < 0 ? 0 : 1,
        scale: String(interpolate(t, [0, 0.35], [0, 1], { ...clamp, easing: EASE.back })),
      }}
    >
      {children}
    </div>
  );
};

/** Pastilla CTA "Comenta AGENTE" */
export const CtaPill: React.FC<{ y: number; delay: number }> = ({ y, delay }) => (
  <PopIn delay={delay} style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        background: C.ink,
        color: "#fff",
        borderRadius: 60,
        padding: "26px 54px",
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: 56,
      }}
    >
      Comenta <span style={{ color: C.accent }}>AGENTE</span>
    </div>
  </PopIn>
);

/* ---------------------------------------------------------------- sonido */
/** Coloca un efecto de la biblioteca QOORA_SFX en el segundo `at` de la escena */
export const Sfx: React.FC<{ name: SfxName; at: number }> = ({ name, at }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(at * fps)} layout="none" name={`SFX ${name}`}>
      <Audio src={staticFile(`qoora/sfx/${SFX[name].file}`)} volume={SFX[name].vol * MIX.sfx} />
    </Sequence>
  );
};
