/**
 * QOORA AI · Kit gráfico de la LÍNEA CORPORATIVA OSCURA (inspirado en la web).
 * Fondo negro con cuadrícula sutil, círculos concéntricos, núcleo central,
 * líneas finas que se dibujan, nodos que pulsan y datos que recorren las conexiones.
 * Todo se calcula por fotograma (sin SMIL ni CSS animations) para que el render sea determinista.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, FONT } from "../qoora/brand";

export const D = {
  bg: "#050505",
  bg2: "#101010",
  panel: "#0D0D0D",
  line: "#2A2A2A",
  orange: "#FF8500",
  orange2: "#FF9F24",
  white: "#FFFFFF",
  mute: "#8A8A8A",
  mute2: "#5C5C5C",
  ok: "#3DDC84",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0→1 entre `start` y `start+dur` con la curva de la marca */
export const p = (t: number, start: number, dur: number, ease: (x: number) => number = EASE.out) =>
  interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing: ease });

/* ------------------------------------------------------------ geometría */
export type Pt = { x: number; y: number };
export type Edge = { a: Pt; c: Pt; b: Pt; d: string };

/** Curva cuadrática suave a→b (bend desplaza el punto de control en perpendicular) */
export const edge = (a: Pt, b: Pt, bend = 0.12): Edge => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const c = { x: mx - (b.y - a.y) * bend, y: my + (b.x - a.x) * bend };
  return { a, b, c, d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}` };
};
export const at = (e: Edge, k: number): Pt => {
  const u = 1 - k;
  return { x: u * u * e.a.x + 2 * u * k * e.c.x + k * k * e.b.x, y: u * u * e.a.y + 2 * u * k * e.c.y + k * k * e.b.y };
};
export const towards = (a: Pt, b: Pt, r: number): Pt => {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: a.x + ((b.x - a.x) / d) * r, y: a.y + ((b.y - a.y) / d) * r };
};
export const ring = (n: number, cx: number, cy: number, rx: number, ry: number, start = -90): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
export const hexPath = (cx: number, cy: number, r: number) =>
  "M " +
  ring(6, cx, cy, r, r, -90)
    .map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`)
    .join(" L ") +
  " Z";

