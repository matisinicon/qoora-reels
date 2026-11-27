// VIRALFORGE · kit visual v2 — escenarios ilustrados por capas (lienzo 1080x1920)
// Estilo: ilustración plana con volumen (degradados suaves, perspectiva atmosférica, luz de ambiente),
// sin contornos negros en el fondo para que los personajes destaquen delante.
import React from "react";
import { useCurrentFrame } from "remotion";
import { ruido } from "./estilo";

export type Momento = "dia" | "atardecer" | "noche";
type L = { cielo: [string, string, string]; sol: string; niebla: string; sombra: string; luz: string; oscuro: number };

export const LUZ: Record<Momento, L> = {
  dia: { cielo: ["#4FA3E8", "#8FCBF3", "#D9F0FB"], sol: "#FFF4C2", niebla: "#CFE8F7", sombra: "rgba(30,40,80,0.22)", luz: "#FFF7DC", oscuro: 1 },
  atardecer: { cielo: ["#3B3F8C", "#E9767A", "#FFC98A"], sol: "#FFE3A3", niebla: "#F4B48F", sombra: "rgba(60,20,40,0.28)", luz: "#FFD9A8", oscuro: 0.86 },
  noche: { cielo: ["#070B26", "#16245A", "#2E4479"], sol: "#FFF8D6", niebla: "#2A3B6B", sombra: "rgba(0,0,10,0.4)", luz: "#9DB7FF", oscuro: 0.55 },
};

// Mezcla dos colores hex (t = 0 → a, 1 → b)
export function mezcla(a: string, b: string, t: number) {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
// Oscurece un color según la hora (para que todo el decorado comparta la misma luz)
const tono = (c: string, m: Momento, k = 1) => (m === "dia" ? c : mezcla(c, m === "noche" ? "#1A2550" : "#7A4A5A", (m === "noche" ? 0.62 : 0.28) * k));

const B = { x: -400, y: -400, w: 1880, h: 2720 }; // margen para que la cámara pueda moverse

// ───────────────────────── Cielo ─────────────────────────
export const Cielo2: React.FC<{ m: Momento; h?: number; id: string; nubes?: number; pajaros?: boolean }> = ({ m, h = 1150, id, nubes = 4, pajaros = true }) => {
  const f = useCurrentFrame();
  const l = LUZ[m];
  const solX = m === "atardecer" ? 560 : 820, solY = m === "atardecer" ? h - 120 : m === "noche" ? 300 : 330;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={l.cielo[0]} /><stop offset="0.6" stopColor={l.cielo[1]} /><stop offset="1" stopColor={l.cielo[2]} />
        </linearGradient>
        <radialGradient id={`${id}-s`}><stop offset="0" stopColor={l.sol} stopOpacity={0.95} /><stop offset="0.25" stopColor={l.sol} stopOpacity={0.45} /><stop offset="1" stopColor={l.sol} stopOpacity={0} /></radialGradient>
        <filter id={`${id}-nb`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect x={B.x} y={B.y} width={B.w} height={h - B.y + 40} fill={`url(#${id}-c)`} />
      {m === "noche" ? Array.from({ length: 90 }).map((_, i) => (
        <circle key={i} cx={ruido(i) * 1500 - 200} cy={ruido(i + 99) * (h - 200) - 300} r={1.2 + ruido(i + 7) * 2.4} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / 18 + i))} />
      )) : null}
      <circle cx={solX} cy={solY} r={m === "atardecer" ? 520 : 380} fill={`url(#${id}-s)`} />
      <circle cx={solX} cy={solY} r={m === "atardecer" ? 120 : 78} fill={l.sol} />
      {m === "noche" ? <circle cx={solX + 34} cy={solY - 18} r={70} fill={l.cielo[0]} opacity={0.0} /> : null}
      <g filter={`url(#${id}-nb)`} opacity={m === "noche" ? 0.22 : 0.92}>
        {Array.from({ length: nubes }).map((_, i) => {
          const x = ((ruido(i + 3) * 1700 + f * (0.35 + i * 0.12)) % 1900) - 450;
          const y = 120 + i * 150 + ruido(i) * 60;
          const s = 0.7 + ruido(i + 1) * 0.8;
          const c = m === "atardecer" ? "#FFD7C2" : "#FFFFFF";
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s} ${s * 0.8})`}>
              <ellipse cx={0} cy={0} rx={170} ry={58} fill={c} />
              <ellipse cx={-80} cy={-30} rx={90} ry={60} fill={c} />
              <ellipse cx={50} cy={-48} rx={110} ry={74} fill={c} />
              <ellipse cx={0} cy={20} rx={190} ry={36} fill={mezcla(c.length === 7 ? c : "#FFFFFF", l.cielo[1], 0.25)} />
            </g>
          );
        })}
      </g>
      {pajaros && m !== "noche" ? Array.from({ length: 3 }).map((_, i) => {
        const x = ((f * (2.2 + i * 0.4) + i * 260) % 1500) - 200, y = 420 + i * 46 + Math.sin(f / 10 + i) * 14;
        const a = Math.sin(f / 3 + i) * 10;
        return <path key={i} d={`M ${x - 18} ${y + a * 0.4} Q ${x - 8} ${y - 8 - a * 0.3} ${x} ${y} Q ${x + 8} ${y - 8 - a * 0.3} ${x + 18} ${y + a * 0.4}`} stroke="#2C3550" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />;
      }) : null}
    </g>
  );
};

// ─────────────────── Montañas y lomas (perspectiva atmosférica) ───────────────────
export const Cordillera: React.FC<{ m: Momento; h: number; color: string; alto: number; semilla: number; picos?: number; niebla?: number; nieve?: boolean }> = ({ m, h, color, alto, semilla, picos = 6, niebla = 0.45, nieve = false }) => {
  const l = LUZ[m];
  const c = mezcla(tono(color, m), l.niebla, niebla);
  const pts: [number, number][] = [];
  const n = picos * 2 + 2;
  for (let i = 0; i <= n; i++) {
    const x = -400 + (i * 1880) / n;
    const y = h - (i % 2 ? alto * (0.55 + ruido(semilla + i) * 0.45) : alto * (0.15 + ruido(semilla + i * 3) * 0.3));
    pts.push([x, y]);
  }
  const d = `M -400 ${h + 400} ` + pts.map(([x, y]) => `L ${x} ${y}`).join(" ") + ` L 1480 ${h + 400} Z`;
  return (
    <g>
      <path d={d} fill={c} />
      {/* cara en sombra de cada pico */}
      {pts.map(([x, y], i) => (i % 2 && i < pts.length - 1 ? <path key={i} d={`M ${x} ${y} L ${pts[i + 1][0]} ${pts[i + 1][1]} L ${x + 30} ${h + 400} Z`} fill={l.sombra} opacity={0.5} /> : null))}
      {nieve ? pts.map(([x, y], i) => (i % 2 ? <path key={"n" + i} d={`M ${x} ${y} L ${x - 50} ${y + 70} L ${x - 15} ${y + 55} L ${x + 10} ${y + 80} L ${x + 45} ${y + 62} Z`} fill={tono("#F4F8FF", m)} /> : null)) : null}
    </g>
  );
};

export const Loma: React.FC<{ m: Momento; h: number; color: string; amp?: number; semilla?: number; niebla?: number; brillo?: boolean }> = ({ m, h, color, amp = 90, semilla = 1, niebla = 0, brillo = true }) => {
  const l = LUZ[m];
  const c = mezcla(tono(color, m), l.niebla, niebla);
  const a = (k: number) => h - amp * (0.3 + ruido(semilla + k) * 0.7);
  const d = `M -400 ${a(0)} C -100 ${a(1) - amp} 200 ${a(2)} 500 ${a(3)} S 1100 ${a(4) - amp * 0.6} 1480 ${a(5)} L 1480 ${h + 2000} L -400 ${h + 2000} Z`;
  return (
    <g>
      <path d={d} fill={c} />
      {brillo ? <path d={d} fill={l.luz} opacity={m === "noche" ? 0.04 : 0.1} transform="translate(0 6)" /> : null}
    </g>
  );
};

// ───────────────────────── Vegetación ─────────────────────────
export const Arbol2: React.FC<{ x: number; y: number; s?: number; m: Momento; tipo?: "redondo" | "pino" | "palmera" | "chopo"; color?: string; semilla?: number; frutos?: string }> = ({ x, y, s = 1, m, tipo = "redondo", color = "#3F9447", semilla = 0, frutos }) => {
  const f = useCurrentFrame();
  const vaiven = Math.sin(f / 22 + semilla) * 1.6;
  const hoja = tono(color, m), osc = tono(mezcla(color, "#0B2A16", 0.38), m), cla = tono(mezcla(color, "#E8F7A0", 0.35), m);
  const tronco = tono("#7B5233", m);
  if (tipo === "pino")
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${vaiven * 0.6})`}>
        <rect x={-14} y={-60} width={28} height={70} fill={tronco} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <path d={`M 0 ${-380 + k * 80} L ${-110 + k * -18} ${-150 + k * 40} L ${110 + k * 18} ${-150 + k * 40} Z`} fill={hoja} />
            <path d={`M 0 ${-380 + k * 80} L ${110 + k * 18} ${-150 + k * 40} L 10 ${-150 + k * 40} Z`} fill={osc} opacity={0.7} />
          </g>
        ))}
      </g>
    );
  if (tipo === "palmera")
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M -10 0 Q 30 -200 10 -420 L 34 -420 Q 52 -200 22 0 Z" fill={tronco} />
        {[-70, -25, 20, 65, 110, 160].map((a, k) => (
          <path key={k} d="M 0 0 Q 90 -60 210 10 Q 100 -20 0 10 Z" fill={k % 2 ? osc : hoja} transform={`translate(22 -420) rotate(${a + vaiven * 2})`} />
        ))}
      </g>
    );
  if (tipo === "chopo")
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${vaiven})`}>
        <rect x={-10} y={-80} width={20} height={90} fill={tronco} />
        <ellipse cx={0} cy={-300} rx={70} ry={240} fill={hoja} />
        <ellipse cx={22} cy={-280} rx={44} ry={210} fill={osc} opacity={0.55} />
        <ellipse cx={-22} cy={-360} rx={26} ry={110} fill={cla} opacity={0.6} />
      </g>
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -22 0 Q -14 -120 -30 -190 L 30 -190 Q 16 -120 24 0 Z" fill={tronco} />
      <path d="M 0 -150 Q 50 -190 80 -230" stroke={tronco} strokeWidth={16} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${vaiven} 0 -150)`}>
        <circle cx={0} cy={-300} r={150} fill={osc} />
        <circle cx={-95} cy={-235} r={95} fill={osc} />
        <circle cx={100} cy={-240} r={100} fill={osc} />
        <circle cx={-20} cy={-325} r={128} fill={hoja} />
        <circle cx={-100} cy={-255} r={78} fill={hoja} />
        <circle cx={75} cy={-270} r={85} fill={hoja} />
        <circle cx={-50} cy={-370} r={60} fill={cla} opacity={0.75} />
        <circle cx={-120} cy={-280} r={30} fill={cla} opacity={0.6} />
        {frutos ? [[-60, -300], [50, -240], [10, -380], [-110, -220], [100, -300]].map(([a, b], k) => <circle key={k} cx={a} cy={b} r={17} fill={tono(frutos, m)} />) : null}
      </g>
    </g>
  );
};

