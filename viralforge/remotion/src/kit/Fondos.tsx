import React from "react";
import { useCurrentFrame } from "remotion";
import { Cielo, Interior, Mar } from "./Escenario";
import { TINTA, ruido } from "./estilo";

type Momento = "dia" | "atardecer" | "noche";
export type FondoSpec = { tipo: string; momento?: Momento; color?: string; pared?: string };

const Colinas: React.FC<{ momento: Momento; horizonte: number; tonos: string[] }> = ({ momento, horizonte, tonos }) => {
  const oscuro = momento === "noche" ? 0.45 : 1;
  return (
    <g style={{ filter: `brightness(${oscuro})` }}>
      <path d={`M -400 ${horizonte} Q 100 ${horizonte - 160} 500 ${horizonte - 40} T 1480 ${horizonte - 90} L 1480 2400 L -400 2400 Z`} fill={tonos[0]} />
      <path d={`M -400 ${horizonte + 120} Q 300 ${horizonte - 20} 800 ${horizonte + 90} T 1480 ${horizonte + 40} L 1480 2400 L -400 2400 Z`} fill={tonos[1]} />
      <rect x={-400} y={horizonte + 300} width={1880} height={2000} fill={tonos[2]} />
    </g>
  );
};

const Arbolito: React.FC<{ x: number; y: number; s: number; tono?: string }> = ({ x, y, s, tono = "#3E8E41" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-18} y={-120} width={36} height={130} fill="#7A4E2B" stroke={TINTA} strokeWidth={7} />
    <circle cx={0} cy={-190} r={110} fill={tono} stroke={TINTA} strokeWidth={8} />
    <circle cx={-60} cy={-140} r={70} fill={tono} stroke={TINTA} strokeWidth={8} />
    <circle cx={65} cy={-135} r={70} fill={tono} stroke={TINTA} strokeWidth={8} />
  </g>
);

export const Fondo: React.FC<{ f: FondoSpec }> = ({ f: spec }) => {
  const fr = useCurrentFrame();
  const m = (spec.momento ?? "dia") as Momento;
  switch (spec.tipo) {
    case "mar":
      return <g><Cielo momento={m} /><Mar momento={m} /></g>;
    case "interior":
      return <Interior pared={spec.pared} />;
    case "laboratorio":
      return (
        <g>
          <Interior pared={spec.pared ?? "#D8E4EA"} cuadro={false} ventana />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${160 + i * 150} 1380)`}>
              <path d="M -30 -160 L -30 -90 L -70 0 L 70 0 L 30 -90 L 30 -160 Z" fill={["#7FE0A8", "#FF8FB1", "#8FC7FF"][i]} stroke={TINTA} strokeWidth={7} opacity={0.9} />
              <circle cx={0} cy={-200 - ((fr + i * 15) % 40)} r={10} fill="#fff" opacity={0.6} />
            </g>
          ))}
        </g>
      );
    case "campo":
    case "granja":
      return (
        <g>
          <Cielo momento={m} horizonte={1100} />
          <Colinas momento={m} horizonte={1100} tonos={["#7CC46A", "#5DAA52", "#4E9446"]} />
          {spec.tipo === "granja" ? (
            <g transform="translate(250 1150)" style={{ filter: m === "noche" ? "brightness(0.6)" : undefined }}>
              <path d="M -170 0 L -170 -230 L 0 -330 L 170 -230 L 170 0 Z" fill="#C8433A" stroke={TINTA} strokeWidth={10} strokeLinejoin="round" />
              <rect x={-60} y={-150} width={120} height={150} fill="#fff" stroke={TINTA} strokeWidth={8} />
              <path d="M -60 -150 L 60 0 M 60 -150 L -60 0" stroke={TINTA} strokeWidth={7} />
            </g>
          ) : null}
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i}>
              <rect x={-60 + i * 140} y={1380} width={16} height={110} fill="#A57A4F" stroke={TINTA} strokeWidth={5} />
              <rect x={-60 + i * 140} y={1400} width={156} height={14} fill="#A57A4F" stroke={TINTA} strokeWidth={4} />
            </g>
          ))}
          <Arbolito x={880} y={1180} s={0.9} />
        </g>
      );
    case "bosque":
      return (
        <g>
          <Cielo momento={m} horizonte={1150} />
          <Colinas momento={m} horizonte={1150} tonos={["#4C8C4A", "#3E7A3D", "#356B34"]} />
          {Array.from({ length: 7 }).map((_, i) => <Arbolito key={i} x={ruido(i) * 1080} y={1150 + ruido(i + 5) * 300} s={0.6 + ruido(i + 9) * 0.7} tono={i % 2 ? "#2F7A3B" : "#3E8E41"} />)}
        </g>
      );
    case "desierto":
      return (
        <g>
          <Cielo momento={m} horizonte={1150} />
          <Colinas momento={m} horizonte={1150} tonos={["#F2C879", "#E8B45F", "#DDA24E"]} />
        </g>
      );
    case "nieve":
      return (
        <g>
          <Cielo momento={m} horizonte={1100} />
          <path d="M -400 1100 L 100 600 L 450 1000 L 750 700 L 1480 1100 Z" fill="#E8F1F8" stroke={TINTA} strokeWidth={8} />
          <Colinas momento={m} horizonte={1150} tonos={["#F4F8FB", "#E6EEF5", "#DCE7F0"]} />
          {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(ruido(i) * 1080 + Math.sin(fr / 20 + i) * 20)} cy={((ruido(i + 3) * 1920 + fr * (2 + ruido(i) * 2)) % 1920)} r={4 + ruido(i + 1) * 5} fill="#fff" />)}
        </g>
      );
    case "ciudad":
      return (
        <g>
          <Cielo momento={m} horizonte={1300} />
          {Array.from({ length: 8 }).map((_, i) => {
            const h = 400 + ruido(i) * 600;
            return (
              <g key={i}>
                <rect x={-80 + i * 150} y={1300 - h} width={150} height={h} fill={["#7A8BA8", "#93A3BC", "#6C7C97"][i % 3]} stroke={TINTA} strokeWidth={7} />
                {Array.from({ length: Math.floor(h / 90) }).map((_, k) => (
                  <rect key={k} x={-55 + i * 150} y={1340 - h + k * 90} width={40} height={45} fill={m === "noche" && ruido(i * 9 + k) > 0.4 ? "#FFE08A" : "#C9D6E8"} />
                ))}
              </g>
            );
          })}
          <rect x={-400} y={1300} width={1880} height={1000} fill="#5A5F6B" />
          <rect x={-400} y={1300} width={1880} height={40} fill="#B5B9C2" />
        </g>
      );
    case "espacio":
      return (
        <g>
          <rect x={-400} y={-400} width={1880} height={2720} fill="#0A0E2A" />
          {Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={ruido(i) * 1080} cy={ruido(i + 50) * 1920} r={1 + ruido(i + 2) * 3} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(fr / 20 + i))} />)}
          <circle cx={800} cy={1500} r={380} fill="#3B7DD8" stroke={TINTA} strokeWidth={10} />
          <path d="M 560 1400 Q 700 1300 820 1420 T 1080 1380 L 1080 1600 Q 900 1700 700 1640 Z" fill="#5DBB63" opacity={0.9} />
        </g>
      );
    case "cielo":
      return <Cielo momento={m} horizonte={2000} />;
    default:
      return <rect x={-400} y={-400} width={1880} height={2720} fill={spec.color ?? "#F3E3C3"} />;
  }
};
