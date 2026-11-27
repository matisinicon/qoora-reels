import React from "react";
import { useCurrentFrame } from "remotion";
import { ruido } from "./estilo";

// VIRALFORGE · efectos atmosféricos (Directriz maestra): polvo, ascuas, luciérnagas, lluvia, nieve, partículas, rayos de luz
export type TipoAtmosfera = "polvo" | "ascuas" | "luciernagas" | "lluvia" | "nieve" | "particulas" | "rayos" | "ninguna";

export const Atmosfera: React.FC<{ tipo?: string; luz?: "izq" | "der" }> = ({ tipo = "particulas", luz = "izq" }) => {
  const f = useCurrentFrame();
  const lado = luz === "izq" ? -1 : 1;
  switch (tipo) {
    case "ninguna": return null;
    case "lluvia":
      return <g>{Array.from({ length: 90 }).map((_, i) => { const x = ruido(i) * 1500 - 200, y = ((ruido(i + 7) * 2300 + f * 38) % 2300) - 300; return <path key={i} d={`M ${x} ${y} l -10 46`} stroke="#CFE3FF" strokeWidth={3} opacity={0.55} />; })}<rect x={-400} y={-400} width={1880} height={2720} fill="#2A3B6B" opacity={0.12} /></g>;
    case "nieve":
      return <g>{Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={ruido(i) * 1500 - 200 + Math.sin(f / 20 + i) * 22} cy={((ruido(i + 3) * 2300 + f * (2 + ruido(i) * 3)) % 2300) - 300} r={3 + ruido(i + 1) * 7} fill="#fff" opacity={0.9} />)}</g>;
    case "ascuas":
      return <g>{Array.from({ length: 40 }).map((_, i) => { const t = ((f * (1.2 + ruido(i) * 1.5) + ruido(i + 5) * 2000) % 2000) / 2000; return <circle key={i} cx={ruido(i + 2) * 1100 + Math.sin(f / 9 + i) * 30} cy={1900 - t * 2000} r={3 + ruido(i + 9) * 4} fill={i % 2 ? "#FFB03A" : "#FF6A2A"} opacity={0.9 * (1 - t)} />; })}</g>;
    case "luciernagas":
      return <g>{Array.from({ length: 26 }).map((_, i) => { const x = ruido(i) * 1080 + Math.sin(f / 30 + i) * 60, y = 500 + ruido(i + 4) * 1000 + Math.cos(f / 25 + i) * 40; const o = 0.4 + 0.6 * Math.abs(Math.sin(f / 12 + i)); return <g key={i} opacity={o}><circle cx={x} cy={y} r={18} fill="#FFF3A0" opacity={0.25} /><circle cx={x} cy={y} r={5} fill="#FFFBD0" /></g>; })}</g>;
    case "rayos": {
      const x0 = lado < 0 ? -200 : 1280;
      return <g style={{ mixBlendMode: "screen" }}>{[0, 1, 2, 3].map((k) => <path key={k} d={`M ${x0} ${-300 + k * 80} L ${x0 + lado * -1} ${-200 + k * 80} L ${540 - lado * (200 - k * 180)} 2200 L ${540 - lado * (40 - k * 180)} 2200 Z`} fill="#FFF2C8" opacity={0.07 + 0.03 * Math.sin(f / 30 + k)} />)}{Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={ruido(i) * 1080} cy={((ruido(i + 3) * 1900 + f * 0.8) % 1900)} r={2 + ruido(i) * 3} fill="#FFF6DA" opacity={0.6} />)}</g>;
    }
    case "polvo":
    case "particulas":
    default:
      return <g>{Array.from({ length: 36 }).map((_, i) => { const x = ((ruido(i) * 1300 + f * (0.3 + ruido(i + 2) * 0.6)) % 1300) - 100, y = ruido(i + 6) * 1900 + Math.sin(f / 20 + i) * 20; return <circle key={i} cx={x} cy={y} r={2 + ruido(i + 1) * 4} fill={tipo === "polvo" ? "#F3E2C0" : "#FFFFFF"} opacity={0.35 + 0.35 * Math.abs(Math.sin(f / 15 + i))} />; })}</g>;
  }
};