export const Hierba: React.FC<{ m: Momento; y0: number; y1: number; color?: string; n?: number; semilla?: number }> = ({ m, y0, y1, color = "#2F7A36", n = 60, semilla = 4 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const y = y0 + ruido(semilla + i) * (y1 - y0);
        const x = ruido(semilla + i * 7) * 1500 - 200;
        const s = 0.5 + ((y - y0) / Math.max(y1 - y0, 1)) * 1.2;
        const v = Math.sin(f / 15 + i) * 4;
        return <path key={i} d={`M ${x - 10 * s} ${y} Q ${x - 6 * s + v} ${y - 26 * s} ${x - 14 * s + v * 1.5} ${y - 44 * s} M ${x} ${y} Q ${x + v} ${y - 34 * s} ${x + 4 * s + v * 1.5} ${y - 56 * s} M ${x + 10 * s} ${y} Q ${x + 8 * s + v} ${y - 24 * s} ${x + 18 * s + v * 1.5} ${y - 40 * s}`} stroke={tono(color, m)} strokeWidth={5 * s} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

export const Flores: React.FC<{ m: Momento; y0: number; y1: number; n?: number; semilla?: number }> = ({ m, y0, y1, n = 26, semilla = 9 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const y = y0 + ruido(semilla + i) * (y1 - y0), x = ruido(semilla + i * 5) * 1400 - 160, s = 0.6 + ((y - y0) / Math.max(y1 - y0, 1)) * 1.1;
    const c = tono(["#FFFFFF", "#F7C531", "#E85A9A", "#B04AC9", "#FF8C5A"][i % 5], m);
    return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M 0 0 v -22" stroke={tono("#3F8F3C", m)} strokeWidth={4} />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos(a * Math.PI / 180) * 8} cy={-26 + Math.sin(a * Math.PI / 180) * 8} r={6} fill={c} />)}<circle cx={0} cy={-26} r={5} fill={tono("#F2A23A", m)} /></g>;
  })}</g>
);

export const Camino: React.FC<{ m: Momento; y: number; color?: string }> = ({ m, y, color = "#D8B98A" }) => (
  <g><path d={`M 480 ${y} Q 420 ${y + 300} 200 ${y + 600} L -100 2400 L 1300 2400 Q 760 ${y + 500} 620 ${y} Z`} fill={tono(color, m)} /><path d={`M 480 ${y} Q 420 ${y + 300} 200 ${y + 600} L 120 ${y + 700}`} stroke="rgba(0,0,0,0.08)" strokeWidth={30} fill="none" /></g>
);

// ───────────────────────── Arquitectura ─────────────────────────
type EdifProps = { x: number; y: number; w: number; h: number; m: Momento; color?: string; tejado?: string; semilla?: number };

// Casa de entramado de madera (medieval / pueblo antiguo)
export const CasaMedieval: React.FC<EdifProps> = ({ x, y, w, h, m, color = "#EADFC6", tejado = "#9C3D2E", semilla = 0 }) => {
  const viga = tono("#5B3A24", m), pared = tono(color, m), tej = tono(tejado, m), luzV = m === "dia" ? tono("#7FA9C9", m) : "#FFC864";
  const pisos = Math.max(2, Math.round(h / 190));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={pared} />
      <rect x={w / 2 - w * 0.18} y={-h} width={w * 0.18} height={h} fill="rgba(0,0,0,0.12)" />
      {Array.from({ length: pisos }).map((_, p) => {
        const py = -h + (p * h) / pisos;
        return (
          <g key={p}>
            <rect x={-w / 2} y={py - 6} width={w} height={14} fill={viga} />
            {[0.18, 0.5, 0.82].map((k, i) => <rect key={i} x={-w / 2 + w * k - 7} y={py} width={14} height={h / pisos} fill={viga} />)}
            <path d={`M ${-w / 2} ${py + h / pisos} L ${-w / 2 + w * 0.18} ${py}`} stroke={viga} strokeWidth={10} />
            <path d={`M ${w / 2} ${py + h / pisos} L ${w / 2 - w * 0.18} ${py}`} stroke={viga} strokeWidth={10} />
            {p > 0 || pisos === 1 ? [0.34, 0.66].map((k, i) => (
              <g key={"v" + i}>
                <rect x={-w / 2 + w * k - 26} y={py + h / pisos * 0.25} width={52} height={64} rx={6} fill={ruido(semilla + p * 3 + i) > 0.35 ? luzV : tono("#3A4A63", m)} />
                <path d={`M ${-w / 2 + w * k} ${py + h / pisos * 0.25} v 64 M ${-w / 2 + w * k - 26} ${py + h / pisos * 0.25 + 32} h 52`} stroke={viga} strokeWidth={5} />
              </g>
            )) : null}
          </g>
        );
      })}
      <path d={`M ${-w / 2 - 34} ${-h + 4} L 0 ${-h - w * 0.55} L ${w / 2 + 34} ${-h + 4} Z`} fill={tej} />
      <path d={`M 0 ${-h - w * 0.55} L ${w / 2 + 34} ${-h + 4} L ${w * 0.1} ${-h + 4} Z`} fill="rgba(0,0,0,0.16)" />
      <rect x={-34} y={-130} width={68} height={130} rx={34} fill={tono("#5B3A24", m)} />
      <rect x={w * 0.22} y={-h - w * 0.4} width={34} height={90} fill={tono("#8A6A55", m)} />
    </g>
  );
};

