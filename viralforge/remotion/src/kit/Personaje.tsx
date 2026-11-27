import React from "react";
import { useCurrentFrame } from "remotion";
import { TINTA, ruido } from "./estilo";

// VIRALFORGE · personaje v3 — stickman 2D del nicho (Directriz maestra):
// · cabeza ovalada ligeramente achatada y «dibujada a mano» (nunca un círculo perfecto), contorno de tinta grueso;
// · REGLA DEL CUERPO: la ropa cubre SOLO el torso; brazos, manos y piernas son líneas negras finas;
// · cara 2D plana: lado iluminado blanco limpio, lado contrario con degradado azul-lavanda, luz de contorno cálida;
// · expresiones de la biblioteca (calma, sorpresa, enfado con lengua rosa, alegría, cansancio…).
// Mantiene la API de versiones anteriores (x, y = pies; escala; ropa; sombrero; expresion; brazo; hablando…).
export type PersonajeProps = {
  x: number;
  y: number;
  escala?: number;
  piel?: string;
  ropa?: string;
  ropa2?: string;
  pantalon?: string; // ignorado (REGLA DEL CUERPO)
  atuendo?: string;
  torso?: string; // alias de atuendo
  pelo?: string;
  colorPelo?: string;
  sombrero?: string;
  edad?: "nino" | "adulto" | "anciano";
  cuerpo?: "delgado" | "normal" | "grueso";
  bigote?: boolean;
  barba?: boolean;
  gafas?: boolean;
  expresion?: string;
  hablando?: boolean;
  andar?: boolean;
  mira?: number;
  brazo?: string;
  objeto?: string;
  espejo?: boolean;
  luz?: "izq" | "der";
  semilla?: number;
  brilla?: string | boolean; // la cara emite luz (p. ej. en un apagón): color del brillo
};

function osc(c: string, k = 0.22) {
  const n = parseInt(c.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 - k))));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const LAVANDA = "#9C9BE0";
const RIM = "#FFD9A0";
const L = 9; // contorno de tinta grueso
const MIEMBRO = 10; // grosor de brazos y piernas (líneas finas)

