import React from "react";
import { AbsoluteFill } from "remotion";
import { Fondo } from "./kit/Fondos";
import { Personaje } from "./kit/Personaje";
import { Reparto } from "./kit/Capas";
import { Atmosfera } from "./kit/Atmosfera";
import { BIBLIOTECA } from "./kit/Biblioteca";
import { fontFamily } from "./fuente";

// VIRALFORGE · portada diseñada a propósito (Directriz maestra): no es un fotograma del vídeo.
// Protagonista grande en pose exagerada, objeto clave, un punto focal, alto contraste y 2-4 palabras de gancho.
export type DisenoPortada = {
  fondo?: { tipo: string; momento?: "dia" | "atardecer" | "noche" };
  protagonista?: string;
  expresion?: string;
  brazo?: string;
  objeto?: string; // emoji o nombre de la biblioteca
  secundario?: { ref: string; expresion?: string; brazo?: string };
  texto?: string;
  luz?: "izq" | "der";
};
export type PortadaProps = { diseno_portada: DisenoPortada; reparto?: Reparto; titulo?: string };

export const Portada: React.FC<PortadaProps> = ({ diseno_portada: d, reparto = {}, titulo }) => {
  const luz = d.luz ?? "izq";
  const prot = { ...(reparto[d.protagonista ?? "C1"] ?? reparto[Object.keys(reparto)[0]] ?? {}) };
  const sec = d.secundario ? reparto[d.secundario.ref] ?? {} : null;
  const Obj = d.objeto && BIBLIOTECA[d.objeto] ? BIBLIOTECA[d.objeto] : null;
  const esEmoji = d.objeto && !Obj;
  const texto = (d.texto || titulo || "").toUpperCase().split(/\s+/).slice(0, 5).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="fondoSuave"><feGaussianBlur stdDeviation="5" /></filter>
          <radialGradient id="foco" cx="0.5" cy="0.62" r="0.6"><stop offset="0" stopColor="#FFF6D8" stopOpacity={0.55} /><stop offset="1" stopColor="#FFF6D8" stopOpacity={0} /></radialGradient>
          <radialGradient id="vinetaP" cx="0.5" cy="0.55" r="0.75"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></radialGradient>
        </defs>
        <g filter="url(#fondoSuave)" transform="translate(540 960) scale(1.15) translate(-540 -960)"><Fondo f={d.fondo ?? { tipo: "campo", momento: "atardecer" }} /></g>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#foco)" />
        {sec ? <Personaje {...sec} x={luz === "izq" ? 880 : 200} y={1520} escala={0.95} expresion={d.secundario?.expresion ?? "sorpresa"} brazo={d.secundario?.brazo ?? "abajo"} espejo={luz === "izq"} luz={luz} semilla={2} /> : null}
        <Personaje {...prot} x={sec ? (luz === "izq" ? 430 : 650) : 540} y={1720} escala={1.75} expresion={d.expresion ?? "sorpresa"} brazo={d.brazo ?? (d.objeto ? "sostiene" : "arriba")} objeto={esEmoji ? d.objeto : undefined} luz={luz} semilla={1} />
        {Obj ? <g transform="translate(800 980) scale(1.1)"><Obj id="po" inicio={0} /></g> : null}
        <Atmosfera tipo="particulas" luz={luz} />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#vinetaP)" />
      </svg>
      {texto ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 170 }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: texto.length > 16 ? 118 : 140, lineHeight: 1.0, color: "#FFE14D", WebkitTextStroke: "18px #000", paintOrder: "stroke fill", textShadow: "0 12px 0 rgba(0,0,0,0.6)", textAlign: "center", padding: "0 60px", transform: "rotate(-3deg)" }}>
            {texto}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
