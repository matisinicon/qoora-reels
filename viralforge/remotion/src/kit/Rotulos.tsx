import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fuente";
import { Palabra } from "../tipos";

// Palabra grande en el centro (1-2 palabras cortas), como en el formato de referencia
export const SubtituloCentral: React.FC<{ palabras: Palabra[] }> = ({ palabras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const grupos = useMemo(() => {
    const g: Palabra[][] = [];
    let a: Palabra[] = [];
    for (const w of palabras) {
      const cand = [...a, w];
      if (a.length && (cand.length > 2 || cand.map((x) => x.t).join(" ").length > 12)) { g.push(a); a = [w]; } else a = cand;
      if (/[.!?…:,]$/.test(w.t)) { g.push(a); a = []; }
    }
    if (a.length) g.push(a);
    return g;
  }, [palabras]);
  const i = grupos.findIndex((g, k) => t >= g[0].s - 0.04 && t < (grupos[k + 1]?.[0].s ?? g[g.length - 1].e + 0.4) - 0.02);
  if (i < 0) return null;
  const g = grupos[i];
  const pop = spring({ frame: f - Math.round(g[0].s * fps), fps, config: { damping: 11, stiffness: 240 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1230 }}>
      <div style={{
        fontFamily, fontWeight: 700, fontSize: 112, color: "#fff", WebkitTextStroke: "16px #000", paintOrder: "stroke fill",
        textShadow: "0 10px 24px rgba(0,0,0,0.45)", transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, textAlign: "center", padding: "0 60px",
      }}>
        {g.map((w) => w.t).join(" ")}
      </div>
    </AbsoluteFill>
  );
};

// Caja pequeña arriba con la frase que se está narrando
export const CajaNarracion: React.FC<{ palabras: Palabra[] }> = ({ palabras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const frases = useMemo(() => {
    const r: Palabra[][] = [];
    let a: Palabra[] = [];
    for (const w of palabras) { a.push(w); if (/[.!?…:]$/.test(w.t) || a.length >= 14) { r.push(a); a = []; } }
    if (a.length) r.push(a);
    return r;
  }, [palabras]);
  const fr = frases.find((x, k) => t >= x[0].s - 0.05 && t < (frases[k + 1]?.[0].s ?? 9999));
  if (!fr) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150 }}>
      <div style={{ maxWidth: 820, background: "rgba(10,10,20,0.62)", borderRadius: 18, padding: "14px 26px", fontFamily, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: "#fff", textAlign: "left" }}>
        {fr.map((w, i) => (
          <span key={i} style={{ color: t >= w.s ? "#fff" : "rgba(255,255,255,0.45)" }}>{w.t} </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