// Óvalo «a mano»: pequeñas irregularidades fijas por personaje
function ovaloMano(rx: number, ry: number, semilla: number) {
  const n = 28;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (ruido(semilla * 31 + (i % n)) - 0.5) * 0.035;
    const ancho = rx * (1 + Math.sin(a) * 0.04);
    pts.push(`${(Math.cos(a) * ancho * k).toFixed(1)},${(Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return "M " + pts.join(" L ") + " Z";
}

export const Personaje: React.FC<PersonajeProps> = (props) => {
  const {
    x, y, escala = 1, ropa = "#3B6FB6", ropa2 = "#F2F2F2", pelo = "corto", colorPelo, sombrero = "ninguno", edad = "adulto", cuerpo = "normal",
    bigote = false, barba = false, gafas = false, expresion = "normal", hablando = false, andar = false, mira = 0, brazo = "abajo", objeto,
    espejo = false, luz = "izq", semilla = 0,
  } = props;
  const brillo = props.brilla ? (typeof props.brilla === "string" ? props.brilla : "#9CFFB0") : null;
  const atuendo = props.torso ?? props.atuendo ?? "camiseta";
  const f = useCurrentFrame() + semilla * 37;
  const pc = colorPelo ?? (edad === "anciano" ? "#D9D6CF" : ["#3B2416", "#5B3A22", "#1E1B1B", "#8A5A2B", "#C98B3A"][semilla % 5]);
  const nino = edad === "nino";
  const ancho = cuerpo === "grueso" ? 1.3 : cuerpo === "delgado" ? 0.85 : 1;
  const k = nino ? 0.72 : 1;
  const ladoLuz = (luz === "izq" ? -1 : 1) * (espejo ? -1 : 1);

  const respira = Math.sin(f / 11) * 3;
  const paso = andar ? Math.sin(f / 4) : 0;
  const bote = andar ? -Math.abs(Math.sin(f / 4)) * 10 : 0;
  const parpadeo = f % 97 < 4 ? 0.12 : 1;
  const boca = hablando ? 0.2 + Math.abs(Math.sin(f / 2.3)) * 0.8 : 0;
  const ox = mira * 10;

  const piernaH = 220 * k;
  const torsoH = 190 * k;
  const caderaY = -piernaH;
  const hombroY = caderaY - torsoH;
  const w = 70 * ancho;
  const cuelloY = hombroY - 12;
  const RX = 122 * (nino ? 1.05 : 1), RY = 104 * (nino ? 1.05 : 1);
  const cabezaY = cuelloY - RY * 0.92;
  const idg = `lav${semilla}${ladoLuz > 0 ? "d" : "i"}`;

  const pierna = (lado: number) => {
    const fase = lado * paso;
    const hx = lado * 22 * ancho, pieX = hx + fase * 40 + lado * 6;
    const rodX = hx + fase * 22, rodY = caderaY * 0.48 - Math.max(0, -fase) * 18;
    return (
      <g key={"p" + lado}>
        <path d={`M ${hx} ${caderaY} L ${rodX} ${rodY} L ${pieX} -6`} stroke={TINTA} strokeWidth={MIEMBRO} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${pieX - 4} -4 l 30 0`} stroke={TINTA} strokeWidth={MIEMBRO + 4} strokeLinecap="round" />
      </g>
    );
  };

  const brazoPts = (lado: number): { d: string; mano: [number, number] } => {
    const sx = lado * (w - 8), sy = hombroY + 22;
    const bal = Math.sin(f / 9 + lado) * 3 + (andar ? -lado * paso * 16 : 0);
    const pose = lado > 0 ? brazo : brazo === "dos_arriba" ? "arriba" : brazo === "jarras" ? "jarras" : "abajo";
    switch (pose) {
      case "arriba": case "dos_arriba": return { d: `M ${sx} ${sy} L ${sx + lado * 70} ${sy - 80} L ${sx + lado * 95 + bal} ${sy - 175}`, mano: [sx + lado * 95 + bal, sy - 178] };
      case "senala": return { d: `M ${sx} ${sy} L ${sx + lado * 90} ${sy - 10} L ${sx + lado * 180} ${sy - 40}`, mano: [sx + lado * 184, sy - 42] };
      case "saludo": { const a = Math.sin(f / 3) * 22; return { d: `M ${sx} ${sy} L ${sx + lado * 70} ${sy - 30} L ${sx + lado * 80 + a} ${sy - 150}`, mano: [sx + lado * 80 + a, sy - 154] }; }
      case "jarras": return { d: `M ${sx} ${sy} L ${sx + lado * 70} ${sy + 70} L ${lado * (w - 4)} ${caderaY + 10}`, mano: [lado * (w - 4), caderaY + 10] };
      case "pensar": return { d: `M ${sx} ${sy} L ${sx + lado * 60} ${sy + 80} L ${lado * 24} ${cabezaY + RY * 0.8}`, mano: [lado * 24, cabezaY + RY * 0.82] };
      case "sostiene": return { d: `M ${sx} ${sy} L ${sx + lado * 50} ${sy + 90} L ${sx + lado * 115} ${sy + 60}`, mano: [sx + lado * 118, sy + 58] };
      case "pincel": { const g = Math.sin(f / 4) * 25; return { d: `M ${sx} ${sy} L ${sx + lado * 80} ${sy} L ${sx + lado * 140 + g * 0.3} ${sy - 70 + g}`, mano: [sx + lado * 142 + g * 0.3, sy - 72 + g] }; }
      case "periscopio": return { d: `M ${sx} ${sy} L ${sx + lado * 60} ${sy - 60} L ${sx + lado * 20} ${sy - 140}`, mano: [sx + lado * 20, sy - 144] };
      default: return { d: `M ${sx} ${sy} L ${sx + lado * 34 + bal * 0.5} ${sy + 90} L ${sx + lado * 22 + bal} ${sy + 170 * k}`, mano: [sx + lado * 22 + bal, sy + 172 * k] };
    }
  };
  const brazoView = (lado: number) => {
    const { d, mano } = brazoPts(lado);
    return (
      <g key={"b" + lado}>
        <path d={d} stroke={TINTA} strokeWidth={MIEMBRO} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={mano[0]} cy={mano[1]} r={11} fill={TINTA} />
        {lado > 0 && brazo === "pincel" ? (
          <g transform={`translate(${mano[0]} ${mano[1]}) rotate(-35)`}>
            <rect x={-7} y={-100} width={14} height={100} rx={5} fill="#C58A4A" stroke={TINTA} strokeWidth={4} />
            <rect x={-13} y={-140} width={26} height={44} rx={8} fill="#2b2b2b" stroke={TINTA} strokeWidth={4} />
          </g>
        ) : null}
        {lado > 0 && brazo === "sostiene" && objeto ? <text x={mano[0] + 6} y={mano[1] - 14} fontSize={100} textAnchor="middle" transform={espejo ? `translate(${2 * (mano[0] + 6)} 0) scale(-1 1)` : undefined}>{objeto}</text> : null}
      </g>
    );
  };

  const torso = () => {
    const top = hombroY, bot = caderaY + 6;
    const ens = atuendo === "vestido" || atuendo === "tunica" || atuendo === "abrigo" || atuendo === "bata" ? 14 : 4;
    const d = `M ${-w} ${top + 30} Q ${-w} ${top} ${-w + 34} ${top - 4} L ${w - 34} ${top - 4} Q ${w} ${top} ${w} ${top + 30} L ${w + ens} ${bot} Q 0 ${bot + 10} ${-w - ens} ${bot} Z`;
    const ropaO = osc(ropa, 0.2);
    const s = -ladoLuz;
    return (
      <g>
        <path d={d} fill={ropa} stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />
        <path d={`M ${s * w * 0.15} ${top - 2} L ${s * (w - 34)} ${top - 4} Q ${s * w} ${top} ${s * w} ${top + 30} L ${s * (w + ens)} ${bot} Q ${s * w * 0.4} ${bot + 8} ${s * w * 0.2} ${bot + 6} Z`} fill={LAVANDA} opacity={0.38} />
        <path d={`M ${ladoLuz * (w - 8)} ${top + 26} L ${ladoLuz * (w + ens - 8)} ${bot - 8}`} stroke={RIM} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        {atuendo === "camisa" || atuendo === "traje" || atuendo === "uniforme" ? (
          <g>
            <path d={`M -30 ${top - 4} L 0 ${top + 56} L 30 ${top - 4}`} fill={ropa2} stroke={TINTA} strokeWidth={5} strokeLinejoin="round" />
            {atuendo === "traje" ? <path d={`M -9 ${top + 6} L 0 ${top + 96} L 9 ${top + 6} L 0 ${top} Z`} fill="#B3263B" stroke={TINTA} strokeWidth={4} /> : null}
            {[0, 1, 2].map((q) => <circle key={q} cx={0} cy={top + 80 + q * 30} r={5} fill={atuendo === "uniforme" ? "#E0B341" : ropaO} />)}
          </g>
        ) : null}
        {atuendo === "camiseta" ? <path d={`M -30 ${top - 4} Q 0 ${top + 28} 30 ${top - 4}`} fill="none" stroke={TINTA} strokeWidth={5} /> : null}
        {atuendo === "mono" ? <g><path d={`M ${-w * 0.55} ${top - 2} L ${-w * 0.45} ${top + 70} M ${w * 0.55} ${top - 2} L ${w * 0.45} ${top + 70}`} stroke={ropaO} strokeWidth={12} /><rect x={-38} y={top + 66} width={76} height={56} rx={8} fill={ropaO} opacity={0.6} /></g> : null}
        {atuendo === "tunica" || atuendo === "abrigo" || atuendo === "bata" ? <rect x={-w - 4} y={top + torsoH * 0.55} width={2 * w + 8} height={18} fill={atuendo === "bata" ? osc(ropa, 0.1) : "#6B4226"} stroke={TINTA} strokeWidth={4} /> : null}
        {atuendo === "delantal" ? <path d={`M ${-w * 0.6} ${top + 40} L ${w * 0.6} ${top + 40} L ${w * 0.7} ${bot} L ${-w * 0.7} ${bot} Z`} fill={ropa2} stroke={TINTA} strokeWidth={5} /> : null}
        {atuendo === "vestido" ? <path d={`M ${-w} ${top + torsoH * 0.45} Q 0 ${top + torsoH * 0.55} ${w} ${top + torsoH * 0.45}`} stroke={ropa2} strokeWidth={10} fill="none" /> : null}
        {atuendo === "armadura" ? <g>{[0, 1, 2].map((q) => <path key={q} d={`M ${-w + 10} ${top + 50 + q * 44} Q 0 ${top + 66 + q * 44} ${w - 10} ${top + 50 + q * 44}`} stroke={ropaO} strokeWidth={7} fill="none" />)}<circle cx={ladoLuz * 20} cy={top + 50} r={8} fill="#FFFFFF" opacity={0.8} /></g> : null}
      </g>
    );
  };

  const ojo = (cx: number) => {
    const e = expresion;
    if (e === "feliz" || e === "risa" || e === "alegria") return <path d={`M ${cx - 16} 6 Q ${cx} -12 ${cx + 16} 6`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
    if (e === "cansado" || e === "sueno") return <path d={`M ${cx - 18} -2 Q ${cx} 14 ${cx + 18} -2`} stroke={TINTA} strokeWidth={9} fill="none" strokeLinecap="round" />;
    if (e === "calma" || e === "aburrido" || e === "picaro") {
      return <g><path d={`M ${cx - 16} -2 Q ${cx} 12 ${cx + 16} -2 Z`} fill="#FFFFFF" stroke={TINTA} strokeWidth={4} /><path d={`M ${cx - 19} -3 L ${cx + 19} -3`} stroke={TINTA} strokeWidth={5} strokeLinecap="round" /><circle cx={cx + ox * 0.5} cy={3} r={4} fill={TINTA} /></g>;
    }
    if (e === "sorpresa" || e === "miedo") return <g><circle cx={cx} cy={0} r={20} fill="#FFFFFF" stroke={TINTA} strokeWidth={5} /><circle cx={cx + ox * 0.4} cy={1} r={5} fill={TINTA} /></g>;
    return (
      <g transform={`translate(0 0) scale(1 ${parpadeo})`}>
        <ellipse cx={cx + ox * 0.5} cy={0} rx={10} ry={13} fill={TINTA} />
        <circle cx={cx + ox * 0.5 - 3} cy={-4} r={3.5} fill="#FFFFFF" />
      </g>
    );
  };
  const cejas: Record<string, [number, number, number]> = {
    normal: [0, 0, 0], feliz: [-4, -4, -2], alegria: [-4, -4, -2], sorpresa: [-6, -6, -16], miedo: [10, -10, -12], preocupado: [12, -12, -4], confuso: [-14, 8, -4],
    idea: [-6, -6, -10], enfadado: [-16, 16, 4], risa: [-4, -4, -4], triste: [14, -14, -2], picaro: [-12, 6, 0], calma: [0, 0, 2], aburrido: [0, 0, 2], cansado: [6, -6, 4],
  };
  const [ci, cd, ch] = cejas[expresion] ?? [0, 0, 0];
  const grosorCeja = expresion === "enfadado" ? 11 : expresion === "calma" || expresion === "aburrido" ? 4 : 7;
  const bocaView = () => {
    const yb = 50, mx = ox * 0.5;
    if (hablando) return <g><ellipse cx={mx} cy={yb} rx={16 + boca * 4} ry={4 + 16 * boca} fill="#5A1A26" stroke={TINTA} strokeWidth={5} /><ellipse cx={mx} cy={yb + 7 * boca} rx={9} ry={4 * boca} fill="#F48FA6" /></g>;
    switch (expresion) {
      case "feliz": case "alegria": case "idea": return <path d={`M ${mx - 18} ${yb - 4} Q ${mx} ${yb + 14} ${mx + 18} ${yb - 4}`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "picaro": return <path d={`M ${mx - 18} ${yb} Q ${mx + 4} ${yb + 10} ${mx + 22} ${yb - 8}`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "risa": return <g><path d={`M ${mx - 30} ${yb - 6} Q ${mx} ${yb + 44} ${mx + 30} ${yb - 6} Z`} fill="#5A1A26" stroke={TINTA} strokeWidth={6} /><ellipse cx={mx} cy={yb + 18} rx={12} ry={6} fill="#F48FA6" /></g>;
      case "sorpresa": case "miedo": return <ellipse cx={mx} cy={yb + 4} rx={10} ry={13} fill="#5A1A26" stroke={TINTA} strokeWidth={5} />;
      case "enfadado": return <g><path d={`M ${mx - 26} ${yb + 10} Q ${mx} ${yb - 14} ${mx + 26} ${yb + 10} Q ${mx} ${yb + 26} ${mx - 26} ${yb + 10} Z`} fill="#5A1A26" stroke={TINTA} strokeWidth={6} /><ellipse cx={mx} cy={yb + 14} rx={11} ry={6} fill="#F48FA6" /></g>;
      case "preocupado": case "triste": return <path d={`M ${mx - 20} ${yb + 10} Q ${mx} ${yb - 6} ${mx + 20} ${yb + 10}`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "confuso": return <path d={`M ${mx - 22} ${yb + 4} Q ${mx - 6} ${yb - 6} ${mx + 6} ${yb + 6} T ${mx + 26} ${yb}`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "calma": case "aburrido": case "cansado": return <path d={`M ${mx - 12} ${yb + 2} L ${mx + 12} ${yb + 2}`} stroke={TINTA} strokeWidth={5} strokeLinecap="round" />;
      default: return <path d={`M ${mx - 14} ${yb} Q ${mx} ${yb + 8} ${mx + 14} ${yb}`} stroke={TINTA} strokeWidth={6} fill="none" strokeLinecap="round" />;
    }
  };

  const R = RX;
  const peloDetras = () => {
    if (pelo === "largo" || pelo === "melena") return <path d={`M ${-R * 0.98} ${-RY * 0.2} Q ${-R * 1.15} ${RY * 1.3} ${-R * 0.5} ${RY * 1.35} L ${R * 0.5} ${RY * 1.35} Q ${R * 1.15} ${RY * 1.3} ${R * 0.98} ${-RY * 0.2} Z`} fill={osc(pc, 0.1)} stroke={TINTA} strokeWidth={L - 2} />;
    if (pelo === "coleta") return <path d={`M ${R * 0.7} ${-RY * 0.5} Q ${R * 1.6} ${-RY * 0.2} ${R * 1.3} ${RY * 0.9} Q ${R * 1.1} ${RY * 0.3} ${R * 0.8} ${-RY * 0.1} Z`} fill={pc} stroke={TINTA} strokeWidth={L - 2} />;
    if (pelo === "mono") return <ellipse cx={0} cy={-RY * 1.1} rx={R * 0.32} ry={RY * 0.3} fill={pc} stroke={TINTA} strokeWidth={L - 2} />;
    return null;
  };
  const cubre = sombrero !== "ninguno" && sombrero !== "capucha";
  const peloDelante = () => {
    switch (pelo) {
      case "calvo": case "ninguno": return edad === "anciano" ? <g><path d={`M ${-R * 0.98} ${-RY * 0.05} Q ${-R * 1.06} ${-RY * 0.5} ${-R * 0.75} ${-RY * 0.6}`} stroke={pc} strokeWidth={20} fill="none" strokeLinecap="round" /><path d={`M ${R * 0.98} ${-RY * 0.05} Q ${R * 1.06} ${-RY * 0.5} ${R * 0.75} ${-RY * 0.6}`} stroke={pc} strokeWidth={20} fill="none" strokeLinecap="round" /></g> : null;
      case "rizado": return cubre ? null : <g>{Array.from({ length: 9 }).map((_, q) => { const a = Math.PI * (1.05 + q * 0.11); return <circle key={q} cx={Math.cos(a) * R * 0.9} cy={Math.sin(a) * RY * 0.92 - 4} r={R * 0.26} fill={q % 2 ? pc : osc(pc, 0.12)} stroke={TINTA} strokeWidth={L - 3} />; })}</g>;
      case "tupe": return cubre ? null : <path d={`M ${-R * 0.92} ${-RY * 0.25} Q ${-R} ${-RY * 1.15} 0 ${-RY * 1.25} Q ${R * 1.1} ${-RY * 1.4} ${R * 0.95} ${-RY * 0.3} Q ${R * 0.5} ${-RY * 0.8} ${-R * 0.2} ${-RY * 0.65} Q ${-R * 0.6} ${-RY * 0.6} ${-R * 0.92} ${-RY * 0.25} Z`} fill={pc} stroke={TINTA} strokeWidth={L - 2} />;
      default: return cubre ? null : (
        <path d={`M ${-R * 0.97} ${-RY * 0.12} Q ${-R * 1.02} ${-RY * 1.08} 0 ${-RY * 1.1} Q ${R * 1.02} ${-RY * 1.08} ${R * 0.97} ${-RY * 0.12} Q ${R * 0.78} ${-RY * 0.6} ${R * 0.2} ${-RY * 0.66} Q ${-R * 0.1} ${-RY * 0.44} ${-R * 0.35} ${-RY * 0.66} Q ${-R * 0.78} ${-RY * 0.6} ${-R * 0.97} ${-RY * 0.12} Z`} fill={pc} stroke={TINTA} strokeWidth={L - 2} strokeLinejoin="round" />
      );
    }
  };
  const gorro = () => {
    const top = -RY * 0.62;
    switch (sombrero) {
      case "boina": return <path d={`M ${-R * 1.08} ${top} Q ${-R * 0.3} ${-RY * 1.6} ${R * 1.08} ${-RY * 0.82} Q ${R * 1.2} ${top} ${R * 0.92} ${top} Z`} fill="#B3263B" stroke={TINTA} strokeWidth={L - 1} />;
      case "marino": return <g><rect x={-R * 0.82} y={-RY * 1.15} width={R * 1.64} height={RY * 0.42} rx={14} fill="#F4F4F4" stroke={TINTA} strokeWidth={L - 1} /><rect x={-R * 0.82} y={-RY * 0.82} width={R * 1.64} height={11} fill="#1C2D5C" /></g>;
      case "capitan": return <g><path d={`M ${-R * 1.05} ${top} Q ${-R * 1.05} ${-RY * 1.45} 0 ${-RY * 1.5} Q ${R * 1.05} ${-RY * 1.45} ${R * 1.05} ${top} Z`} fill="#1C2D5C" stroke={TINTA} strokeWidth={L - 1} /><path d={`M ${-R * 1.15} ${top} L ${R * 1.15} ${top} Q ${R * 0.9} ${top + 20} ${-R * 0.9} ${top + 18} Z`} fill="#111" stroke={TINTA} strokeWidth={5} /><circle cx={0} cy={-RY * 1.08} r={15} fill="#F2C230" stroke={TINTA} strokeWidth={4} /></g>;
      case "corona": return <g><path d={`M ${-R * 0.78} ${-RY * 0.8} L ${-R * 0.88} ${-RY * 1.65} L ${-R * 0.44} ${-RY * 1.25} L 0 ${-RY * 1.8} L ${R * 0.44} ${-RY * 1.25} L ${R * 0.88} ${-RY * 1.65} L ${R * 0.78} ${-RY * 0.8} Z`} fill="#F5C531" stroke={TINTA} strokeWidth={L - 1} strokeLinejoin="round" /><circle cx={ladoLuz * R * 0.35} cy={-RY * 1.1} r={7} fill="#FFFFFF" /></g>;
      case "chistera": return <g><rect x={-R * 0.62} y={-RY * 2.2} width={R * 1.24} height={RY * 1.45} rx={8} fill="#222" stroke={TINTA} strokeWidth={L - 1} /><rect x={-R * 0.62} y={-RY * 1.02} width={R * 1.24} height={20} fill="#7A1E2C" /><rect x={-R * 1.05} y={-RY * 0.86} width={R * 2.1} height={24} rx={12} fill="#222" stroke={TINTA} strokeWidth={L - 1} /></g>;
      case "casco": return <g><path d={`M ${-R * 1.06} ${-RY * 0.35} Q ${-R * 1.06} ${-RY * 1.5} 0 ${-RY * 1.5} Q ${R * 1.06} ${-RY * 1.5} ${R * 1.06} ${-RY * 0.35} Z`} fill="#F2C230" stroke={TINTA} strokeWidth={L - 1} /><rect x={-R * 1.2} y={-RY * 0.42} width={R * 2.4} height={20} rx={10} fill="#E0AE20" stroke={TINTA} strokeWidth={5} /></g>;
      case "gorra": return <g><path d={`M ${-R * 0.98} ${-RY * 0.5} Q ${-R} ${-RY * 1.32} 0 ${-RY * 1.32} Q ${R} ${-RY * 1.32} ${R * 0.98} ${-RY * 0.5} Z`} fill={ropa} stroke={TINTA} strokeWidth={L - 1} /><path d={`M ${R * 0.4} ${-RY * 0.55} Q ${R * 1.4} ${-RY * 0.62} ${R * 1.5} ${-RY * 0.38} L ${R * 0.6} ${-RY * 0.35} Z`} fill={osc(ropa)} stroke={TINTA} strokeWidth={L - 2} /></g>;
      case "paja": return <g><ellipse cx={0} cy={-RY * 0.72} rx={R * 1.55} ry={RY * 0.26} fill="#E8C56A" stroke={TINTA} strokeWidth={L - 1} /><path d={`M ${-R * 0.72} ${-RY * 0.75} Q ${-R * 0.68} ${-RY * 1.45} 0 ${-RY * 1.45} Q ${R * 0.68} ${-RY * 1.45} ${R * 0.72} ${-RY * 0.75} Z`} fill="#E8C56A" stroke={TINTA} strokeWidth={L - 1} /><rect x={-R * 0.72} y={-RY * 0.98} width={R * 1.44} height={16} fill="#B3263B" /></g>;
      case "vaquero": return <g><path d={`M ${-R * 1.65} ${-RY * 0.7} Q 0 ${-RY * 0.35} ${R * 1.65} ${-RY * 0.7} Q 0 ${-RY * 0.55} ${-R * 1.65} ${-RY * 0.7} Z`} fill="#8A5A2B" stroke={TINTA} strokeWidth={L - 1} /><path d={`M ${-R * 0.72} ${-RY * 0.68} Q ${-R * 0.82} ${-RY * 1.55} ${-R * 0.2} ${-RY * 1.42} Q 0 ${-RY * 1.28} ${R * 0.2} ${-RY * 1.42} Q ${R * 0.82} ${-RY * 1.55} ${R * 0.72} ${-RY * 0.68} Z`} fill="#9C6A34" stroke={TINTA} strokeWidth={L - 1} /></g>;
      case "cocinero": return <g><rect x={-R * 0.66} y={-RY * 1.2} width={R * 1.32} height={RY * 0.52} fill="#FFFFFF" stroke={TINTA} strokeWidth={L - 1} />{[-0.42, 0, 0.42].map((q) => <circle key={q} cx={R * q} cy={-RY * 1.45} r={R * 0.38} fill="#FFFFFF" stroke={TINTA} strokeWidth={L - 1} />)}</g>;
      case "capucha": return <path d={`M ${-R * 1.22} ${RY * 0.6} Q ${-R * 1.32} ${-RY * 1.5} 0 ${-RY * 1.4} Q ${R * 1.32} ${-RY * 1.5} ${R * 1.22} ${RY * 0.6} Q ${R * 1.02} ${-RY * 0.9} 0 ${-RY * 0.96} Q ${-R * 1.02} ${-RY * 0.9} ${-R * 1.22} ${RY * 0.6} Z`} fill={ropa} stroke={TINTA} strokeWidth={L - 1} />;
      default: return null;
    }
  };

  const cabeza = ovaloMano(RX, RY, semilla + 3);
  return (
    <g transform={`translate(${x} ${y + bote}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      <defs>
        <linearGradient id={idg} x1={ladoLuz > 0 ? "1" : "0"} y1="0.3" x2={ladoLuz > 0 ? "0" : "1"} y2="0.6">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B4B2EA" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={4} rx={90 * ancho} ry={16} fill="rgba(40,30,90,0.25)" />
      {pierna(-1)}
      {pierna(1)}
      <g transform={`translate(0 ${respira * 0.4})`}>
        {brazoView(-1)}
        {torso()}
        <path d={`M 0 ${hombroY} L 0 ${cuelloY - 4}`} stroke={TINTA} strokeWidth={MIEMBRO} strokeLinecap="round" />
        {brazo !== "pensar" ? brazoView(1) : null}
      </g>
      <g transform={`translate(0 ${cabezaY + respira}) rotate(${mira * 4 + (expresion === "confuso" ? Math.sin(f / 10) * 5 : 0)})`}>
        {peloDetras()}
        {brillo ? (
          <g>
            <defs>
              <radialGradient id={idg + "b"}><stop offset="0" stopColor={brillo} stopOpacity={0.85} /><stop offset="0.45" stopColor={brillo} stopOpacity={0.35} /><stop offset="1" stopColor={brillo} stopOpacity={0} /></radialGradient>
            </defs>
            <circle cx={0} cy={0} r={RX * (2.6 + Math.sin(f / 6) * 0.15)} fill={`url(#${idg}b)`} />
          </g>
        ) : null}
        <path d={cabeza} fill={brillo ? brillo : `url(#${idg})`} stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />
        {brillo ? <path d={cabeza} fill="#FFFFFF" opacity={0.45 + Math.sin(f / 6) * 0.1} transform="scale(0.72)" /> : null}
        <path d={`M ${ladoLuz * RX * 0.55} ${-RY * 0.72} Q ${ladoLuz * RX * 0.98} ${-RY * 0.2} ${ladoLuz * RX * 0.7} ${RY * 0.62}`} stroke={RIM} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
        {expresion !== "enfadado" ? <><ellipse cx={-RX * 0.58} cy={RY * 0.34} rx={18} ry={10} fill="#F7A6B5" opacity={0.55} /><ellipse cx={RX * 0.58} cy={RY * 0.34} rx={18} ry={10} fill="#F7A6B5" opacity={0.55} /></> : null}
        {edad === "anciano" ? <path d={`M ${-RX * 0.35} ${-RY * 0.5} q ${RX * 0.35} -8 ${RX * 0.7} 0`} stroke="#B8B6D9" strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
        <g transform="translate(0 -4)">
          {ojo(-40 + ox)}
          {ojo(38 + ox)}
          <path d={`M ${-62 + ox} ${-34 + ci + ch} L ${-22 + ox} ${-34 - ci * 0.4 + ch}`} stroke={edad === "anciano" ? "#8E8BA8" : TINTA} strokeWidth={grosorCeja} strokeLinecap="round" />
          <path d={`M ${20 + ox} ${-36 - cd * 0.4 + ch} L ${60 + ox} ${-35 + cd + ch}`} stroke={edad === "anciano" ? "#8E8BA8" : TINTA} strokeWidth={grosorCeja} strokeLinecap="round" />
        </g>
        {barba ? <path d={`M ${-RX * 0.9} ${RY * 0.15} Q ${-RX * 0.85} ${RY * 1.2} 0 ${RY * 1.25} Q ${RX * 0.85} ${RY * 1.2} ${RX * 0.9} ${RY * 0.15} Q ${RX * 0.5} ${RY * 0.8} 0 ${RY * 0.78} Q ${-RX * 0.5} ${RY * 0.8} ${-RX * 0.9} ${RY * 0.15} Z`} fill={pc} stroke={TINTA} strokeWidth={L - 3} /> : null}
        {bocaView()}
        {bigote ? <path d={`M -50 40 Q -24 18 0 34 Q 24 18 50 40 Q 28 46 0 40 Q -28 46 -50 40 Z`} fill={pc} stroke={TINTA} strokeWidth={4} /> : null}
        {gafas ? <g fill="rgba(200,230,255,0.25)" stroke={TINTA} strokeWidth={6}><circle cx={-40 + ox} cy={-4} r={26} /><circle cx={38 + ox} cy={-4} r={26} /><path d={`M ${-14 + ox} -6 h 26`} /></g> : null}
        {peloDelante()}
        {gorro()}
        {expresion === "idea" ? (
          <g transform={`translate(${RX * 1.15} ${-RY * 1.4}) scale(${1 + Math.sin(f / 4) * 0.06})`}>
            <circle r={38} fill="#FFE45C" stroke={TINTA} strokeWidth={6} />
            <rect x={-14} y={32} width={28} height={22} rx={6} fill="#9a9a9a" stroke={TINTA} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((q) => <path key={q} d="M 0 -52 L 0 -72" stroke="#FFD12E" strokeWidth={7} strokeLinecap="round" transform={`rotate(${-60 + q * 30})`} />)}
          </g>
        ) : null}
        {expresion === "confuso" ? <text x={RX * 1.05} y={-RY * 1.05} fontSize={90} fontWeight={900} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke" fontFamily="Fredoka, sans-serif">?</text> : null}
        {expresion === "preocupado" || expresion === "miedo" ? <path d={`M ${RX * 0.98} ${-RY * 0.3 + (f % 30)} q 10 18 0 26 q -10 -8 0 -26`} fill="#8FD3FF" stroke={TINTA} strokeWidth={4} /> : null}
        {expresion === "enfadado" ? <g transform={`translate(${RX * 0.85} ${-RY * 1.0})`} stroke="#E8463A" strokeWidth={8} strokeLinecap="round"><path d="M -16 -16 l 10 10 M 16 -16 l -10 10 M -16 16 l 10 -10 M 16 16 l -10 -10" /></g> : null}
      </g>
      {brazo === "pensar" ? <g transform={`translate(0 ${respira * 0.4})`}>{brazoView(1)}</g> : null}
    </g>
  );
};
