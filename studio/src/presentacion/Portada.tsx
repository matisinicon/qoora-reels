/**
 * Portada (cover) del vídeo de presentación · línea corporativa oscura.
 * 1080×1920. El contenido clave está en la franja central 1080×1440 (y 240–1680),
 * que es lo que se ve en la cuadrícula del perfil de Instagram.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../qoora/brand";
import { Core, D, DarkBackground, Defs, DrawEdge, DSignature, edge, Module, Packet, Pulse, ring, Rings, towards } from "./kit";

const AGENTS = ["INVESTIGACIÓN", "DATOS", "ESTRATEGIA", "OPERACIONES", "ATENCIÓN", "AUTOMATIZACIÓN"];

export const Portada: React.FC = () => {
  const c = { x: 540, y: 980 };
  const mods = ring(6, c.x, c.y, 330, 300, -90);
  const coreEdges = mods.map((m, i) => edge(towards(c, m, 100), m, i % 2 ? 0.1 : -0.1));
  const peers = mods.map((m, i) => edge(m, mods[(i + 1) % 6], -0.18));
  const T = -20; // todo ya construido
  return (
    <AbsoluteFill style={{ backgroundColor: D.bg }}>
      <DarkBackground glow={c} glowR={700} glowA={0.22} />
      <DSignature />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: FONT.head,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: "#fff",
        }}
      >
        Tu empresa no necesita otro <span style={{ color: D.orange }}>chatbot.</span>
      </div>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <Rings c={c} radii={[150, 240, 430]} start={T} rotate={false} />
        {peers.map((e, i) => (
          <DrawEdge key={`p${i}`} e={e} k={1} hot opacity={0.45} />
        ))}
        {coreEdges.map((e, i) => (
          <g key={i}>
            <DrawEdge e={e} k={1} hot />
            <Packet e={e} start={T + 0.37 * i} period={1} travel={0.9} />
          </g>
        ))}
        <Core c={c} r={110} start={T} />
        <Pulse c={c} start={-0.4} r0={120} r1={260} dur={1} />
        {mods.map((m, i) => (
          <Module key={AGENTS[i]} c={m} label={AGENTS[i]} start={T} active={T} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1430,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.head,
          fontWeight: 700,
          fontSize: 94,
          letterSpacing: "-0.03em",
          color: "#fff",
        }}
      >
        Necesita <span style={{ color: D.orange }}>6 agentes.</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1590,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 6,
          color: D.mute,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 5, background: D.orange }} />
        INGENIERÍA DE INTELIGENCIA AGÉNTICA
      </div>
    </AbsoluteFill>
  );
};
