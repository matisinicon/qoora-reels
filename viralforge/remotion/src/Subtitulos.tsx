import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fuente";
import { Palabra } from "./tipos";


// Bloques cortos: máx. 3 palabras / 20 caracteres, cortando en fin de frase
function agrupar(palabras: Palabra[]): Palabra[][] {
  const bloques: Palabra[][] = [];
  let actual: Palabra[] = [];
  for (const w of palabras) {
    if (!w.t.trim()) continue;
    const cand = [...actual, w];
    const largo = cand.map((x) => x.t).join(" ").length;
    if (actual.length && (cand.length > 3 || largo > 20)) {
      bloques.push(actual);
      actual = [w];
    } else actual = cand;
    if (/[.!?…]$/.test(w.t)) {
      bloques.push(actual);
      actual = [];
    }
  }
  if (actual.length) bloques.push(actual);
  return bloques;
}

export const Subtitulos: React.FC<{ palabras: Palabra[] }> = ({ palabras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const bloques = useMemo(() => agrupar(palabras), [palabras]);
  const idx = bloques.findIndex((b, i) => {
    const fin = Math.max(b[b.length - 1].e, b[0].s + 0.35);
    const sig = bloques[i + 1]?.[0].s ?? Infinity;
    return t >= b[0].s - 0.05 && t < Math.min(fin + 0.25, sig - 0.02);
  });
  if (idx < 0) return null;
  const b = bloques[idx];
  const entrada = spring({ frame: f - Math.round(b[0].s * fps), fps, config: { damping: 12, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1180 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 34px",
          padding: "0 70px",
          transform: `scale(${interpolate(entrada, [0, 1], [0.7, 1])}) translateY(${interpolate(entrada, [0, 1], [30, 0])}px)`,
          opacity: entrada,
        }}
      >
        {b.map((w, i) => {
          const activa = t >= w.s - 0.03 && t < w.e + 0.08;
          const pop = spring({ frame: f - Math.round(w.s * fps), fps, config: { damping: 10, stiffness: 260 } });
          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 96,
                lineHeight: 1.1,
                color: activa ? "#FFD23F" : "#FFFFFF",
                WebkitTextStroke: "14px #1a0b2e",
                paintOrder: "stroke fill",
                textShadow: "0 8px 0 rgba(26,11,46,0.9), 0 14px 28px rgba(0,0,0,0.45)",
                transform: `scale(${activa ? interpolate(pop, [0, 1], [1.18, 1.04]) : 1})`,
                display: "inline-block",
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