// Edificio clásico de ciudad (siglo XIX – principios XX)
export const EdificioClasico: React.FC<EdifProps> = ({ x, y, w, h, m, color = "#D9B98F", tejado = "#4F5A6E", semilla = 0 }) => {
  const pared = tono(color, m), cornisa = tono(mezcla(color, "#FFFFFF", 0.35), m), osc = tono(mezcla(color, "#3A2A1A", 0.35), m);
  const pisos = Math.max(2, Math.round(h / 170)), cols = Math.max(2, Math.round(w / 120));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={pared} />
      <rect x={-w / 2} y={-h - 30} width={w} height={30} fill={tono(tejado, m)} />
      {Array.from({ length: pisos }).map((_, p) => (
        <g key={p}>
          <rect x={-w / 2 - 8} y={-h + p * (h / pisos)} width={w + 16} height={12} fill={cornisa} />
          {Array.from({ length: cols }).map((__, c) => {
            const wx = -w / 2 + (c + 0.5) * (w / cols) - 26, wy = -h + p * (h / pisos) + 34;
            const enc = m !== "dia" && ruido(semilla + p * 11 + c) > 0.45;
            return (
              <g key={c}>
                <rect x={wx - 6} y={wy - 10} width={64} height={12} fill={cornisa} />
                <rect x={wx} y={wy} width={52} height={h / pisos - 70} rx={4} fill={enc ? "#FFCF6B" : tono("#5F7C98", m)} />
                <rect x={wx} y={wy} width={52} height={(h / pisos - 70) * 0.35} fill="rgba(255,255,255,0.18)" />
              </g>
            );
          })}
        </g>
      ))}
      <rect x={w / 2 - w * 0.12} y={-h} width={w * 0.12} height={h} fill={osc} opacity={0.35} />
      <rect x={-w / 2} y={-80} width={w} height={80} fill={osc} opacity={0.55} />
    </g>
  );
};

export const Torre: React.FC<{ x: number; y: number; w: number; h: number; m: Momento; color?: string; tejado?: string }> = ({ x, y, w, h, m, color = "#B9B2A6", tejado = "#5A3B6B" }) => {
  const p = tono(color, m), o = tono(mezcla(color, "#20202A", 0.35), m);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={p} />
      <rect x={w * 0.15} y={-h} width={w * 0.35} height={h} fill={o} opacity={0.5} />
      {Array.from({ length: Math.floor(h / 60) }).map((_, i) => <path key={i} d={`M ${-w / 2} ${-h + i * 60 + 30} h ${w}`} stroke={o} strokeWidth={3} opacity={0.4} />)}
      {[-0.35, 0, 0.35].map((k, i) => <rect key={i} x={w * k - 16} y={-h - 40} width={32} height={40} fill={p} />)}
      <path d={`M ${-w / 2 - 20} ${-h - 40} L 0 ${-h - 40 - w * 1.1} L ${w / 2 + 20} ${-h - 40} Z`} fill={tono(tejado, m)} />
      <rect x={-12} y={-h * 0.6} width={24} height={50} rx={12} fill={m === "dia" ? "#2D2A3A" : "#FFC864"} />
      <path d={`M 0 ${-h - 40 - w * 1.1} v -70`} stroke={o} strokeWidth={5} />
      <path d={`M 0 ${-h - 110 - w * 1.1} l 50 15 l -50 15 Z`} fill={tono("#C8433A", m)} />
    </g>
  );
};

export const Molino: React.FC<{ x: number; y: number; s?: number; m: Momento }> = ({ x, y, s = 1, m }) => {
  const f = useCurrentFrame();
  const giro = f * 1.1;
  const c = tono("#8B5A3C", m), t = tono("#4B3A3A", m);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -90 0 L -60 -360 L 60 -360 L 90 0 Z" fill={c} />
      <path d="M 10 -360 L 60 -360 L 90 0 L 25 0 Z" fill="rgba(0,0,0,0.18)" />
      <path d="M -80 -350 Q 0 -470 80 -350 Z" fill={t} />
      <rect x={-22} y={-90} width={44} height={90} rx={22} fill={tono("#3A2A20", m)} />
      <rect x={-20} y={-250} width={40} height={50} rx={6} fill={m === "dia" ? tono("#9CC3DD", m) : "#FFC864"} />
      <g transform={`translate(0 -380) rotate(${giro})`}>
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <rect x={-6} y={-300} width={12} height={300} fill={tono("#5B4030", m)} />
            <rect x={6} y={-290} width={60} height={230} fill={tono("#F3EEE2", m)} opacity={0.92} />
            {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 6 ${-290 + k * 46} h 60`} stroke={tono("#5B4030", m)} strokeWidth={4} />)}
          </g>
        ))}
        <circle r={20} fill={tono("#3A2A20", m)} />
      </g>
    </g>
  );
};

export const Farola: React.FC<{ x: number; y: number; s?: number; m: Momento }> = ({ x, y, s = 1, m }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {m !== "dia" ? <Resplandor x={0} y={-440} r={260} /> : null}
    <rect x={-8} y={-420} width={16} height={420} fill={tono("#2D3340", m)} />
    <path d="M -36 -470 L 36 -470 L 26 -410 L -26 -410 Z" fill={m === "dia" ? tono("#C9D6E2", m) : "#FFE3A0"} stroke={tono("#2D3340", m)} strokeWidth={6} />
    <path d="M -44 -470 L 0 -500 L 44 -470 Z" fill={tono("#2D3340", m)} />
    <rect x={-26} y={-10} width={52} height={12} fill={tono("#2D3340", m)} />
  </g>
);

// Halo de luz suave (lámparas, antorchas, fuego, farolas)
export const Resplandor: React.FC<{ x: number; y: number; r: number; color?: string; fuerza?: number }> = ({ x, y, r, color = "#FFD27A", fuerza = 0.35 }) => {
  const id = "rs" + color.replace("#", "") + Math.round(fuerza * 100);
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={fuerza} /><stop offset="0.45" stopColor={color} stopOpacity={fuerza * 0.35} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  );
};

// ───────────────────────── Suelos ─────────────────────────
export const Suelo: React.FC<{ m: Momento; y: number; tipo: "cesped" | "tierra" | "adoquin" | "arena" | "asfalto" | "nieve" | "piedra"; id: string }> = ({ m, y, tipo, id }) => {
  const cols: Record<string, [string, string]> = {
    cesped: ["#6DBE55", "#3F8F3C"], tierra: ["#C79A62", "#8E6440"], adoquin: ["#A59C92", "#6F6760"], arena: ["#F1D398", "#D9AE6C"],
    asfalto: ["#6A6F7A", "#3D414B"], nieve: ["#F2F7FC", "#C9D9EA"], piedra: ["#9A948C", "#625C56"],
  };
  const [a, b] = cols[tipo];
  return (
    <g>
      <defs><linearGradient id={`${id}-su`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={tono(a, m)} /><stop offset="1" stopColor={tono(b, m)} /></linearGradient></defs>
      <rect x={B.x} y={y} width={B.w} height={2400} fill={`url(#${id}-su)`} />
      {tipo === "adoquin" || tipo === "piedra" ? Array.from({ length: 9 }).map((_, r) => {
        const yy = y + 12 + r * r * 9 + r * 18, hh = 10 + r * 6;
        return Array.from({ length: 14 }).map((__, c) => (
          <rect key={r + "-" + c} x={-400 + c * 140 + (r % 2) * 70 - r * 8} y={yy} width={110 + r * 10} height={hh} rx={hh / 2.5} fill="rgba(0,0,0,0.13)" />
        ));
      }) : null}
      {tipo === "asfalto" ? <g>{Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-300 + k * 330} y={y + 190} width={180} height={16} fill={tono("#F2F2F2", m)} opacity={0.8} />)}<rect x={B.x} y={y} width={B.w} height={34} fill={tono("#B6BAC2", m)} /></g> : null}
      {tipo === "tierra" || tipo === "arena" ? Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={ruido(i) * 1500 - 200} cy={y + 20 + ruido(i + 40) * 500} rx={10 + ruido(i + 3) * 30} ry={4 + ruido(i + 5) * 6} fill="rgba(0,0,0,0.08)" />) : null}
      <rect x={B.x} y={y} width={B.w} height={60} fill={LUZ[m].niebla} opacity={0.18} />
    </g>
  );
};

