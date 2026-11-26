import React from "react";
import { useCurrentFrame } from "remotion";
import { PALETA, TINTA, ruido } from "./estilo";

type Momento = "dia" | "atardecer" | "noche";

export const Cielo: React.FC<{ momento?: Momento; horizonte?: number }> = ({ momento = "dia", horizonte = 1150 }) => {
  const f = useCurrentFrame();
  const [a, b] = PALETA[`cielo_${momento}` as const];
  return (
    <g>
      <defs>
        <linearGradient id={`cielo-${momento}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={1880} height={horizonte + 400} fill={`url(#cielo-${momento})`} />
      {momento === "noche" ? (
        <g>
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={ruido(i) * 1080} cy={ruido(i + 99) * (horizonte - 150)} r={2 + ruido(i + 7) * 3} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 15 + i))} />
          ))}
          <circle cx={820} cy={330} r={85} fill="#FFF6C8" />
          <circle cx={850} cy={310} r={85} fill={a} opacity={0.0} />
        </g>
      ) : (
        <circle cx={momento === "atardecer" ? 540 : 830} cy={momento === "atardecer" ? horizonte - 40 : 330} r={momento === "atardecer" ? 150 : 95} fill={momento === "atardecer" ? "#FFE08A" : "#FFF3B0"} />
      )}
      {[0, 1, 2, 3].map((i) => {
        const x = ((ruido(i + 3) * 1400 + f * (0.4 + i * 0.15)) % 1600) - 300;
        return (
          <g key={i} transform={`translate(${x} ${180 + i * 170}) scale(${0.8 + ruido(i) * 0.6})`} opacity={momento === "noche" ? 0.25 : 0.95}>
            <ellipse cx={0} cy={0} rx={120} ry={46} fill="#fff" />
            <ellipse cx={-70} cy={12} rx={80} ry={38} fill="#fff" />
            <ellipse cx={80} cy={14} rx={90} ry={36} fill="#fff" />
          </g>
        );
      })}
    </g>
  );
};

export const Mar: React.FC<{ momento?: Momento; horizonte?: number }> = ({ momento = "dia", horizonte = 1150 }) => {
  const f = useCurrentFrame();
  const [a, b] = momento === "noche" ? PALETA.mar_noche : PALETA.mar_dia;
  const olas = Array.from({ length: 9 });
  return (
    <g>
      <defs>
        <linearGradient id={`mar-${momento}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x={-400} y={horizonte} width={1880} height={2400} fill={`url(#mar-${momento})`} />
      {olas.map((_, i) => {
        const y = horizonte + 30 + i * i * 14;
        const amp = 6 + i * 2.2;
        const fase = f / (14 - i * 0.6) + i;
        let d = `M -400 ${y}`;
        for (let x = -400; x <= 1480; x += 40) d += ` L ${x} ${y + Math.sin(x / (60 + i * 18) + fase) * amp}`;
        return <path key={i} d={d} stroke="rgba(255,255,255,0.35)" strokeWidth={3 + i * 0.7} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

export const Interior: React.FC<{ pared?: string; cuadro?: boolean; ventana?: boolean; mesa?: boolean }> = ({ pared = PALETA.pared, cuadro = true, ventana = true, mesa = false }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-400} y={-400} width={1880} height={1900} fill={pared} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-400 + i * 160} y={-400} width={80} height={1900} fill="rgba(0,0,0,0.035)" />
      ))}
      <rect x={-400} y={1500} width={1880} height={900} fill={PALETA.suelo} />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={-400 + i * 140} y1={1500} x2={-700 + i * 190} y2={2400} stroke="rgba(0,0,0,0.15)" strokeWidth={5} />
      ))}
      <rect x={-400} y={1480} width={1880} height={30} fill="#7a4f31" stroke={TINTA} strokeWidth={6} />
      {ventana ? (
        <g transform="translate(700 420)">
          <rect x={0} y={0} width={300} height={400} fill="#9ED7F5" stroke={TINTA} strokeWidth={10} />
          <rect x={0} y={250 + Math.sin(f / 20) * 4} width={300} height={150} fill="#2C8BC7" />
          <line x1={150} y1={0} x2={150} y2={400} stroke={TINTA} strokeWidth={8} />
          <line x1={0} y1={200} x2={300} y2={200} stroke={TINTA} strokeWidth={8} />
        </g>
      ) : null}
      {cuadro ? (
        <g transform="translate(110 380)">
          <rect x={0} y={0} width={360} height={260} fill="#F7F0E1" stroke="#8B5A2B" strokeWidth={22} />
          <path d="M 30 200 Q 120 150 180 190 T 330 170 L 330 230 L 30 230 Z" fill="#2C8BC7" />
          <path d="M 140 175 L 250 175 L 230 200 L 160 200 Z" fill="#555" />
        </g>
      ) : null}
      {mesa ? (
        <g transform="translate(540 1420)">
          <rect x={-420} y={-60} width={840} height={60} rx={10} fill="#8B5A2B" stroke={TINTA} strokeWidth={8} />
          <rect x={-380} y={0} width={40} height={220} fill="#6d4421" stroke={TINTA} strokeWidth={6} />
          <rect x={340} y={0} width={40} height={220} fill="#6d4421" stroke={TINTA} strokeWidth={6} />
        </g>
      ) : null}
    </g>
  );
};
