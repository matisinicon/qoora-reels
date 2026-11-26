import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Barco, Calendario, Explosion, Submarino, Torpedo } from "./Objetos";
import { TINTA } from "./estilo";

// Objetos dibujados a mano. Todos centrados en (0,0) y de ~300 px de alto a escala 1.
type P = Record<string, any>;
const O = (d: React.ReactNode) => d;

export const BIBLIOTECA: Record<string, React.FC<P>> = {
  barco: (p) => <Barco x={0} y={0} dazzle={p.dazzle ?? 0} balanceo={p.balanceo ?? true} id={p.id ?? "o"} hundido={p.hundido ?? 0} />,
  submarino: (p) => <Submarino x={0} y={0} periscopio={p.periscopio ?? 1} />,
  torpedo: () => <Torpedo x={0} y={0} />,
  calendario: (p) => <g transform="translate(-540 -860)"><Calendario mes={p.mes ?? ""} anio={p.anio ?? ""} /></g>,
  explosion: (p) => <Explosion x={0} y={0} inicio={p.inicio ?? 0} />,
  arbol: (p) => O(
    <g>
      <rect x={-30} y={-180} width={60} height={200} fill="#7A4E2B" stroke={TINTA} strokeWidth={8} />
      <circle cx={0} cy={-280} r={150} fill={p.color ?? "#3E8E41"} stroke={TINTA} strokeWidth={9} />
      {(p.frutos ?? false) ? [[-60, -300], [50, -230], [20, -350], [-80, -210]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={24} fill={p.colorFruto ?? "#FF8C1A"} stroke={TINTA} strokeWidth={5} />) : null}
      {p.troncoBlanco ? <rect x={-30} y={-120} width={60} height={140} fill="#fff" stroke={TINTA} strokeWidth={6} /> : null}
    </g>
  ),
  casa: (p) => O(
    <g>
      <rect x={-200} y={-260} width={400} height={260} fill={p.color ?? "#F2D7A6"} stroke={TINTA} strokeWidth={9} />
      <path d="M -240 -250 L 0 -440 L 240 -250 Z" fill="#B5473A" stroke={TINTA} strokeWidth={9} strokeLinejoin="round" />
      <rect x={-50} y={-150} width={100} height={150} fill="#8B5A2B" stroke={TINTA} strokeWidth={7} />
      <rect x={-160} y={-200} width={80} height={70} fill="#9ED7F5" stroke={TINTA} strokeWidth={6} />
      <rect x={80} y={-200} width={80} height={70} fill="#9ED7F5" stroke={TINTA} strokeWidth={6} />
    </g>
  ),
  naranja: () => O(
    <g>
      <circle r={140} fill="#FF8C1A" stroke={TINTA} strokeWidth={9} />
      <ellipse cx={-45} cy={-50} rx={35} ry={22} fill="#FFC27A" opacity={0.8} />
      <path d="M 0 -140 Q 30 -200 80 -190 Q 50 -150 0 -140" fill="#4CAF50" stroke={TINTA} strokeWidth={6} />
    </g>
  ),
  hielo: () => O(
    <g>
      <rect x={-130} y={-130} width={260} height={260} rx={30} fill="#BFE8FF" stroke={TINTA} strokeWidth={9} opacity={0.95} />
      <path d="M -90 -90 L -30 -90 M -90 -90 L -90 -30" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
    </g>
  ),
  termometro: (p) => {
    const f = useCurrentFrame();
    const nivel = interpolate(f, [0, 40], [Number(p.desde ?? 0.7), Number(p.hasta ?? 0.2)], { extrapolateRight: "clamp" }) as number;
    return (
      <g>
        <rect x={-50} y={-330} width={100} height={420} rx={50} fill="#fff" stroke={TINTA} strokeWidth={9} />
        <rect x={-18} y={-290 + 330 * (1 - nivel)} width={36} height={330 * nivel} fill="#E53935" />
        <circle cx={0} cy={120} r={80} fill="#E53935" stroke={TINTA} strokeWidth={9} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={20} x2={45} y1={-280 + i * 70} y2={-280 + i * 70} stroke={TINTA} strokeWidth={6} />)}
        {p.texto ? <text x={90} y={-100} fontSize={90} fontWeight={800} fill="#fff" stroke={TINTA} strokeWidth={10} paintOrder="stroke" fontFamily="Fredoka, sans-serif">{p.texto}</text> : null}
      </g>
    );
  },
  reloj: () => {
    const f = useCurrentFrame();
    return (
      <g>
        <circle r={180} fill="#fff" stroke={TINTA} strokeWidth={12} />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-150} x2={0} y2={-125} stroke={TINTA} strokeWidth={8} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-120} stroke={TINTA} strokeWidth={12} strokeLinecap="round" transform={`rotate(${f * 6})`} />
        <line x1={0} y1={0} x2={0} y2={-80} stroke="#D63A3A" strokeWidth={14} strokeLinecap="round" transform={`rotate(${f * 0.5})`} />
      </g>
    );
  },
  bombilla: () => {
    const f = useCurrentFrame();
    return (
      <g transform={`scale(${1 + Math.sin(f / 4) * 0.05})`}>
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} y1={-190} x2={0} y2={-250} stroke="#FFD12E" strokeWidth={12} strokeLinecap="round" transform={`rotate(${i * 45 - 157} 0 -40)`} />)}
        <circle cx={0} cy={-60} r={130} fill="#FFE45C" stroke={TINTA} strokeWidth={10} />
        <rect x={-55} y={60} width={110} height={70} rx={12} fill="#9a9a9a" stroke={TINTA} strokeWidth={8} />
      </g>
    );
  },
  moneda: () => {
    const f = useCurrentFrame();
    return (
      <g transform={`scale(${Math.abs(Math.cos(f / 8)) * 0.8 + 0.2} 1)`}>
        <circle r={140} fill="#F5C531" stroke={TINTA} strokeWidth={10} />
        <circle r={100} fill="none" stroke="#C9971B" strokeWidth={10} />
        <text y={45} textAnchor="middle" fontSize={130} fontWeight={800} fill="#C9971B" fontFamily="Fredoka, sans-serif">$</text>
      </g>
    );
  },
  caja: (p) => O(
    <g>
      <rect x={-170} y={-170} width={340} height={340} fill={p.color ?? "#C99A5B"} stroke={TINTA} strokeWidth={9} />
      <path d="M -170 -60 L 170 -60" stroke={TINTA} strokeWidth={7} />
      {p.texto ? <text y={60} textAnchor="middle" fontSize={70} fontWeight={800} fill={TINTA} fontFamily="Fredoka, sans-serif">{p.texto}</text> : null}
    </g>
  ),
  vaca: () => O(
    <g>
      <ellipse cx={0} cy={0} rx={220} ry={130} fill="#fff" stroke={TINTA} strokeWidth={9} />
      <ellipse cx={-60} cy={-30} rx={60} ry={40} fill={TINTA} />
      <ellipse cx={90} cy={40} rx={50} ry={35} fill={TINTA} />
      {[-150, -60, 60, 150].map((x) => <rect key={x} x={x - 20} y={100} width={40} height={110} fill="#fff" stroke={TINTA} strokeWidth={7} />)}
      <g transform="translate(230 -90)">
        <ellipse rx={90} ry={75} fill="#fff" stroke={TINTA} strokeWidth={9} />
        <ellipse cx={30} cy={30} rx={55} ry={35} fill="#F7B6C2" stroke={TINTA} strokeWidth={6} />
        <circle cx={-25} cy={-20} r={12} fill={TINTA} />
        <path d="M -60 -60 L -90 -110 M 40 -60 L 70 -110" stroke={TINTA} strokeWidth={10} strokeLinecap="round" />
      </g>
    </g>
  ),
  coche: (p) => O(
    <g>
      <path d="M -260 0 L -260 -90 L -150 -100 L -80 -190 L 110 -190 L 180 -100 L 260 -80 L 260 0 Z" fill={p.color ?? "#3B6FB6"} stroke={TINTA} strokeWidth={9} strokeLinejoin="round" />
      <path d="M -60 -170 L 0 -170 L 0 -110 L -110 -110 Z M 30 -170 L 100 -170 L 150 -110 L 30 -110 Z" fill="#BFE8FF" stroke={TINTA} strokeWidth={6} />
      {[-150, 150].map((x) => <g key={x}><circle cx={x} cy={0} r={60} fill="#2b2b2b" stroke={TINTA} strokeWidth={8} /><circle cx={x} cy={0} r={22} fill="#bbb" /></g>)}
    </g>
  ),
  avion: () => O(
    <g>
      <path d="M -300 0 Q -300 -50 -200 -50 L 250 -40 Q 320 -20 320 0 Q 320 20 250 40 L -200 50 Q -300 50 -300 0 Z" fill="#E8E8E8" stroke={TINTA} strokeWidth={9} />
      <path d="M -40 0 L -140 180 L -60 180 L 80 0 Z M -40 0 L -140 -180 L -60 -180 L 80 0 Z" fill="#C8433A" stroke={TINTA} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -260 -40 L -300 -140 L -230 -140 L -190 -45 Z" fill="#C8433A" stroke={TINTA} strokeWidth={7} />
    </g>
  ),
  cohete: () => {
    const f = useCurrentFrame();
    return (
      <g>
        <path d={`M -40 160 Q 0 ${260 + Math.sin(f) * 30} 40 160 Z`} fill="#FFB02E" />
        <path d="M 0 -260 Q 90 -150 80 120 L -80 120 Q -90 -150 0 -260 Z" fill="#F2F2F2" stroke={TINTA} strokeWidth={9} />
        <circle cx={0} cy={-90} r={40} fill="#8FC7FF" stroke={TINTA} strokeWidth={8} />
        <path d="M -80 40 L -150 170 L -80 140 Z M 80 40 L 150 170 L 80 140 Z" fill="#D63A3A" stroke={TINTA} strokeWidth={7} />
      </g>
    );
  },
  fuego: () => {
    const f = useCurrentFrame();
    const s = 1 + Math.sin(f / 2) * 0.06;
    return (
      <g transform={`scale(${s} ${2 - s})`}>
        <path d="M 0 -260 Q 140 -100 110 30 Q 90 120 0 130 Q -90 120 -110 30 Q -140 -100 0 -260 Z" fill="#FF7A1A" stroke={TINTA} strokeWidth={9} />
        <path d="M 0 -120 Q 70 -30 55 50 Q 40 100 0 100 Q -40 100 -55 50 Q -70 -30 0 -120 Z" fill="#FFE45C" />
      </g>
    );
  },
  gota: (p) => O(<path d="M 0 -200 Q 130 -20 120 60 Q 100 170 0 170 Q -100 170 -120 60 Q -130 -20 0 -200 Z" fill={p.color ?? "#5BB8F5"} stroke={TINTA} strokeWidth={9} />),
  bandera: (p) => {
    const f = useCurrentFrame();
    return (
      <g>
        <rect x={-10} y={-400} width={20} height={420} fill="#7a7a7a" stroke={TINTA} strokeWidth={6} />
        <path d={`M 10 -390 Q 110 ${-420 + Math.sin(f / 5) * 20} 220 -390 L 220 -250 Q 110 ${-280 + Math.sin(f / 5) * 20} 10 -250 Z`} fill={p.color ?? "#D63A3A"} stroke={TINTA} strokeWidth={7} />
      </g>
    );
  },
  libro: () => O(
    <g>
      <path d="M 0 -150 Q -120 -190 -240 -150 L -240 150 Q -120 110 0 150 Q 120 110 240 150 L 240 -150 Q 120 -190 0 -150 Z" fill="#fff" stroke={TINTA} strokeWidth={9} />
      <line x1={0} y1={-150} x2={0} y2={150} stroke={TINTA} strokeWidth={7} />
      {[-90, -40, 10, 60].map((y) => <g key={y}><line x1={-200} x2={-40} y1={y} y2={y} stroke="#999" strokeWidth={6} /><line x1={40} x2={200} y1={y} y2={y} stroke="#999" strokeWidth={6} /></g>)}
    </g>
  ),
  interrogacion: () => O(<text y={120} textAnchor="middle" fontSize={380} fontWeight={800} fill="#FFD23F" stroke={TINTA} strokeWidth={16} paintOrder="stroke" fontFamily="Fredoka, sans-serif">?</text>),
  exclamacion: () => O(<text y={120} textAnchor="middle" fontSize={380} fontWeight={800} fill="#FF5A5A" stroke={TINTA} strokeWidth={16} paintOrder="stroke" fontFamily="Fredoka, sans-serif">!</text>),
  check: () => O(<g><circle r={160} fill="#4CAF50" stroke={TINTA} strokeWidth={10} /><path d="M -80 0 L -20 70 L 90 -70" stroke="#fff" strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>),
  cruz: () => O(<g><circle r={160} fill="#E53935" stroke={TINTA} strokeWidth={10} /><path d="M -70 -70 L 70 70 M 70 -70 L -70 70" stroke="#fff" strokeWidth={32} strokeLinecap="round" /></g>),
};

export const NOMBRES_OBJETOS = Object.keys(BIBLIOTECA);

// SVG escrito por la IA: se limpia de scripts, eventos y enlaces antes de dibujarlo
export function limpiarSvg(svg: string): string {
  return String(svg || "")
    .replace(/<\/?(script|foreignObject|iframe|image|use|a|style|link|meta)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|xlink:href)\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/<\/?svg[^>]*>/gi, "")
    .slice(0, 20000);
}