// ───────────────────────── Interiores ─────────────────────────
// Habitación en perspectiva: pared del fondo, paredes laterales en fuga y suelo con tablas o baldosas.
export const Habitacion: React.FC<{ m: Momento; id: string; pared?: string; suelo?: "madera" | "baldosa" | "piedra"; zocalo?: string; ventana?: boolean; luzVentana?: boolean }> = ({ m, id, pared = "#E8D5B5", suelo = "madera", zocalo = "#7B5233", ventana = true, luzVentana = true }) => {
  const f = useCurrentFrame();
  const P = tono(pared, m), Pl = tono(mezcla(pared, "#000000", 0.18), m), S = suelo === "madera" ? tono("#A06A42", m) : suelo === "baldosa" ? tono("#D9D2C5", m) : tono("#8D8780", m);
  const fondoY = 1180; // línea pared/suelo
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.0} /><stop offset="1" stopColor="#000" stopOpacity={0.28} /></linearGradient>
        <linearGradient id={`${id}-rayo`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={LUZ[m].luz} stopOpacity={0.45} /><stop offset="1" stopColor={LUZ[m].luz} stopOpacity={0} /></linearGradient>
      </defs>
      <rect x={B.x} y={B.y} width={B.w} height={fondoY - B.y} fill={P} />
      {/* paredes laterales en fuga */}
      <path d={`M -400 -400 L 60 120 L 60 ${fondoY} L -400 ${fondoY + 520} Z`} fill={Pl} />
      <path d={`M 1480 -400 L 1020 120 L 1020 ${fondoY} L 1480 ${fondoY + 520} Z`} fill={Pl} />
      <path d={`M -400 -400 L 1480 -400 L 1020 120 L 60 120 Z`} fill={tono(mezcla(pared, "#FFFFFF", 0.2), m)} />
      {/* suelo */}
      <path d={`M -400 ${fondoY + 520} L 60 ${fondoY} L 1020 ${fondoY} L 1480 ${fondoY + 520} L 1480 2400 L -400 2400 Z`} fill={S} />
      {suelo === "madera" ? Array.from({ length: 13 }).map((_, i) => {
        const xf = 60 + i * 80, xn = -400 + i * (1880 / 12);
        return <path key={i} d={`M ${xf} ${fondoY} L ${xn} 2400`} stroke="rgba(0,0,0,0.16)" strokeWidth={4} />;
      }) : Array.from({ length: 10 }).map((_, i) => {
        const yy = fondoY + i * i * 14 + i * 20;
        return <path key={i} d={`M -400 ${yy} L 1480 ${yy}`} stroke="rgba(0,0,0,0.14)" strokeWidth={3} />;
      })}
      <rect x={B.x} y={fondoY} width={B.w} height={1300} fill={`url(#${id}-sh)`} opacity={0.6} />
      <rect x={60} y={fondoY - 46} width={960} height={46} fill={tono(zocalo, m)} />
      {ventana ? (
        <g>
          <rect x={620} y={360} width={300} height={380} rx={14} fill={tono("#5B3A24", m)} />
          <rect x={640} y={380} width={260} height={340} fill={m === "noche" ? "#1A2A5A" : m === "atardecer" ? "#F5A27C" : "#9ED4F5"} />
          {m === "noche" ? <circle cx={840} cy={440} r={30} fill="#FFF6C8" /> : <circle cx={840} cy={450} r={34} fill="#FFF5C4" opacity={0.9} />}
          <path d="M 770 380 v 340 M 640 550 h 260" stroke={tono("#5B3A24", m)} strokeWidth={14} />
          <path d="M 610 360 Q 560 560 600 760 L 640 760 L 640 360 Z" fill={tono("#B33A3A", m)} />
          <path d="M 930 360 Q 980 560 940 760 L 900 760 L 900 360 Z" fill={tono("#B33A3A", m)} />
          {luzVentana && m !== "noche" ? <path d={`M 640 380 L 900 380 L ${1100 + Math.sin(f / 40) * 6} 2000 L ${380 + Math.sin(f / 40) * 6} 2000 Z`} fill={`url(#${id}-rayo)`} opacity={0.5} /> : null}
        </g>
      ) : null}
    </g>
  );
};

// Muebles e interiorismo (centrados en x, y = suelo)
export const Mueble: React.FC<{ tipo: string; x: number; y: number; s?: number; m: Momento; color?: string }> = ({ tipo, x, y, s = 1, m, color }) => {
  const f = useCurrentFrame();
  const mad = tono(color ?? "#8A5A36", m), madO = tono(mezcla(color ?? "#8A5A36", "#000000", 0.3), m);
  const t = (c: string) => tono(c, m);
  let d: React.ReactNode = null;
  switch (tipo) {
    case "mesa": d = <g><rect x={-230} y={-200} width={460} height={34} rx={8} fill={mad} /><rect x={-230} y={-170} width={460} height={14} fill={madO} /><rect x={-200} y={-160} width={26} height={160} fill={madO} /><rect x={174} y={-160} width={26} height={160} fill={madO} /></g>; break;
    case "barra": d = <g><rect x={-420} y={-300} width={840} height={300} fill={mad} /><rect x={-440} y={-320} width={880} height={36} rx={10} fill={madO} />{[-300, -100, 100, 300].map((k) => <rect key={k} x={k - 60} y={-250} width={120} height={200} rx={10} fill={madO} opacity={0.4} />)}</g>; break;
    case "barril": d = <g><path d="M -90 0 Q -120 -130 -90 -260 L 90 -260 Q 120 -130 90 0 Z" fill={mad} /><ellipse cx={0} cy={-260} rx={90} ry={20} fill={madO} />{[-60, -200].map((k) => <path key={k} d={`M -104 ${k} Q 0 ${k + 16} 104 ${k}`} stroke={t("#3B3B44")} strokeWidth={12} fill="none" />)}</g>; break;
    case "estanteria": d = <g><rect x={-170} y={-620} width={340} height={620} fill={madO} />{[0, 1, 2, 3].map((k) => <g key={k}><rect x={-160} y={-600 + k * 150} width={320} height={130} fill={t("#4A3020")} /><rect x={-170} y={-470 + k * 150} width={340} height={16} fill={mad} />{[0, 1, 2, 3, 4, 5].map((b) => <rect key={b} x={-150 + b * 50} y={-570 + k * 150 + (b % 3) * 8} width={38} height={100 - (b % 3) * 8} fill={t(["#B5473A", "#3B6FB6", "#E0B341", "#4E8F4A", "#7A4E9A", "#D9D2C5"][(b + k) % 6])} />)}</g>)}</g>; break;
    case "chimenea": d = <g><rect x={-230} y={-420} width={460} height={420} fill={t("#9A8F86")} /><rect x={-260} y={-440} width={520} height={40} fill={t("#6F6760")} /><path d="M -140 0 L -140 -240 Q 0 -320 140 -240 L 140 0 Z" fill={t("#1E1A1A")} />{[0, 1, 2].map((k) => { const h = 120 + Math.sin(f / 3 + k * 2) * 30; return <path key={k} d={`M ${-60 + k * 60} 0 Q ${-90 + k * 60} ${-h * 0.6} ${-60 + k * 60 + Math.sin(f / 4 + k) * 10} ${-h} Q ${-30 + k * 60} ${-h * 0.5} ${-20 + k * 60} 0 Z`} fill={k === 1 ? "#FFD34D" : "#FF7A2F"} opacity={0.95} />; })}<Resplandor x={0} y={-80} r={420} color="#FF9A3C" fuerza={0.3 + Math.sin(f / 5) * 0.04} /></g>; break;
    case "lampara": d = <g><path d="M 0 -1400 L 0 -1060" stroke={t("#2D2A3A")} strokeWidth={6} /><path d="M -80 -1000 L 80 -1000 L 50 -1070 L -50 -1070 Z" fill={t("#C9A23A")} /><Resplandor x={0} y={-960} r={420} fuerza={m === "dia" ? 0.18 : 0.4} /><circle cx={0} cy={-990} r={18} fill="#FFF3C0" /></g>; break;
    case "cuadro": d = <g><rect x={-130} y={-1000} width={260} height={200} fill={t("#B08A3E")} /><rect x={-110} y={-980} width={220} height={160} fill={t("#7FA9C9")} /><path d="M -110 -860 L -40 -920 L 20 -870 L 60 -900 L 110 -860 L 110 -820 L -110 -820 Z" fill={t("#4E8F4A")} /></g>; break;
    case "banco_trabajo": d = <g><rect x={-300} y={-240} width={600} height={40} fill={mad} /><rect x={-280} y={-200} width={30} height={200} fill={madO} /><rect x={250} y={-200} width={30} height={200} fill={madO} /><rect x={-260} y={-100} width={520} height={20} fill={madO} /><rect x={-200} y={-640} width={400} height={300} fill={t("#7A5533")} opacity={0.7} />{[-150, -60, 30, 120].map((k, i) => <path key={k} d={`M ${k} -600 v ${90 + i * 20}`} stroke={t("#9AA3AD")} strokeWidth={14} strokeLinecap="round" />)}</g>; break;
    case "pizarra": d = <g><rect x={-300} y={-900} width={600} height={380} fill={t("#5B3A24")} /><rect x={-280} y={-880} width={560} height={340} fill={t("#2F4A3A")} /><path d="M -220 -800 h 200 M -220 -740 h 300 M -220 -680 h 150" stroke="#E8E8E8" strokeWidth={8} opacity={0.6} /></g>; break;
    case "planta": d = <g><path d="M -60 0 L -70 -120 L 70 -120 L 60 0 Z" fill={t("#C0643A")} />{[-40, 0, 40, -20, 20].map((k, i) => <ellipse key={i} cx={k} cy={-200 - (i % 2) * 40} rx={34} ry={90} fill={t(i % 2 ? "#3F8F3C" : "#56A84B")} transform={`rotate(${k} ${k} -150)`} />)}</g>; break;
    case "silla": d = <g><rect x={-80} y={-200} width={160} height={24} fill={mad} /><rect x={-80} y={-420} width={24} height={420} fill={madO} /><rect x={56} y={-180} width={24} height={180} fill={madO} /><rect x={-80} y={-420} width={140} height={24} fill={mad} /></g>; break;
    case "caja_fuerte": d = <g><rect x={-130} y={-280} width={260} height={280} rx={14} fill={t("#4A5160")} /><circle cx={0} cy={-150} r={50} fill={t("#9AA3AD")} /><circle cx={0} cy={-150} r={14} fill={t("#2D2A3A")} /></g>; break;
    default: d = null;
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx={0} cy={4} rx={200} ry={20} fill={LUZ[m].sombra} />{d}</g>;
};

// ───────────────────────── Tren y vías ─────────────────────────
export const Vias: React.FC<{ m: Momento; y: number }> = ({ m, y }) => (
  <g>
    <rect x={-400} y={y} width={1880} height={120} fill={tono("#8E8174", m)} />
    {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-400 + i * 82} y={y + 14} width={40} height={92} rx={4} fill={tono("#5B4030", m)} />)}
    <rect x={-400} y={y + 26} width={1880} height={12} fill={tono("#B8C0C8", m)} />
    <rect x={-400} y={y + 82} width={1880} height={12} fill={tono("#B8C0C8", m)} />
  </g>
);

