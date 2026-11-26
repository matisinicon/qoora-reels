import React from "react";
import { useCurrentFrame } from "remotion";
import { TINTA, TRAZO } from "./estilo";

export type PersonajeProps = {
  x: number; // centro (px, lienzo 1080x1920)
  y: number; // pies
  escala?: number;
  piel?: string;
  ropa?: string;
  ropa2?: string;
  sombrero?: "ninguno" | "boina" | "marino" | "capitan" | "corona" | "chistera";
  bigote?: boolean;
  barba?: boolean;
  expresion?: "normal" | "feliz" | "sorpresa" | "preocupado" | "confuso" | "idea" | "enfadado" | "risa";
  hablando?: boolean;
  mira?: number; // -1 izquierda … 1 derecha
  brazo?: "abajo" | "arriba" | "senala" | "pincel" | "periscopio";
  espejo?: boolean;
  semilla?: number;
};

export const Personaje: React.FC<PersonajeProps> = ({
  x, y, escala = 1, piel = "#FFE9D2", ropa = "#3B6FB6", ropa2 = "#F2F2F2", sombrero = "ninguno",
  bigote = false, barba = false, expresion = "normal", hablando = false, mira = 0, brazo = "abajo", espejo = false, semilla = 0,
}) => {
  const f = useCurrentFrame() + semilla * 37;
  const respira = 1 + Math.sin(f / 9) * 0.012;
  const parpadeo = f % 97 < 4 ? 0.1 : 1;
  const boca = hablando ? 0.35 + Math.abs(Math.sin(f / 2.6)) * 0.65 : 0;
  const ox = mira * 14;
  const salto = expresion === "sorpresa" ? -Math.abs(Math.sin(f / 5)) * 6 : 0;

  // Ojos y cejas según expresión
  const ojo = (cx: number) => {
    if (expresion === "feliz" || expresion === "risa") {
      return <path d={`M ${cx - 22} 8 Q ${cx} -14 ${cx + 22} 8`} stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
    }
    const r = expresion === "sorpresa" ? 30 : 24;
    return (
      <g>
        <ellipse cx={cx} cy={0} rx={r * 0.85} ry={r * parpadeo} fill="#fff" stroke={TINTA} strokeWidth={6} />
        {parpadeo > 0.5 ? <circle cx={cx + ox * 0.6} cy={expresion === "preocupado" ? 6 : 2} r={expresion === "sorpresa" ? 8 : 11} fill={TINTA} /> : null}
      </g>
    );
  };
  const cejas: Record<string, [number, number]> = {
    normal: [0, 0], feliz: [-6, -6], sorpresa: [-22, -22], preocupado: [14, -14], confuso: [-18, 10], idea: [-14, -14], enfadado: [-16, 16], risa: [-8, -8],
  };
  const [ci, cd] = cejas[expresion] ?? [0, 0];
  const bocaPath = () => {
    if (hablando) return <ellipse cx={0} cy={78} rx={26} ry={6 + 22 * boca} fill="#5a1d2a" stroke={TINTA} strokeWidth={6} />;
    switch (expresion) {
      case "feliz": case "idea": return <path d="M -40 66 Q 0 106 40 66" stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
      case "risa": return <path d="M -46 62 Q 0 128 46 62 Z" fill="#5a1d2a" stroke={TINTA} strokeWidth={7} />;
      case "sorpresa": return <ellipse cx={0} cy={80} rx={18} ry={24} fill="#5a1d2a" stroke={TINTA} strokeWidth={6} />;
      case "preocupado": return <path d="M -34 88 Q 0 62 34 88" stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
      case "confuso": return <path d="M -34 80 Q -10 70 10 84 T 40 78" stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
      case "enfadado": return <path d="M -34 86 L 34 86" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
      default: return <path d="M -28 78 Q 0 92 28 78" stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
    }
  };

  const g = Math.sin(f / 4) * 25;
  const balanceo = Math.sin(f / 8) * 4;
  const dBrazo: Record<string, string> = {
    arriba: `M 70 -230 Q 150 -330 ${130 + balanceo} -420`,
    senala: "M 70 -230 Q 160 -250 230 -300",
    pincel: `M 70 -230 Q 150 -230 ${200 + g * 0.3} ${-300 + g}`,
    periscopio: "M 70 -230 Q 130 -300 90 -380",
    abajo: `M 70 -230 Q 100 -150 ${92 + balanceo} -90`,
  };
  const brazoDer = () => {
    const d = dBrazo[brazo] ?? dBrazo.abajo;
    return (
      <g>
        <path d={d} stroke={TINTA} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={d} stroke={ropa} strokeWidth={22} fill="none" strokeLinecap="round" />
        {brazo === "pincel" ? (
          <g transform={`translate(${200 + g * 0.3} ${-300 + g}) rotate(-35)`}>
            <rect x={-8} y={-110} width={16} height={110} rx={6} fill="#C58A4A" stroke={TINTA} strokeWidth={5} />
            <rect x={-16} y={-150} width={32} height={46} rx={8} fill="#2b2b2b" stroke={TINTA} strokeWidth={5} />
          </g>
        ) : null}
      </g>
    );
  };

  const gorro = () => {
    switch (sombrero) {
      case "boina": return <path d="M -150 -100 Q -40 -230 150 -120 Q 170 -95 130 -92 L -140 -86 Z" fill="#B3263B" stroke={TINTA} strokeWidth={TRAZO} />;
      case "marino": return (<g><rect x={-120} y={-150} width={240} height={50} rx={14} fill="#F4F4F4" stroke={TINTA} strokeWidth={TRAZO} /><rect x={-120} y={-112} width={240} height={14} fill="#1C2D5C" /></g>);
      case "capitan": return (<g><path d="M -150 -100 Q -150 -190 0 -195 Q 150 -190 150 -100 Z" fill="#1C2D5C" stroke={TINTA} strokeWidth={TRAZO} /><path d="M -165 -98 L 165 -98 Q 120 -70 -120 -72 Z" fill="#111" stroke={TINTA} strokeWidth={6} /><circle cx={0} cy={-140} r={18} fill="#F2C230" stroke={TINTA} strokeWidth={5} /></g>);
      case "corona": return <path d="M -110 -110 L -120 -215 L -60 -160 L 0 -235 L 60 -160 L 120 -215 L 110 -110 Z" fill="#F5C531" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />;
      case "chistera": return (<g><rect x={-90} y={-300} width={180} height={190} rx={10} fill="#222" stroke={TINTA} strokeWidth={TRAZO} /><rect x={-150} y={-122} width={300} height={28} rx={12} fill="#222" stroke={TINTA} strokeWidth={TRAZO} /></g>);
      default: return null;
    }
  };

  return (
    <g transform={`translate(${x} ${y + salto}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      {/* Sombra */}
      <ellipse cx={0} cy={6} rx={120} ry={18} fill="rgba(0,0,0,0.22)" />
      <g transform={`scale(1 ${respira})`}>
        {/* Piernas */}
        <rect x={-55} y={-95} width={38} height={95} rx={16} fill="#2D2A3A" stroke={TINTA} strokeWidth={6} />
        <rect x={17} y={-95} width={38} height={95} rx={16} fill="#2D2A3A" stroke={TINTA} strokeWidth={6} />
        {/* Brazo izquierdo */}
        <path d="M -70 -230 Q -100 -150 -92 -90" stroke={TINTA} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d="M -70 -230 Q -100 -150 -92 -90" stroke={ropa} strokeWidth={22} fill="none" strokeLinecap="round" />
        {/* Cuerpo */}
        <path d="M -85 -270 Q 0 -300 85 -270 L 95 -90 Q 0 -70 -95 -90 Z" fill={ropa} stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
        <path d="M -30 -282 L 0 -220 L 30 -282" fill={ropa2} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" />
        {/* Brazo derecho */}
        {brazoDer()}
      </g>
      {/* Cabeza */}
      <g transform={`translate(0 ${-430 + Math.sin(f / 9) * 3}) rotate(${mira * 4 + (expresion === "confuso" ? Math.sin(f / 10) * 6 : 0)})`}>
        <ellipse cx={0} cy={0} rx={165} ry={150} fill={piel} stroke={TINTA} strokeWidth={TRAZO} />
        <ellipse cx={-95} cy={50} rx={26} ry={16} fill="#F49A9A" opacity={0.55} />
        <ellipse cx={95} cy={50} rx={26} ry={16} fill="#F49A9A" opacity={0.55} />
        <g transform="translate(0 -14)">
          {ojo(-56 + ox)}
          {ojo(56 + ox)}
          <path d={`M ${-88 + ox} ${-44 + ci} L ${-28 + ox} ${-44 - ci * 0.3}`} stroke={TINTA} strokeWidth={10} strokeLinecap="round" />
          <path d={`M ${28 + ox} ${-44 - cd * 0.3} L ${88 + ox} ${-44 + cd}`} stroke={TINTA} strokeWidth={10} strokeLinecap="round" />
        </g>
        <path d={`M ${ox * 0.8 - 6} 18 Q ${ox * 0.8 + 10} 40 ${ox * 0.8 - 8} 46`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />
        {barba ? <path d="M -120 40 Q -110 150 0 160 Q 110 150 120 40 Q 60 110 0 110 Q -60 110 -120 40 Z" fill="#7A5533" stroke={TINTA} strokeWidth={6} /> : null}
        {bocaPath()}
        {bigote ? <path d="M -70 62 Q -35 30 0 52 Q 35 30 70 62 Q 40 70 0 60 Q -40 70 -70 62 Z" fill="#5B3A22" stroke={TINTA} strokeWidth={5} /> : null}
        {gorro()}
        {expresion === "idea" ? (
          <g transform={`translate(150 -190) scale(${1 + Math.sin(f / 4) * 0.06})`}>
            <circle r={46} fill="#FFE45C" stroke={TINTA} strokeWidth={7} />
            <rect x={-18} y={40} width={36} height={26} rx={6} fill="#9a9a9a" stroke={TINTA} strokeWidth={6} />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d="M 0 -62 L 0 -86" stroke="#FFD12E" strokeWidth={8} strokeLinecap="round" transform={`rotate(${-60 + i * 30})`} />
            ))}
          </g>
        ) : null}
        {expresion === "confuso" ? (
          <text x={150} y={-150} fontSize={110} fontWeight={900} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke" fontFamily="Fredoka, sans-serif" transform={`rotate(${Math.sin(f / 6) * 10} 150 -190)`}>?</text>
        ) : null}
        {expresion === "preocupado" ? <path d={`M 150 ${-40 + (f % 30)} q 12 22 0 30 q -12 -8 0 -30`} fill="#8FD3FF" stroke={TINTA} strokeWidth={4} /> : null}
      </g>
    </g>
  );
};