/* ------------------------------------------------------------ fondo */
/** Fondo negro de la web: cuadrícula de 72 px, luz naranja localizada y viñeta */
export const DarkBackground: React.FC<{ glow?: Pt; glowR?: number; glowA?: number }> = ({ glow = { x: 540, y: 860 }, glowR = 620, glowA = 0.16 }) => {
  const t = useT();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `0px ${(t * 10) % 72}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: glow.x - glowR,
          top: glow.y - glowR,
          width: glowR * 2,
          height: glowR * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,133,0,${glowA}) 0%, rgba(255,133,0,${glowA * 0.3}) 40%, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ primitivas SVG */
/** Línea que se dibuja (QOORA_LINE_DRAW). k = progreso 0..1 */
export const DrawEdge: React.FC<{ e: Edge; k: number; hot?: boolean; width?: number; dash?: boolean; opacity?: number }> = ({
  e,
  k,
  hot = false,
  width,
  dash = false,
  opacity,
}) => {
  if (k <= 0) return null;
  return (
    <path
      d={e.d}
      fill="none"
      pathLength={1}
      stroke={hot ? D.orange : "#FFFFFF"}
      strokeOpacity={opacity ?? (hot ? 0.9 : 0.22)}
      strokeWidth={width ?? (hot ? 2.6 : 1.6)}
      strokeLinecap="round"
      strokeDasharray={dash ? "0.012 0.012" : `${k} 1`}
    />
  );
};

/** Dato que recorre una conexión (QOORA_DATA_PACKET). Repite cada `period` s desde `start` */
export const Packet: React.FC<{ e: Edge; start: number; period?: number; travel?: number; reverse?: boolean; r?: number; color?: string }> = ({
  e,
  start,
  period = 1.6,
  travel = 0.9,
  reverse = false,
  r = 5,
  color = D.orange2,
}) => {
  const t = useT();
  if (t < start) return null;
  const local = (t - start) % period;
  if (local > travel) return null;
  let k = EASE.inOut(local / travel);
  if (reverse) k = 1 - k;
  const q = at(e, k);
  return (
    <g>
      <circle cx={q.x} cy={q.y} r={r * 2.6} fill={color} opacity={0.18} />
      <circle cx={q.x} cy={q.y} r={r} fill={color} />
    </g>
  );
};

/** Pulso que se expande desde un punto (QOORA_NODE_PULSE) */
export const Pulse: React.FC<{ c: Pt; start: number; r0?: number; r1?: number; dur?: number; color?: string }> = ({
  c,
  start,
  r0 = 20,
  r1 = 90,
  dur = 0.9,
  color = D.orange,
}) => {
  const t = useT();
  const k = (t - start) / dur;
  if (k < 0 || k > 1) return null;
  return <circle cx={c.x} cy={c.y} r={r0 + (r1 - r0) * EASE.out(k)} fill="none" stroke={color} strokeWidth={2} opacity={0.7 * (1 - k)} />;
};

/** Círculos concéntricos que se expanden y respiran */
export const Rings: React.FC<{ c: Pt; radii: number[]; start: number; rotate?: boolean }> = ({ c, radii, start, rotate = true }) => {
  const t = useT();
  return (
    <g>
      {radii.map((r, i) => {
        const k = p(t, start + i * 0.08, 0.9);
        return (
          <circle
            key={r}
            cx={c.x}
            cy={c.y}
            r={r * (0.85 + 0.15 * k)}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.07 * k}
            strokeWidth={1.5}
            strokeDasharray={i % 2 ? "4 10" : undefined}
            transform={rotate ? `rotate(${t * (i % 2 ? 6 : -4)} ${c.x} ${c.y})` : undefined}
          />
        );
      })}
    </g>
  );
};

/** Núcleo central: hexágono que se dibuja, se ilumina y lleva el símbolo */
export const Core: React.FC<{ c: Pt; r?: number; start: number; glow?: number }> = ({ c, r = 78, start, glow = 1 }) => {
  const t = useT();
  const draw = p(t, start, 0.7, EASE.inOut);
  const fill = p(t, start + 0.45, 0.4);
  const breathe = 1 + 0.025 * Math.sin((t - start) * 3);
  return (
    <g transform={`translate(${c.x} ${c.y}) scale(${breathe}) translate(${-c.x} ${-c.y})`}>
      <circle cx={c.x} cy={c.y} r={r * 2.2} fill="url(#coreGlow)" opacity={fill * glow} />
      <path d={hexPath(c.x, c.y, r + 18)} fill="none" stroke="#FFFFFF" strokeOpacity={0.1 * fill} strokeWidth={1.5} />
      <path d={hexPath(c.x, c.y, r)} fill={D.panel} fillOpacity={fill} stroke={D.orange} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />
      <image href={staticFile("qoora/logos/QOORA_simbolo_transparente.png")} x={c.x - r * 0.55} y={c.y - r * 0.57} width={r * 1.1} height={r * 1.14} opacity={fill} />
    </g>
  );
};

/** Módulo con etiqueta (QOORA_MODULE). Aparece con precisión y se activa en naranja */
export const Module: React.FC<{ c: Pt; label: string; start: number; active?: number; w?: number; sub?: string }> = ({ c, label, start, active, w, sub }) => {
  const t = useT();
  const k = p(t, start, 0.35);
  if (k <= 0) return null;
  const on = active !== undefined && t >= active;
  const width = w ?? Math.max(160, label.length * 17.5 + 58);
  const h = sub ? 78 : 62;
  return (
    <g opacity={k} transform={`translate(${c.x} ${c.y}) scale(${0.9 + 0.1 * k}) translate(${-c.x} ${-c.y})`}>
      <rect x={c.x - width / 2} y={c.y - h / 2} width={width} height={h} rx={12} fill={on ? "#1a1006" : D.panel} stroke={on ? D.orange : "#333"} strokeWidth={2} />
      <circle cx={c.x - width / 2 + 22} cy={c.y - (sub ? 10 : 0)} r={5} fill={on ? D.orange2 : D.mute2} />
      <text
        x={c.x - width / 2 + 38}
        y={c.y + 7 - (sub ? 10 : 0)}
        fontFamily={FONT.body}
        fontWeight={700}
        fontSize={24}
        letterSpacing={2}
        fill={on ? "#FFFFFF" : "#BDBDBD"}
      >
        {label}
      </text>
      {sub && (
        <text x={c.x - width / 2 + 38} y={c.y + 24} fontFamily={FONT.body} fontWeight={500} fontSize={17} fill={on ? D.orange2 : D.mute}>
          {sub}
        </text>
      )}
    </g>
  );
};

/** Defs compartidas (degradados) — incluir una vez dentro de cada <svg> */
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="coreGlow">
      <stop offset="0%" stopColor="#FF8500" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#FF8500" stopOpacity="0.08" />
      <stop offset="100%" stopColor="#FF8500" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/* ------------------------------------------------------------ texto */
/** Titular claro con palabra en naranja. Entrada QOORA_TEXT_RISE */
export const DTitle: React.FC<{ text: string; accent?: string; y: number; size?: number; delay?: number; color?: string; weight?: number }> = ({
  text,
  accent,
  y,
  size = 76,
  delay = 0,
  color = D.white,
  weight = 700,
}) => {
  const t = useT() - delay;
  const parts = accent ? text.split(accent) : [text];
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: FONT.head,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        color,
        opacity: interpolate(t, [0, 0.45], [0, 1], { ...clamp, easing: EASE.out }),
        translate: `0px ${interpolate(t, [0, 0.5], [26, 0], { ...clamp, easing: EASE.out })}px`,
      }}
    >
      {parts[0]}
      {accent && <span style={{ color: D.orange }}>{accent}</span>}
      {parts[1]}
    </div>
  );
};

/** Etiqueta técnica pequeña (antetítulo) */
export const Label: React.FC<{ text: string; y: number; delay?: number }> = ({ text, y, delay = 0 }) => {
  const t = useT() - delay;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        opacity: interpolate(t, [0, 0.4], [0, 1], clamp),
        fontFamily: FONT.body,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 5,
        color: D.mute,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 5, background: D.orange }} />
      {text}
    </div>
  );
};

/** Firma superior de la línea oscura */
export const DSignature: React.FC = () => (
  <div style={{ position: "absolute", left: 70, top: 112, display: "flex", alignItems: "center", gap: 14 }}>
    <Img src={staticFile("qoora/logos/QOORA_simbolo_transparente.png")} style={{ height: 34 }} />
    <span style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 30, color: D.white, letterSpacing: 2 }}>
      QOORA <span style={{ color: D.orange }}>AI</span>
    </span>
  </div>
);

/** Línea de transición: entra desde un borde y llega al primer elemento de la escena (QOORA_LINE_TRANSITION) */
export const EntryLine: React.FC<{ to: Pt; from?: Pt; dur?: number }> = ({ to, from = { x: 540, y: -40 }, dur = 0.4 }) => {
  const t = useT();
  const k = p(t, 0, dur, EASE.inOut);
  const fade = 1 - p(t, dur, 0.35);
  if (fade <= 0) return null;
  const e = edge(from, to, 0);
  const head = at(e, k);
  return (
    <g opacity={fade}>
      <DrawEdge e={e} k={k} hot width={3} />
      <circle cx={head.x} cy={head.y} r={7} fill={D.orange2} />
    </g>
  );
};