export const Tren: React.FC<{ x: number; y: number; s?: number; m: Momento; color?: string; vapor?: boolean; vagones?: number }> = ({ x, y, s = 1, m, color = "#B5473A", vapor = true, vagones = 2 }) => {
  const f = useCurrentFrame();
  const c = tono(color, m), o = tono(mezcla(color, "#000000", 0.35), m), n = tono("#2B2B33", m), ventana = m === "dia" ? tono("#A8D3EE", m) : "#FFD27A";
  const ruedas = (cx: number) => [0, 1, 2].map((k) => (
    <g key={k} transform={`translate(${cx + k * 110} -40) rotate(${f * 12})`}>
      <circle r={46} fill={n} /><circle r={30} fill={tono("#7D838C", m)} /><path d="M -30 0 H 30 M 0 -30 V 30" stroke={n} strokeWidth={6} />
    </g>
  ));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-200} cy={4} rx={700} ry={26} fill={LUZ[m].sombra} />
      {/* locomotora */}
      <rect x={-160} y={-300} width={420} height={210} rx={30} fill={c} />
      <rect x={-160} y={-300} width={420} height={50} rx={20} fill="rgba(255,255,255,0.18)" />
      <rect x={160} y={-440} width={190} height={350} rx={18} fill={o} />
      <rect x={190} y={-410} width={130} height={110} rx={10} fill={ventana} />
      <rect x={-130} y={-420} width={60} height={130} fill={n} />
      <rect x={-150} y={-440} width={100} height={30} rx={8} fill={n} />
      <path d="M -160 -100 L -240 -40 L -160 -40 Z" fill={n} />
      {ruedas(-90)}
      {vapor ? [0, 1, 2, 3, 4].map((k) => {
        const tt = ((f + k * 9) % 45) / 45;
        return <circle key={k} cx={-100 - tt * 260} cy={-460 - tt * 220} r={30 + tt * 80} fill="#F2F2F2" opacity={0.75 * (1 - tt)} />;
      }) : null}
      {/* vagones */}
      {Array.from({ length: vagones }).map((_, v) => (
        <g key={v} transform={`translate(${-560 - v * 470} 0)`}>
          <rect x={-180} y={-360} width={430} height={270} rx={20} fill={tono(mezcla(color, "#2A6F4E", 0.6), m)} />
          {[0, 1, 2].map((k) => <rect key={k} x={-150 + k * 130} y={-320} width={100} height={90} rx={10} fill={ventana} />)}
          <rect x={-180} y={-150} width={430} height={20} fill={o} />
          {ruedas(-110)}
          <rect x={250} y={-140} width={40} height={14} fill={n} />
        </g>
      ))}
    </g>
  );
};

// ───────────────────────── Agua ─────────────────────────
export const Agua: React.FC<{ m: Momento; y: number; id: string; color?: string }> = ({ m, y, id, color = "#2C8BC7" }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id={`${id}-ag`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mezcla(tono(color, m), LUZ[m].niebla, 0.35)} /><stop offset="1" stopColor={tono(mezcla(color, "#06223F", 0.55), m)} /></linearGradient></defs>
      <rect x={B.x} y={y} width={B.w} height={2400} fill={`url(#${id}-ag)`} />
      {Array.from({ length: 16 }).map((_, i) => {
        const yy = y + 20 + i * i * 7, a = 3 + i * 1.2, fase = f / (16 - i * 0.6) + i;
        let d = `M -400 ${yy}`;
        for (let x = -400; x <= 1480; x += 60) d += ` L ${x} ${yy + Math.sin(x / (90 + i * 10) + fase) * a}`;
        return <path key={i} d={d} stroke="#FFFFFF" strokeOpacity={0.08 + i * 0.012} strokeWidth={2 + i * 0.5} fill="none" />;
      })}
      {m !== "noche" ? <ellipse cx={m === "atardecer" ? 560 : 820} cy={y + 60} rx={80} ry={14} fill={LUZ[m].sol} opacity={0.5} /> : null}
    </g>
  );
};

// ───────────────────────── Catálogo de escenarios ─────────────────────────
type EP = { m: Momento; id: string; p: Record<string, any> };
const T = (c: string, m: Momento) => tono(c, m);

