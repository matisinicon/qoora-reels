/**
 * Portada del Reel de RASTRO (línea de casos, lienzo crema · Brand DNA v1.1).
 * Contenido clave dentro de la franja 3:4 central (y 240–1680) para la cuadrícula del perfil.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./brand";
import { Halo, LivingBackground, Mascot, Signature } from "./components";

const Chip: React.FC<{ x: number; y: number; rot: number; dot: string; children: React.ReactNode }> = ({ x, y, rot, dot, children }) => (
  <div style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg` }}>
    <div
      style={{
        background: C.card,
        borderRadius: 22,
        padding: "18px 28px",
        boxShadow: "0 10px 24px rgba(60,40,20,.14)",
        fontFamily: FONT.body,
        fontWeight: 600,
        fontSize: 34,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        gap: 14,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: 8, background: dot }} />
      {children}
    </div>
  </div>
);

/** Lupa dibujada (gag de búsqueda de la marca) */
const Lupa: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, rotate: "-12deg", filter: "drop-shadow(0 10px 14px rgba(60,40,20,.2))" }}>
    <circle cx={40} cy={40} r={28} fill="rgba(255,255,255,.55)" stroke={C.ink} strokeWidth={8} />
    <path d="M 26 32 Q 32 22 44 22" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    <line x1={61} y1={61} x2={88} y2={88} stroke={C.accent} strokeWidth={14} strokeLinecap="round" />
  </svg>
);

export const PortadaRastro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <LivingBackground />
    <Signature name="RASTRO" tagline="agente de compras con IA" />
    <div style={{ position: "absolute", top: 290, left: 60, right: 60, textAlign: "center", fontFamily: FONT.head, fontWeight: 700, color: C.ink }}>
      <div style={{ fontSize: 84, lineHeight: 1.05 }}>Este taller perdía</div>
      <div style={{ fontSize: 210, lineHeight: 1, color: C.accent, letterSpacing: "-0.02em" }}>HORAS</div>
      <div style={{ fontSize: 76, lineHeight: 1.05 }}>buscando piezas</div>
    </div>
    <Halo cx={540} cy={1110} r={300} />
    <Mascot view="frente" cx={540} baseY={1340} width={470} />
    <Lupa x={730} y={1000} s={230} />
    <Chip x={70} y={880} rot={-5} dot={C.ok}>Land Rover · Defender</Chip>
    <Chip x={600} y={830} rot={4} dot={C.accent}>Europa + eBay</Chip>
    <Chip x={60} y={1240} rot={3} dot={C.amber}>Original o equivalente</Chip>
    <div style={{ position: "absolute", top: 1430, left: 0, right: 0, textAlign: "center", fontFamily: FONT.head, fontWeight: 700, fontSize: 70, color: C.ink }}>
      Así nació <span style={{ color: C.accent }}>RASTRO</span>
    </div>
    <div style={{ position: "absolute", top: 1540, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.accentSoft, color: C.accent, borderRadius: 14, padding: "10px 24px", fontFamily: FONT.head, fontWeight: 700, fontSize: 32 }}>
        CASO REAL · DONAT CLASICS
      </div>
    </div>
  </AbsoluteFill>
);
