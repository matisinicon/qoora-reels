import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fuente";
import { Palabra } from "../tipos";

// Subtítulo estilo viral: 2-3 palabras grandes, la que se está diciendo resaltada en amarillo.
// Va en la franja baja segura (encima de la interfaz de YouTube) para no tapar caras.
export const SubtituloCentral: React.FC<{ palabras: Palabra[] }> = ({ palabras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const grupos = useMemo(() => {
    const g: Palabra[][] = [];
    let a: Palabra[] = [];
    for (const w of palabras) {
      const cand = [...a, w];
      if (a.length && (cand.length > 3 || cand.map((x) => x.t).join(" ").length > 18)) { g.push(a); a = [w]; } else a = cand;
      if (/[.!?…:,]$/.test(w.t)) { g.push(a); a = []; }
    }
    if (a.length) g.push(a);
    return g;
  }, [palabras]);
  const i = grupos.findIndex((g, k) => t >= g[0].s - 0.04 && t < (grupos[k + 1]?.[0].s ?? g[g.length - 1].e + 0.4) - 0.02);
  if (i < 0) return null;
  const g = grupos[i];
  const pop = spring({ frame: f - Math.round(g[0].s * fps), fps, config: { damping: 12, stiffness: 260 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1300 }}>
      <div style={{
        fontFamily, fontWeight: 700, fontSize: 96, lineHeight: 1.05, WebkitTextStroke: "14px #000", paintOrder: "stroke fill",
        textShadow: "0 8px 0 rgba(0,0,0,0.55)", transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])}) rotate(${interpolate(pop, [0, 1], [-3, 0])}deg)`,
        textAlign: "center", padding: "0 70px", textTransform: "uppercase", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 28, rowGap: 4,
      }}>
        {g.map((w, k) => {
          const activa = t >= w.s - 0.03 && t < (g[k + 1]?.s ?? w.e + 0.3);
          return <span key={k} style={{ color: activa ? "#FFE14D" : "#FFFFFF", display: "inline-block", transform: activa ? "scale(1.08)" : "none" }}>{w.t.replace(/[.,;:]$/, "")}</span>;
        })}
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