const INTERIORES = ["taberna", "taller", "laboratorio", "oficina", "casa", "salon_castillo"];
export const ESCENARIOS: Record<string, { desc: string; C: React.FC<EP> }> = {
  campo: { desc: "campo abierto con colinas, árboles y montañas al fondo", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1050} /><Cordillera m={m} h={1050} color="#6F86A6" alto={420} semilla={3} nieve /><Loma m={m} h={1120} color="#7FBF63" niebla={0.35} semilla={2} /><Arbol2 x={150} y={1130} s={0.45} m={m} /><Arbol2 x={980} y={1120} s={0.5} m={m} tipo="chopo" /><Loma m={m} h={1230} color="#5EA84E" amp={60} semilla={7} /><Camino m={m} y={1190} /><Hierba m={m} y0={1250} y1={2000} color="#3F8F3C" /><Flores m={m} y0={1300} y1={1900} /><Arbol2 x={-60} y={1500} s={1.15} m={m} semilla={2} /></g>) },
  granja: { desc: "granja con granero rojo, valla de madera y campos", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1050} /><Cordillera m={m} h={1060} color="#7C93AE" alto={300} semilla={9} /><Loma m={m} h={1100} color="#B9C866" niebla={0.3} semilla={4} />
      <g transform="translate(260 1180)"><path d="M -200 0 L -200 -260 L 0 -380 L 200 -260 L 200 0 Z" fill={T("#B23A30", m)} /><path d="M 0 -380 L 200 -260 L 200 0 L 40 0 Z" fill="rgba(0,0,0,0.15)" /><path d="M -220 -250 L 0 -400 L 220 -250" stroke={T("#F2EBDD", m)} strokeWidth={18} fill="none" /><rect x={-70} y={-170} width={140} height={170} fill={T("#F2EBDD", m)} /><path d="M -70 -170 L 70 0 M 70 -170 L -70 0" stroke={T("#B23A30", m)} strokeWidth={10} /><rect x={240} y={-310} width={90} height={310} rx={44} fill={T("#9AA3AD", m)} /></g>
      <Arbol2 x={880} y={1160} s={0.55} m={m} frutos="#E8463A" /><Loma m={m} h={1260} color="#6DB356" amp={50} semilla={6} />
      {Array.from({ length: 11 }).map((_, i) => <g key={i}><rect x={-80 + i * 130} y={1330} width={18} height={130} fill={T("#A57A4F", m)} /><rect x={-80 + i * 130} y={1355} width={150} height={16} fill={T("#B88B5C", m)} /><rect x={-80 + i * 130} y={1405} width={150} height={16} fill={T("#B88B5C", m)} /></g>)}
      <Hierba m={m} y0={1470} y1={2000} /></g>) },
  bosque: { desc: "bosque frondoso con pinos y luz entre los árboles", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1000} nubes={2} /><Cordillera m={m} h={1000} color="#55708A" alto={380} semilla={5} />
      {Array.from({ length: 9 }).map((_, i) => <Arbol2 key={i} x={-200 + i * 180} y={1080} s={0.55 + ruido(i) * 0.2} m={m} tipo="pino" color="#2E6B45" />)}
      <rect x={-400} y={700} width={1880} height={420} fill={LUZ[m].niebla} opacity={0.35} />
      <Suelo m={m} y={1150} tipo="tierra" id={id} /><Hierba m={m} y0={1160} y1={1900} color="#3B7A3A" n={50} />
      {Array.from({ length: 5 }).map((_, i) => <Arbol2 key={i} x={-150 + i * 330} y={1250 + (i % 2) * 120} s={0.95 + (i % 2) * 0.3} m={m} tipo="pino" color="#2F7A47" semilla={i} />)}
      {m !== "noche" ? [0, 1, 2].map((k) => <path key={k} d={`M ${200 + k * 300} -200 L ${320 + k * 300} -200 L ${520 + k * 260} 1700 L ${300 + k * 260} 1700 Z`} fill={LUZ[m].luz} opacity={0.08} />) : null}</g>) },
  montana: { desc: "montañas nevadas, valle y lago", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1000} /><Cordillera m={m} h={1000} color="#7A8FB0" alto={640} semilla={11} picos={4} nieve niebla={0.25} /><Cordillera m={m} h={1100} color="#4E6A7E" alto={380} semilla={13} niebla={0.12} /><Agua m={m} y={1100} id={id} color="#3A90B8" /><Loma m={m} h={1330} color="#5B9A4E" amp={70} semilla={3} /><Arbol2 x={100} y={1420} s={0.9} m={m} tipo="pino" /><Arbol2 x={950} y={1450} s={1.1} m={m} tipo="pino" semilla={4} /><Hierba m={m} y0={1360} y1={2000} /><Flores m={m} y0={1400} y1={1900} n={18} /></g>) },
  desierto: { desc: "desierto con dunas, cactus y calor", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1080} nubes={1} pajaros={false} /><Cordillera m={m} h={1080} color="#C98E5A" alto={260} semilla={21} niebla={0.4} /><Loma m={m} h={1140} color="#EBC07C" niebla={0.2} semilla={8} amp={120} /><Loma m={m} h={1300} color="#E2AE66" amp={90} semilla={9} />
      {[[180, 1260, 0.8], [880, 1420, 1.1]].map(([x, y, s], k) => <g key={k} transform={`translate(${x} ${y}) scale(${s})`}><rect x={-30} y={-300} width={60} height={300} rx={30} fill={T("#4E9A4A", m)} /><path d="M -30 -150 h -60 v -90" stroke={T("#4E9A4A", m)} strokeWidth={46} fill="none" strokeLinecap="round" /><path d="M 30 -200 h 60 v -70" stroke={T("#4E9A4A", m)} strokeWidth={46} fill="none" strokeLinecap="round" /><rect x={-8} y={-290} width={12} height={280} fill="rgba(255,255,255,0.18)" /></g>)}
      <Suelo m={m} y={1500} tipo="arena" id={id} /></g>) },
  nieve: { desc: "paisaje nevado de invierno con nieve cayendo", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><Cielo2 m={m} id={id} h={1050} nubes={3} pajaros={false} /><Cordillera m={m} h={1050} color="#B9C9DE" alto={520} semilla={31} nieve niebla={0.3} /><Loma m={m} h={1150} color="#EEF4FA" semilla={2} niebla={0.1} />{Array.from({ length: 6 }).map((_, i) => <Arbol2 key={i} x={-100 + i * 240} y={1160 + (i % 2) * 60} s={0.6} m={m} tipo="pino" color="#2F6650" />)}<Suelo m={m} y={1320} tipo="nieve" id={id} />{Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={ruido(i) * 1500 - 200 + Math.sin(f / 20 + i) * 20} cy={((ruido(i + 3) * 2300 + f * (2 + ruido(i) * 3)) % 2300) - 300} r={3 + ruido(i + 1) * 6} fill="#fff" opacity={0.9} />)}</g>);
  } },
  playa: { desc: "playa tropical con palmeras y mar", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1040} /><Agua m={m} y={1040} id={id} color="#2BA6C9" /><Suelo m={m} y={1360} tipo="arena" id={id + "a"} /><path d="M -400 1360 Q 300 1330 1480 1380 L 1480 1400 Q 400 1370 -400 1390 Z" fill="#FFFFFF" opacity={0.6} /><Arbol2 x={80} y={1520} s={1.2} m={m} tipo="palmera" /><Arbol2 x={1000} y={1460} s={0.9} m={m} tipo="palmera" semilla={3} /></g>) },
  mar: { desc: "mar abierto, horizonte y olas", C: ({ m, id }) => (<g><Cielo2 m={m} id={id} h={1100} /><Agua m={m} y={1100} id={id} /></g>) },
  puerto: { desc: "puerto con muelle de madera, barcas y casas", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1000} />{[0, 1, 2, 3, 4].map((i) => <CasaMedieval key={i} x={-120 + i * 290} y={1020} w={240} h={240 + (i % 2) * 90} m={m} color={["#E8C9A0", "#D9E2E8", "#F2D3C2", "#E6DDB0", "#CFE0D0"][i]} tejado={["#9C3D2E", "#3E5A7A", "#B5573A", "#6A4A3A", "#9C3D2E"][i]} semilla={i} />)}
      <Agua m={m} y={1020} id={id} color="#2D7FA8" /><rect x={-400} y={1300} width={1300} height={60} fill={T("#8A5A36", m)} />{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-380 + i * 150} y={1350} width={30} height={260} fill={T("#5B3A24", m)} />)}
      <g transform="translate(980 1240)"><path d="M -200 0 L 200 0 L 150 90 L -150 90 Z" fill={T("#C0643A", m)} /><rect x={-6} y={-330} width={12} height={330} fill={T("#5B3A24", m)} /><path d="M 6 -320 L 6 -40 L 180 -40 Z" fill={T("#F3EEE2", m)} /></g></g>) },
  pueblo_medieval: { desc: "calle de pueblo medieval con casas de entramado y adoquines", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1160} /><Cordillera m={m} h={1100} color="#7C93AE" alto={260} semilla={61} /><Torre x={540} y={1000} w={140} h={460} m={m} />{[-60, 330, 760, 1120].map((x, i) => <CasaMedieval key={"f" + i} x={x} y={1110} w={240} h={330} m={m} color={mezcla("#E2D2B0", LUZ[m].niebla, 0.35)} tejado={mezcla("#8C4A32", LUZ[m].niebla, 0.35)} semilla={i + 20} />)}
      {[[-130, 1150, 300, 520, "#EADFC6", "#9C3D2E"], [210, 1100, 260, 440, "#E2D2B0", "#7A3B2E"], [880, 1100, 270, 460, "#EFE3CC", "#8C4A32"], [1180, 1150, 300, 540, "#DCCBA8", "#9C3D2E"]].map(([x, y, w, h, c, t], i) => <CasaMedieval key={i} x={x as number} y={y as number} w={w as number} h={h as number} m={m} color={c as string} tejado={t as string} semilla={i} />)}
      <Suelo m={m} y={1150} tipo="adoquin" id={id} />
      <CasaMedieval x={-260} y={1700} w={420} h={760} m={m} color="#E6D6B8" semilla={9} /><CasaMedieval x={1340} y={1700} w={420} h={800} m={m} color="#EAD9BD" tejado="#7A3B2E" semilla={8} /></g>) },
  castillo: { desc: "castillo de piedra con torres, banderas y foso", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><Cielo2 m={m} id={id} h={1000} /><Cordillera m={m} h={1000} color="#7C93AE" alto={300} semilla={41} /><Loma m={m} h={1060} color="#79B05E" niebla={0.3} semilla={12} />
      <g><rect x={150} y={640} width={780} height={420} fill={T("#B4ADA2", m)} />{Array.from({ length: 13 }).map((_, i) => <rect key={i} x={150 + i * 62} y={610} width={36} height={40} fill={T("#B4ADA2", m)} />)}<path d="M 470 1060 L 470 880 Q 540 800 610 880 L 610 1060 Z" fill={T("#3A2A20", m)} />{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M 150 ${700 + i * 60} h 780`} stroke="rgba(0,0,0,0.12)" strokeWidth={4} />)}</g>
      <Torre x={150} y={1060} w={170} h={620} m={m} /><Torre x={930} y={1060} w={170} h={620} m={m} /><Torre x={540} y={700} w={150} h={300} m={m} tejado="#2E4A7A" />
      {[150, 930].map((x, k) => <path key={k} d={`M ${x} ${1060 - 620 - 40 - 187 - 70} q 40 ${10 + Math.sin(f / 6 + k) * 10} 80 0 q -40 ${10 + Math.sin(f / 6 + k + 1) * 10} -80 30 Z`} fill={T(k ? "#2E4A7A" : "#B23A30", m)} transform="translate(0 -10)" />)}
      <Agua m={m} y={1080} id={id} color="#3A7C8C" /><Loma m={m} h={1340} color="#5EA84E" amp={60} semilla={5} /><Hierba m={m} y0={1350} y1={2000} /></g>);
  } },
  ciudad: { desc: "ciudad moderna con rascacielos y calle", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1200} />{Array.from({ length: 10 }).map((_, i) => { const h = 500 + ruido(i + 3) * 600; return <g key={i}><rect x={-350 + i * 190} y={1200 - h} width={170} height={h} fill={mezcla(T(["#7A8BA8", "#93A3BC", "#6C7C97"][i % 3], m), LUZ[m].niebla, 0.45)} />{Array.from({ length: Math.floor(h / 70) }).map((__, k) => <rect key={k} x={-330 + i * 190} y={1230 - h + k * 70} width={130} height={30} fill={m !== "dia" && ruido(i * 9 + k) > 0.5 ? "#FFE08A" : "rgba(255,255,255,0.25)"} />)}</g>; })}
      {[0, 1, 2, 3].map((i) => <EdificioClasico key={i} x={-150 + i * 400} y={1300} w={360} h={520 + (i % 2) * 140} m={m} color={["#C9B79C", "#B9C4CC", "#D7B79A", "#A9B6A0"][i]} semilla={i} />)}
      <Suelo m={m} y={1300} tipo="asfalto" id={id} /><Farola x={80} y={1360} m={m} /><Farola x={1000} y={1360} m={m} /></g>) },
  calle_antigua: { desc: "calle de ciudad de principios del siglo XX con edificios clásicos y farolas de gas", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1100} />{[0, 1, 2, 3].map((i) => <EdificioClasico key={i} x={-120 + i * 400} y={1250} w={380} h={640 + (i % 2) * 120} m={m} color={["#D9B98F", "#C7A98A", "#E0C9A6", "#B9A58C"][i]} semilla={i + 5} />)}
      <Suelo m={m} y={1250} tipo="adoquin" id={id} /><Farola x={140} y={1320} s={1.1} m={m} /><Farola x={940} y={1320} s={1.1} m={m} /></g>) },
  estacion_tren: { desc: "estación de tren antigua con andén, marquesina, reloj y tren de vapor", C: ({ m, id, p }) => (
    <g><Cielo2 m={m} id={id} h={1000} /><EdificioClasico x={540} y={1000} w={1100} h={380} m={m} color="#C9A98A" semilla={3} />
      <rect x={-400} y={560} width={1880} height={50} fill={T("#4A5160", m)} />{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300 + i * 230} y={600} width={22} height={560} fill={T("#4A5160", m)} />)}
      <g transform="translate(540 700)"><circle r={70} fill={T("#F3EEE2", m)} stroke={T("#2D3340", m)} strokeWidth={12} /><path d="M 0 0 L 0 -46 M 0 0 L 32 12" stroke={T("#2D3340", m)} strokeWidth={8} strokeLinecap="round" /></g>
      <Vias m={m} y={1130} />{p.sin_tren ? null : <Tren x={p.tren_x ?? 760} y={1220} s={0.8} m={m} />}
      <rect x={-400} y={1250} width={1880} height={50} fill={T("#C9C2B5", m)} /><Suelo m={m} y={1300} tipo="piedra" id={id} /><Farola x={100} y={1360} m={m} /></g>) },
  via_tren: { desc: "vía de tren a campo abierto con tren de vapor pasando", C: ({ m, id, p }) => (
    <g><Cielo2 m={m} id={id} h={1000} /><Cordillera m={m} h={1000} color="#6F86A6" alto={360} semilla={17} /><Loma m={m} h={1080} color="#86BF66" niebla={0.3} semilla={4} /><Arbol2 x={900} y={1080} s={0.45} m={m} /><Loma m={m} h={1150} color="#6DB356" amp={40} semilla={9} />
      <Vias m={m} y={1150} />{p.sin_tren ? null : <Tren x={p.tren_x ?? 700} y={1240} s={0.85} m={m} />}<Suelo m={m} y={1270} tipo="cesped" id={id} /><Hierba m={m} y0={1280} y1={2000} /></g>) },
  campo_tulipanes: { desc: "campo de tulipanes de colores en hileras con molino holandés", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1000} /><Loma m={m} h={1020} color="#7FBF63" niebla={0.3} semilla={3} amp={40} /><Molino x={780} y={1040} s={0.85} m={m} /><Arbol2 x={180} y={1030} s={0.35} m={m} tipo="chopo" />
      {Array.from({ length: 10 }).map((_, r) => { const y = 1050 + r * r * 9 + r * 26, h = 10 + r * 7; const col = ["#E8463A", "#F7C531", "#E85A9A", "#F28A2E", "#B04AC9"][r % 5]; return <g key={r}><rect x={-400} y={y} width={1880} height={h} fill={T(col, m)} />{r > 4 ? Array.from({ length: 12 }).map((_, k) => <ellipse key={k} cx={-300 + k * 150 + (r % 2) * 75} cy={y} rx={h * 0.5} ry={h * 0.7} fill={T(col, m)} />) : null}<rect x={-400} y={y + h} width={1880} height={h * 0.6} fill={T("#4E8F3E", m)} /></g>; })}
      <Hierba m={m} y0={1700} y1={2100} color="#3E7A30" n={40} /></g>) },
  jardin_mansion: { desc: "jardín elegante de mansión con fuente, setos y casa señorial", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><Cielo2 m={m} id={id} h={1000} /><EdificioClasico x={540} y={1060} w={900} h={430} m={m} color="#EFE6D6" tejado="#5A6478" semilla={2} /><Suelo m={m} y={1060} tipo="cesped" id={id} />
      {[[-120, 1150], [1200, 1150]].map(([x, y], k) => <ellipse key={k} cx={x} cy={y} rx={300} ry={90} fill={T("#3F8F3C", m)} />)}
      <g transform="translate(540 1330)"><ellipse rx={300} ry={70} fill={T("#C9C2B5", m)} /><ellipse cy={-10} rx={260} ry={50} fill={T("#5CA9C9", m)} /><rect x={-24} y={-200} width={48} height={190} fill={T("#C9C2B5", m)} />{[0, 1, 2, 3, 4, 5].map((k) => { const tt = ((f + k * 6) % 30) / 30; return <circle key={k} cx={Math.cos(k) * 120 * tt} cy={-200 + tt * tt * 190 - Math.sin(tt * 3.14) * 80} r={8} fill="#BFE6F5" opacity={1 - tt * 0.6} />; })}</g>
      <Arbol2 x={20} y={1420} s={0.8} m={m} tipo="chopo" /><Arbol2 x={1060} y={1420} s={0.8} m={m} tipo="chopo" /><Hierba m={m} y0={1420} y1={2000} /></g>);
  } },
  rio_puente: { desc: "río con puente de piedra y árboles en la orilla", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1000} /><Cordillera m={m} h={1000} color="#6F86A6" alto={320} semilla={51} /><Loma m={m} h={1060} color="#80BC62" niebla={0.3} semilla={5} /><Agua m={m} y={1150} id={id} color="#3A8FB0" />
      <g transform="translate(540 1150)"><path d="M -620 -60 L 620 -60 L 620 40 L 420 40 Q 280 -120 140 40 L -140 40 Q -280 -120 -420 40 L -620 40 Z" fill={T("#B4ADA2", m)} /><path d="M -620 -60 L 620 -60 L 620 -40 L -620 -40 Z" fill={T("#8E877E", m)} /></g>
      <Loma m={m} h={1420} color="#5EA84E" amp={60} semilla={2} /><Arbol2 x={60} y={1460} s={1} m={m} /><Hierba m={m} y0={1430} y1={2000} /></g>) },
  espacio: { desc: "espacio exterior con estrellas y planeta", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><rect x={B.x} y={B.y} width={B.w} height={B.h} fill="#060818" /><defs><radialGradient id={`${id}-pl`} cx="0.35" cy="0.35"><stop offset="0" stopColor="#7FB6FF" /><stop offset="0.6" stopColor="#2F5FB8" /><stop offset="1" stopColor="#0B1A45" /></radialGradient><radialGradient id={`${id}-ne`}><stop offset="0" stopColor="#7A3FB0" stopOpacity={0.5} /><stop offset="1" stopColor="#7A3FB0" stopOpacity={0} /></radialGradient></defs><circle cx={200} cy={500} r={700} fill={`url(#${id}-ne)`} />{Array.from({ length: 160 }).map((_, i) => <circle key={i} cx={ruido(i) * 1880 - 400} cy={ruido(i + 50) * 2700 - 400} r={0.8 + ruido(i + 2) * 2.5} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))} />)}<circle cx={780} cy={1550} r={460} fill={`url(#${id}-pl)`} /><ellipse cx={780} cy={1550} rx={700} ry={110} fill="none" stroke="#C9D8FF" strokeOpacity={0.5} strokeWidth={18} transform="rotate(-14 780 1550)" /></g>);
  } },
  cielo: { desc: "cielo abierto entre nubes (para aviones, globos, pájaros)", C: ({ m, id }) => (<g><Cielo2 m={m} id={id} h={2300} nubes={7} /></g>) },
  // ── interiores ──
  taberna: { desc: "taberna o pub antiguo: barra de madera, barriles, chimenea y lámparas", C: ({ m, id }) => (
    <g><Habitacion m={m} id={id} pared="#B98B5E" suelo="madera" zocalo="#5B3A24" /><Mueble tipo="chimenea" x={250} y={1180} s={0.8} m={m} /><Mueble tipo="estanteria" x={880} y={1180} s={0.9} m={m} /><Mueble tipo="lampara" x={540} y={1300} m={m} /><Mueble tipo="barril" x={1010} y={1330} s={0.8} m={m} /><Mueble tipo="barril" x={70} y={1340} s={0.75} m={m} /></g>) },
  taller: { desc: "taller de artesano o mecánico con banco de trabajo y herramientas", C: ({ m, id }) => (
    <g><Habitacion m={m} id={id} pared="#C9B59A" suelo="piedra" zocalo="#6F6760" /><Mueble tipo="banco_trabajo" x={680} y={1240} s={0.9} m={m} /><Mueble tipo="estanteria" x={220} y={1220} s={0.8} m={m} color="#6F5A44" /><Mueble tipo="barril" x={1000} y={1330} s={0.8} m={m} /><Mueble tipo="lampara" x={540} y={1300} m={m} /></g>) },
  laboratorio: { desc: "laboratorio científico con pizarra, estantes y matraces burbujeando", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><Habitacion m={m} id={id} pared="#D8E4EA" suelo="baldosa" zocalo="#9AA9B5" ventana={false} /><Mueble tipo="pizarra" x={400} y={1180} m={m} /><Mueble tipo="estanteria" x={900} y={1200} s={0.8} m={m} color="#9AA9B5" /><Mueble tipo="mesa" x={560} y={1235} s={0.9} m={m} color="#E8EEF2" />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${430 + i * 130} 1070) scale(0.7)`}><path d="M -26 -150 L -26 -80 L -64 0 L 64 0 L 26 -80 L 26 -150 Z" fill={["#7FE0A8", "#FF8FB1", "#8FC7FF"][i]} opacity={0.85} /><path d="M -26 -150 L -26 -80 L -64 0 L -40 0 L -10 -80 L -10 -150 Z" fill="#fff" opacity={0.35} />{[0, 1].map((k) => <circle key={k} cx={(k - 0.5) * 20} cy={-90 - ((f * 2 + i * 15 + k * 20) % 70)} r={8} fill="#fff" opacity={0.7} />)}</g>)}</g>);
  } },
  oficina: { desc: "oficina con mesa, estanterías, planta y ventana", C: ({ m, id }) => (
    <g><Habitacion m={m} id={id} pared="#E4E8EC" suelo="baldosa" zocalo="#B9C2CC" /><Mueble tipo="estanteria" x={220} y={1200} s={0.85} m={m} color="#9A7A5A" /><Mueble tipo="planta" x={960} y={1260} m={m} /><Mueble tipo="mesa" x={640} y={1240} s={1.0} m={m} color="#9A7A5A" /><Mueble tipo="cuadro" x={560} y={1300} s={0.9} m={m} /></g>) },
  casa: { desc: "salón de una casa acogedora con chimenea, cuadro y lámpara", C: ({ m, id }) => (
    <g><Habitacion m={m} id={id} pared="#E9D8B9" suelo="madera" /><Mueble tipo="chimenea" x={300} y={1180} s={0.75} m={m} /><Mueble tipo="cuadro" x={720} y={1250} s={0.8} m={m} /><Mueble tipo="planta" x={1000} y={1300} m={m} /><Mueble tipo="lampara" x={540} y={1280} m={m} /><Mueble tipo="silla" x={880} y={1500} m={m} /></g>) },
  salon_castillo: { desc: "gran salón de castillo con muros de piedra, estandartes y antorchas", C: ({ m, id }) => {
    const f = useCurrentFrame();
    return (<g><Habitacion m={m} id={id} pared="#9A948C" suelo="piedra" zocalo="#625C56" ventana={false} />{[280, 800].map((x, k) => <g key={k}><path d={`M ${x - 90} 260 L ${x + 90} 260 L ${x + 90} 700 L ${x} 640 L ${x - 90} 700 Z`} fill={T(k ? "#2E4A7A" : "#B23A30", m)} /><circle cx={x} cy={430} r={50} fill={T("#E0B341", m)} /></g>)}{[140, 940].map((x, k) => <g key={"t" + k}><rect x={x - 10} y={820} width={20} height={90} fill={T("#5B3A24", m)} /><path d={`M ${x} ${760 + Math.sin(f / 3 + k) * 6} Q ${x - 26} 800 ${x} 830 Q ${x + 26} 800 ${x} ${760 + Math.sin(f / 3 + k) * 6}`} fill="#FFB03A" /><Resplandor x={x} y={790} r={240} color="#FFB03A" fuerza={0.45} /></g>)}<Mueble tipo="mesa" x={540} y={1230} s={1.2} m={m} color="#6B4226" /></g>);
  } },
  mercado: { desc: "mercado o plaza con puestos de fruta y toldos de colores", C: ({ m, id }) => (
    <g><Cielo2 m={m} id={id} h={1100} />{[0, 1, 2].map((i) => <CasaMedieval key={i} x={60 + i * 480} y={1050} w={360} h={420} m={m} color={["#EADFC6", "#E2D2B0", "#EFE3CC"][i]} semilla={i + 2} />)}<Suelo m={m} y={1050} tipo="adoquin" id={id} />
      {[[200, "#E8463A"], [880, "#2E7BC0"]].map(([x, c], k) => <g key={k} transform={`translate(${x} 1400)`}><rect x={-230} y={-200} width={460} height={200} fill={T("#8A5A36", m)} />{Array.from({ length: 8 }).map((_, j) => <circle key={j} cx={-180 + j * 52} cy={-210} r={26} fill={T(["#FF8C1A", "#E8463A", "#F7C531", "#7CC46A"][j % 4], m)} />)}<rect x={-240} y={-420} width={16} height={420} fill={T("#5B3A24", m)} /><rect x={224} y={-420} width={16} height={420} fill={T("#5B3A24", m)} />{Array.from({ length: 6 }).map((_, j) => <path key={j} d={`M ${-260 + j * 87} -420 L ${-173 + j * 87} -420 L ${-173 + j * 87} -340 Q ${-216 + j * 87} -300 ${-260 + j * 87} -340 Z`} fill={T(j % 2 ? "#FFFFFF" : (c as string), m)} />)}</g>)}</g>) },
  liso: { desc: "fondo liso de color con degradado (para datos, cifras o primeros planos)", C: ({ m, id, p }) => (
    <g><defs><radialGradient id={`${id}-l`} cx="0.5" cy="0.4" r="0.8"><stop offset="0" stopColor={mezcla(p.color ?? "#F3E3C3", "#FFFFFF", 0.35)} /><stop offset="1" stopColor={mezcla(p.color ?? "#F3E3C3", "#000000", 0.25)} /></radialGradient></defs><rect x={B.x} y={B.y} width={B.w} height={B.h} fill={`url(#${id}-l)`} /></g>) },
};

export const NOMBRES_ESCENARIOS = Object.keys(ESCENARIOS);

// Por la noche los interiores se ven a la luz cálida de las lámparas, no a oscuras
for (const k of INTERIORES) {
  const orig = ESCENARIOS[k].C;
  ESCENARIOS[k] = { ...ESCENARIOS[k], C: (props) => orig({ ...props, m: "dia" }) };
}
