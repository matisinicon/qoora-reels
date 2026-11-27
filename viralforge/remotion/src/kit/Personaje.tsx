import React from "react";
import { useCurrentFrame } from "remotion";
import { TINTA } from "./estilo";

// VIRALFORGE · personaje v2: dibujo con volumen (sombras y brillos), pelo, ropa por época, edades y cuerpos.
// Mantiene la API de la v1 (x, y = pies; escala; piel; ropa; sombrero; expresion; brazo; hablando…).
export type PersonajeProps = {
  x: number;
  y: number;
  escala?: number;
  piel?: string;
  ropa?: string; // color principal de la ropa
  ropa2?: string; // color secundario (camisa, cuello, detalles)
  pantalon?: string;
  atuendo?: "camiseta" | "camisa" | "traje" | "mono" | "tunica" | "vestido" | "bata" | "uniforme" | "abrigo" | "delantal" | "armadura";
  pelo?: "corto" | "largo" | "rizado" | "calvo" | "coleta" | "mono" | "tupe" | "melena" | "ninguno";
  colorPelo?: string;
  sombrero?: "ninguno" | "boina" | "marino" | "capitan" | "corona" | "chistera" | "casco" | "gorra" | "paja" | "capucha" | "cocinero" | "vaquero";
  edad?: "nino" | "adulto" | "anciano";
  cuerpo?: "delgado" | "normal" | "grueso";
  bigote?: boolean;
  barba?: boolean;
  gafas?: boolean;
  expresion?: "normal" | "feliz" | "sorpresa" | "preocupado" | "confuso" | "idea" | "enfadado" | "risa" | "triste" | "picaro";
  hablando?: boolean;
  andar?: boolean;
  mira?: number; // -1 izquierda … 1 derecha
  brazo?: "abajo" | "arriba" | "senala" | "pincel" | "periscopio" | "jarras" | "pensar" | "saludo" | "dos_arriba" | "sostiene";
  objeto?: string; // lo que sostiene en la mano (emoji o texto corto) cuando brazo = sostiene
  espejo?: boolean;
  semilla?: number;
};

function osc(c: string, k = 0.22) {
  const n = parseInt(c.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 - k))));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function cla(c: string, k = 0.25) {
  const n = parseInt(c.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const f = (v: number) => Math.round(v + (255 - v) * k);
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const L = 6; // grosor de contorno (más fino que la v1: aspecto más limpio)

export const Personaje: React.FC<PersonajeProps> = (props) => {
  const {
    x, y, escala = 1, piel = "#F6CFA8", ropa = "#3B6FB6", ropa2 = "#F2F2F2", pantalon = "#3A3A4A", atuendo = "camiseta",
    pelo = "corto", colorPelo, sombrero = "ninguno", edad = "adulto", cuerpo = "normal", bigote = false, barba = false, gafas = false,
    expresion = "normal", hablando = false, andar = false, mira = 0, brazo = "abajo", objeto, espejo = false, semilla = 0,
  } = props;
  const f = useCurrentFrame() + semilla * 37;
  const pc = colorPelo ?? (edad === "anciano" ? "#D9D6CF" : ["#3B2416", "#5B3A22", "#1E1B1B", "#8A5A2B", "#C98B3A"][semilla % 5]);
  const nino = edad === "nino";
  const ancho = cuerpo === "grueso" ? 1.25 : cuerpo === "delgado" ? 0.88 : 1;
  const altoCuerpo = nino ? 0.72 : 1;
  const cab = nino ? 1.08 : 1; // cabeza relativamente más grande en niños

  // Animación
  const respira = Math.sin(f / 10) * 3;
  const paso = andar ? Math.sin(f / 4) : 0;
  const bote = andar ? -Math.abs(Math.sin(f / 4)) * 14 : 0;
  const parpadeo = f % 103 < 4 ? 0.1 : 1;
  const boca = hablando ? 0.25 + Math.abs(Math.sin(f / 2.4)) * 0.75 : 0;
  const ox = mira * 12;
  const salto = expresion === "sorpresa" ? -Math.abs(Math.sin(f / 5)) * 8 : 0;

  // Medidas (pies en y = 0)
  const piernaH = 150 * altoCuerpo;
  const torsoH = 210 * altoCuerpo;
  const hombroY = -piernaH - torsoH;
  const w = 92 * ancho; // medio ancho de hombros
  const cuelloY = hombroY - 6;
  const cabezaY = cuelloY - 128 * cab;
  const R = 128 * cab; // radio cabeza

  const pielO = osc(piel, 0.16), ropaO = osc(ropa), ropaC = cla(ropa, 0.2), panO = osc(pantalon);
  const largo = atuendo === "vestido" || atuendo === "tunica" || atuendo === "bata" || atuendo === "abrigo";

  // ── Piernas y zapatos
  const pierna = (lado: number) => {
    const fase = lado * paso;
    const px = lado * 34 * ancho;
    const pieX = px + fase * 34;
    const rodillaY = -piernaH * 0.5 - Math.max(0, -fase) * 18;
    return (
      <g key={lado}>
        <path d={`M ${px} ${-piernaH - 6} Q ${px + fase * 14} ${rodillaY} ${pieX} -16`} stroke={TINTA} strokeWidth={44 * Math.min(ancho, 1.1) + L} fill="none" strokeLinecap="round" />
        <path d={`M ${px} ${-piernaH - 6} Q ${px + fase * 14} ${rodillaY} ${pieX} -16`} stroke={lado < 0 ? panO : pantalon} strokeWidth={44 * Math.min(ancho, 1.1)} fill="none" strokeLinecap="round" />
        <path d={`M ${pieX - 26} -2 Q ${pieX - 26} -34 ${pieX + 6} -34 Q ${pieX + 44} -30 ${pieX + 44} -2 Z`} fill="#3A2A22" stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />
        <path d={`M ${pieX - 18} -26 Q ${pieX} -32 ${pieX + 16} -28`} stroke="#6A5548" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  };

  // ── Torso según atuendo
  const torso = () => {
    const top = hombroY, bot = largo ? -piernaH * (atuendo === "vestido" ? 0.25 : 0.55) : -piernaH + 10;
    const falda = largo ? 26 * ancho : 0;
    const d = `M ${-w} ${top + 26} Q ${-w} ${top} ${-w + 30} ${top - 4} L ${w - 30} ${top - 4} Q ${w} ${top} ${w} ${top + 26} L ${w + 6 + falda} ${bot} Q 0 ${bot + 18} ${-w - 6 - falda} ${bot} Z`;
    return (
      <g>
        <path d={d} fill={ropa} stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />
        {/* sombra lateral y brillo */}
        <path d={`M ${w * 0.35} ${top} L ${w - 30} ${top - 4} Q ${w} ${top} ${w} ${top + 26} L ${w + 6 + falda} ${bot} Q ${w * 0.6} ${bot + 14} ${w * 0.4} ${bot + 10} Z`} fill={ropaO} opacity={0.55} />
        <path d={`M ${-w + 20} ${top + 20} Q ${-w + 16} ${(top + bot) / 2} ${-w + 22} ${bot - 30}`} stroke={ropaC} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
        {atuendo === "camisa" || atuendo === "traje" || atuendo === "uniforme" ? (
          <g>
            <path d={`M -34 ${top - 4} L 0 ${top + 70} L 34 ${top - 4}`} fill={ropa2} stroke={TINTA} strokeWidth={L - 1} strokeLinejoin="round" />
            {atuendo === "traje" ? <path d={`M -10 ${top + 10} L 0 ${top + 110} L 10 ${top + 10} L 0 ${top} Z`} fill="#B3263B" stroke={TINTA} strokeWidth={4} /> : null}
            {atuendo === "traje" ? <path d={`M -34 ${top - 4} L -14 ${top + 90} M 34 ${top - 4} L 14 ${top + 90}`} stroke={ropaO} strokeWidth={8} /> : null}
            {[0, 1, 2].map((k) => <circle key={k} cx={0} cy={top + 100 + k * 36} r={6} fill={atuendo === "uniforme" ? "#E0B341" : ropaO} />)}
          </g>
        ) : null}
        {atuendo === "camiseta" ? <path d={`M -38 ${top - 4} Q 0 ${top + 36} 38 ${top - 4}`} fill={pielO} stroke={TINTA} strokeWidth={L - 1} /> : null}
        {atuendo === "mono" ? (
          <g>
            <rect x={-w + 18} y={top + 60} width={2 * w - 36} height={bot - top - 60} fill={ropa2} opacity={0.0} />
            <path d={`M ${-w * 0.55} ${top - 2} L ${-w * 0.5} ${top + 80} M ${w * 0.55} ${top - 2} L ${w * 0.5} ${top + 80}`} stroke={ropaO} strokeWidth={14} />
            <rect x={-46} y={top + 76} width={92} height={70} rx={8} fill={ropaO} opacity={0.6} />
          </g>
        ) : null}
        {atuendo === "tunica" ? <rect x={-w - 4} y={top + torsoH * 0.55} width={2 * w + 8} height={24} fill="#6B4226" stroke={TINTA} strokeWidth={4} /> : null}
        {atuendo === "delantal" ? <path d={`M ${-w * 0.6} ${top + 40} L ${w * 0.6} ${top + 40} L ${w * 0.7} ${bot + 4} L ${-w * 0.7} ${bot + 4} Z`} fill={ropa2} stroke={TINTA} strokeWidth={L - 1} /> : null}
        {atuendo === "bata" ? <path d={`M 0 ${top + 4} L 0 ${bot}`} stroke={osc(ropa, 0.12)} strokeWidth={6} /> : null}
        {atuendo === "abrigo" ? <g><path d={`M -40 ${top} L -10 ${bot} M 40 ${top} L 10 ${bot}`} stroke={ropaO} strokeWidth={10} />{[0, 1, 2].map((k) => <circle key={k} cx={-24} cy={top + 70 + k * 60} r={8} fill={ropaO} />)}</g> : null}
        {atuendo === "armadura" ? <g>{[0, 1, 2].map((k) => <path key={k} d={`M ${-w + 10} ${top + 50 + k * 50} Q 0 ${top + 70 + k * 50} ${w - 10} ${top + 50 + k * 50}`} stroke={ropaO} strokeWidth={8} fill="none" />)}<ellipse cx={-30} cy={top + 60} rx={20} ry={36} fill="#FFFFFF" opacity={0.35} /></g> : null}
      </g>
    );
  };

  // ── Brazos (hombro → codo → mano). lado -1 = izquierdo (siempre relajado salvo poses de dos brazos)
  const manga = atuendo === "camiseta" ? piel : ropa;
  const brazoPath = (lado: number): { d: string; mano: [number, number] } => {
    const sx = lado * (w - 12), sy = hombroY + 24;
    const bal = Math.sin(f / 9 + lado) * 4 + (andar ? -lado * paso * 18 : 0);
    const pose = lado > 0 ? brazo : brazo === "dos_arriba" ? "arriba" : brazo === "jarras" ? "jarras" : "abajo";
    switch (pose) {
      case "arriba": return { d: `M ${sx} ${sy} Q ${sx + lado * 110} ${sy - 70} ${sx + lado * 120 + bal} ${sy - 190}`, mano: [sx + lado * 122 + bal, sy - 204] };
      case "senala": return { d: `M ${sx} ${sy} Q ${sx + lado * 90} ${sy - 10} ${sx + lado * 180} ${sy - 50}`, mano: [sx + lado * 196, sy - 56] };
      case "saludo": { const a = Math.sin(f / 3) * 22; return { d: `M ${sx} ${sy} Q ${sx + lado * 80} ${sy - 30} ${sx + lado * 90 + a} ${sy - 170}`, mano: [sx + lado * 92 + a, sy - 186] }; }
      case "jarras": return { d: `M ${sx} ${sy} Q ${sx + lado * 80} ${sy + 60} ${sx + lado * 20} ${sy + 130}`, mano: [sx + lado * 8, sy + 134] };
      case "pensar": return { d: `M ${sx} ${sy} Q ${sx + lado * 60} ${sy + 110} ${lado * 30} ${cabezaY + R * 0.85}`, mano: [lado * 22, cabezaY + R * 0.92] };
      case "sostiene": return { d: `M ${sx} ${sy} Q ${sx + lado * 50} ${sy + 110} ${sx + lado * 110} ${sy + 70}`, mano: [sx + lado * 124, sy + 64] };
      case "pincel": { const g = Math.sin(f / 4) * 25; return { d: `M ${sx} ${sy} Q ${sx + lado * 90} ${sy} ${sx + lado * 140 + g * 0.3} ${sy - 70 + g}`, mano: [sx + lado * 150 + g * 0.3, sy - 78 + g] }; }
      case "periscopio": return { d: `M ${sx} ${sy} Q ${sx + lado * 60} ${sy - 70} ${sx + lado * 20} ${sy - 150}`, mano: [sx + lado * 14, sy - 160] };
      default: return { d: `M ${sx} ${sy} Q ${sx + lado * 34} ${sy + 90} ${sx + lado * 20 + bal} ${sy + 180 * altoCuerpo}`, mano: [sx + lado * 20 + bal, sy + 194 * altoCuerpo] };
    }
  };
  const brazoView = (lado: number) => {
    const { d, mano } = brazoPath(lado);
    const g = 40 * Math.min(ancho, 1.12);
    return (
      <g key={lado}>
        <path d={d} stroke={TINTA} strokeWidth={g + L * 2} fill="none" strokeLinecap="round" />
        <path d={d} stroke={lado > 0 ? manga : manga === piel ? pielO : ropaO} strokeWidth={g} fill="none" strokeLinecap="round" />
        <circle cx={mano[0]} cy={mano[1]} r={25} fill={piel} stroke={TINTA} strokeWidth={L} />
        <circle cx={mano[0] + 6} cy={mano[1] + 6} r={12} fill={pielO} opacity={0.5} />
        {lado > 0 && brazo === "senala" ? <path d={`M ${mano[0] + 14} ${mano[1] - 4} l 34 -10`} stroke={TINTA} strokeWidth={18} strokeLinecap="round" /> : null}
        {lado > 0 && brazo === "senala" ? <path d={`M ${mano[0] + 14} ${mano[1] - 4} l 34 -10`} stroke={piel} strokeWidth={10} strokeLinecap="round" /> : null}
        {lado > 0 && brazo === "pincel" ? (
          <g transform={`translate(${mano[0]} ${mano[1]}) rotate(-35)`}>
            <rect x={-8} y={-110} width={16} height={110} rx={6} fill="#C58A4A" stroke={TINTA} strokeWidth={4} />
            <rect x={-15} y={-150} width={30} height={46} rx={8} fill="#2b2b2b" stroke={TINTA} strokeWidth={4} />
          </g>
        ) : null}
        {lado > 0 && brazo === "sostiene" && objeto ? <text x={mano[0] + 10} y={mano[1] - 20} fontSize={110} textAnchor="middle">{objeto}</text> : null}
      </g>
    );
  };

  // ── Cara
  const ojo = (cx: number) => {
    if (expresion === "feliz" || expresion === "risa") return <path d={`M ${cx - 22} 6 Q ${cx} -16 ${cx + 22} 6`} stroke={TINTA} strokeWidth={8} fill="none" strokeLinecap="round" />;
    const r = expresion === "sorpresa" ? 27 : 22;
    const parp = expresion === "picaro" ? 0.55 : parpadeo;
    return (
      <g>
        <ellipse cx={cx} cy={0} rx={r * 0.86} ry={r * parp} fill="#FFFFFF" stroke={TINTA} strokeWidth={5} />
        {parp > 0.3 ? (
          <g>
            <circle cx={cx + ox * 0.6} cy={3} r={expresion === "sorpresa" ? 10 : 13} fill="#4A3020" />
            <circle cx={cx + ox * 0.6} cy={3} r={expresion === "sorpresa" ? 6 : 8} fill={TINTA} />
            <circle cx={cx + ox * 0.6 - 5} cy={-3} r={4} fill="#FFFFFF" />
          </g>
        ) : null}
        {expresion === "triste" || expresion === "preocupado" ? <path d={`M ${cx - r} ${-r * 0.4} Q ${cx} ${-r * 0.9} ${cx + r} ${-r * 0.4}`} fill={piel} /> : null}
      </g>
    );
  };
  const cejas: Record<string, [number, number]> = {
    normal: [0, 0], feliz: [-6, -6], sorpresa: [-22, -22], preocupado: [14, -14], confuso: [-18, 10], idea: [-14, -14], enfadado: [-18, 18], risa: [-8, -8], triste: [16, -16], picaro: [-14, 8],
  };
  const [ci, cd] = cejas[expresion] ?? [0, 0];
  const bocaView = () => {
    const yb = 62;
    if (hablando) return <g><ellipse cx={ox * 0.5} cy={yb} rx={22 + boca * 4} ry={5 + 20 * boca} fill="#6A1E2C" stroke={TINTA} strokeWidth={5} /><ellipse cx={ox * 0.5} cy={yb + 6 * boca} rx={12} ry={5 * boca} fill="#E86A7A" /></g>;
    switch (expresion) {
      case "feliz": case "idea": case "picaro": return <path d={`M ${-34 + ox * 0.5} ${yb - 6} Q ${ox * 0.5} ${yb + 30} ${34 + ox * 0.5} ${yb - 6}`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
      case "risa": return <path d={`M ${-40 + ox * 0.5} ${yb - 8} Q ${ox * 0.5} ${yb + 56} ${40 + ox * 0.5} ${yb - 8} Z`} fill="#6A1E2C" stroke={TINTA} strokeWidth={6} />;
      case "sorpresa": return <ellipse cx={ox * 0.5} cy={yb + 4} rx={15} ry={21} fill="#6A1E2C" stroke={TINTA} strokeWidth={5} />;
      case "preocupado": case "triste": return <path d={`M ${-30 + ox * 0.5} ${yb + 12} Q ${ox * 0.5} ${yb - 10} ${30 + ox * 0.5} ${yb + 12}`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
      case "confuso": return <path d={`M ${-30 + ox * 0.5} ${yb + 4} Q ${-8 + ox * 0.5} ${yb - 6} ${10 + ox * 0.5} ${yb + 8} T ${36 + ox * 0.5} ${yb + 2}`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
      case "enfadado": return <path d={`M ${-30 + ox * 0.5} ${yb + 10} Q ${ox * 0.5} ${yb} ${30 + ox * 0.5} ${yb + 10}`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
      default: return <path d={`M ${-24 + ox * 0.5} ${yb} Q ${ox * 0.5} ${yb + 14} ${24 + ox * 0.5} ${yb}`} stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />;
    }
  };

  // ── Pelo (detrás y delante de la cabeza)
  const peloDetras = () => {
    if (pelo === "largo" || pelo === "melena") return <path d={`M ${-R * 1.02} ${-R * 0.1} Q ${-R * 1.15} ${R * 1.4} ${-R * 0.5} ${R * 1.5} L ${R * 0.5} ${R * 1.5} Q ${R * 1.15} ${R * 1.4} ${R * 1.02} ${-R * 0.1} Z`} fill={osc(pc, 0.1)} stroke={TINTA} strokeWidth={L} />;
    if (pelo === "coleta") return <path d={`M ${R * 0.7} ${-R * 0.5} Q ${R * 1.6} ${-R * 0.2} ${R * 1.3} ${R * 0.9} Q ${R * 1.1} ${R * 0.3} ${R * 0.8} ${-R * 0.1} Z`} fill={pc} stroke={TINTA} strokeWidth={L} />;
    if (pelo === "mono") return <circle cx={0} cy={-R * 1.05} r={R * 0.38} fill={pc} stroke={TINTA} strokeWidth={L} />;
    return null;
  };
  const peloDelante = () => {
    const cub = sombrero !== "ninguno" && sombrero !== "capucha";
    switch (pelo) {
      case "calvo": case "ninguno": return edad === "anciano" ? <g><path d={`M ${-R} ${-R * 0.05} Q ${-R * 1.08} ${-R * 0.5} ${-R * 0.75} ${-R * 0.55}`} stroke={pc} strokeWidth={24} fill="none" strokeLinecap="round" /><path d={`M ${R} ${-R * 0.05} Q ${R * 1.08} ${-R * 0.5} ${R * 0.75} ${-R * 0.55}`} stroke={pc} strokeWidth={24} fill="none" strokeLinecap="round" /></g> : null;
      case "rizado": return cub ? null : <g>{Array.from({ length: 9 }).map((_, k) => { const a = Math.PI * (1.05 + k * 0.11); return <circle key={k} cx={Math.cos(a) * R * 0.92} cy={Math.sin(a) * R * 0.92 - 6} r={R * 0.3} fill={k % 2 ? pc : osc(pc, 0.12)} stroke={TINTA} strokeWidth={L - 1} />; })}</g>;
      case "tupe": return cub ? null : <path d={`M ${-R * 0.95} ${-R * 0.2} Q ${-R} ${-R * 1.1} ${0} ${-R * 1.2} Q ${R * 1.1} ${-R * 1.35} ${R * 0.98} ${-R * 0.25} Q ${R * 0.5} ${-R * 0.75} ${-R * 0.2} ${-R * 0.6} Q ${-R * 0.6} ${-R * 0.55} ${-R * 0.95} ${-R * 0.2} Z`} fill={pc} stroke={TINTA} strokeWidth={L} />;
      default: return cub ? null : (
        <g>
          <path d={`M ${-R * 1.0} ${-R * 0.05} Q ${-R * 1.05} ${-R * 1.05} ${0} ${-R * 1.08} Q ${R * 1.05} ${-R * 1.05} ${R * 1.0} ${-R * 0.05} Q ${R * 0.8} ${-R * 0.55} ${R * 0.2} ${-R * 0.62} Q ${-R * 0.1} ${-R * 0.4} ${-R * 0.35} ${-R * 0.62} Q ${-R * 0.8} ${-R * 0.55} ${-R * 1.0} ${-R * 0.05} Z`} fill={pc} stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />
          <path d={`M ${-R * 0.55} ${-R * 0.85} Q ${-R * 0.1} ${-R * 1.0} ${R * 0.35} ${-R * 0.88}`} stroke={cla(pc, 0.3)} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      );
    }
  };

  const gorro = () => {
    switch (sombrero) {
      case "boina": return <path d={`M ${-R * 1.12} ${-R * 0.55} Q ${-R * 0.3} ${-R * 1.6} ${R * 1.12} ${-R * 0.75} Q ${R * 1.25} ${-R * 0.58} ${R * 0.95} ${-R * 0.55} Z`} fill="#B3263B" stroke={TINTA} strokeWidth={L} />;
      case "marino": return <g><rect x={-R * 0.85} y={-R * 1.1} width={R * 1.7} height={R * 0.4} rx={14} fill="#F4F4F4" stroke={TINTA} strokeWidth={L} /><rect x={-R * 0.85} y={-R * 0.8} width={R * 1.7} height={12} fill="#1C2D5C" /></g>;
      case "capitan": return <g><path d={`M ${-R * 1.1} ${-R * 0.62} Q ${-R * 1.1} ${-R * 1.4} 0 ${-R * 1.45} Q ${R * 1.1} ${-R * 1.4} ${R * 1.1} ${-R * 0.62} Z`} fill="#1C2D5C" stroke={TINTA} strokeWidth={L} /><path d={`M ${-R * 1.2} ${-R * 0.6} L ${R * 1.2} ${-R * 0.6} Q ${R * 0.9} ${-R * 0.4} ${-R * 0.9} ${-R * 0.42} Z`} fill="#111" stroke={TINTA} strokeWidth={5} /><circle cx={0} cy={-R * 1.05} r={16} fill="#F2C230" stroke={TINTA} strokeWidth={4} /></g>;
      case "corona": return <path d={`M ${-R * 0.8} ${-R * 0.78} L ${-R * 0.9} ${-R * 1.6} L ${-R * 0.45} ${-R * 1.2} L 0 ${-R * 1.75} L ${R * 0.45} ${-R * 1.2} L ${R * 0.9} ${-R * 1.6} L ${R * 0.8} ${-R * 0.78} Z`} fill="#F5C531" stroke={TINTA} strokeWidth={L} strokeLinejoin="round" />;
      case "chistera": return <g><rect x={-R * 0.68} y={-R * 2.15} width={R * 1.36} height={R * 1.4} rx={10} fill="#222" stroke={TINTA} strokeWidth={L} /><rect x={-R * 0.68} y={-R * 1.0} width={R * 1.36} height={22} fill="#7A1E2C" /><rect x={-R * 1.1} y={-R * 0.86} width={R * 2.2} height={26} rx={12} fill="#222" stroke={TINTA} strokeWidth={L} /></g>;
      case "casco": return <g><path d={`M ${-R * 1.1} ${-R * 0.35} Q ${-R * 1.1} ${-R * 1.45} 0 ${-R * 1.45} Q ${R * 1.1} ${-R * 1.45} ${R * 1.1} ${-R * 0.35} Z`} fill="#F2C230" stroke={TINTA} strokeWidth={L} /><rect x={-R * 1.25} y={-R * 0.42} width={R * 2.5} height={22} rx={10} fill="#E0AE20" stroke={TINTA} strokeWidth={L - 1} /><path d={`M 0 ${-R * 1.45} V ${-R * 0.45}`} stroke="#E0AE20" strokeWidth={14} /></g>;
      case "gorra": return <g><path d={`M ${-R * 1.02} ${-R * 0.5} Q ${-R} ${-R * 1.3} 0 ${-R * 1.3} Q ${R} ${-R * 1.3} ${R * 1.02} ${-R * 0.5} Z`} fill={ropa} stroke={TINTA} strokeWidth={L} /><path d={`M ${R * 0.4} ${-R * 0.55} Q ${R * 1.4} ${-R * 0.62} ${R * 1.55} ${-R * 0.38} L ${R * 0.6} ${-R * 0.35} Z`} fill={ropaO} stroke={TINTA} strokeWidth={L} /></g>;
      case "paja": return <g><ellipse cx={0} cy={-R * 0.72} rx={R * 1.6} ry={R * 0.28} fill="#E8C56A" stroke={TINTA} strokeWidth={L} /><path d={`M ${-R * 0.75} ${-R * 0.75} Q ${-R * 0.7} ${-R * 1.4} 0 ${-R * 1.4} Q ${R * 0.7} ${-R * 1.4} ${R * 0.75} ${-R * 0.75} Z`} fill="#E8C56A" stroke={TINTA} strokeWidth={L} /><rect x={-R * 0.75} y={-R * 0.95} width={R * 1.5} height={18} fill="#B3263B" /></g>;
      case "vaquero": return <g><path d={`M ${-R * 1.7} ${-R * 0.7} Q 0 ${-R * 0.35} ${R * 1.7} ${-R * 0.7} Q 0 ${-R * 0.55} ${-R * 1.7} ${-R * 0.7} Z`} fill="#8A5A2B" stroke={TINTA} strokeWidth={L} /><path d={`M ${-R * 0.75} ${-R * 0.68} Q ${-R * 0.85} ${-R * 1.5} ${-R * 0.2} ${-R * 1.4} Q 0 ${-R * 1.25} ${R * 0.2} ${-R * 1.4} Q ${R * 0.85} ${-R * 1.5} ${R * 0.75} ${-R * 0.68} Z`} fill="#9C6A34" stroke={TINTA} strokeWidth={L} /></g>;
      case "cocinero": return <g><rect x={-R * 0.7} y={-R * 1.15} width={R * 1.4} height={R * 0.5} fill="#FFFFFF" stroke={TINTA} strokeWidth={L} />{[-0.45, 0, 0.45].map((k) => <circle key={k} cx={R * k} cy={-R * 1.4} r={R * 0.42} fill="#FFFFFF" stroke={TINTA} strokeWidth={L} />)}</g>;
      case "capucha": return <path d={`M ${-R * 1.25} ${R * 0.6} Q ${-R * 1.35} ${-R * 1.5} 0 ${-R * 1.4} Q ${R * 1.35} ${-R * 1.5} ${R * 1.25} ${R * 0.6} Q ${R * 1.05} ${-R * 0.9} 0 ${-R * 0.95} Q ${-R * 1.05} ${-R * 0.9} ${-R * 1.25} ${R * 0.6} Z`} fill={ropa} stroke={TINTA} strokeWidth={L} />;
      default: return null;
    }
  };

  return (
    <g transform={`translate(${x} ${y + salto + bote}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      <ellipse cx={0} cy={4} rx={130 * ancho} ry={20} fill="rgba(0,0,0,0.25)" />
      {pierna(-1)}
      {pierna(1)}
      <g transform={`translate(0 ${respira * 0.5})`}>
        {brazoView(-1)}
        {torso()}
        {/* cuello */}
        <rect x={-26} y={cuelloY - 30} width={52} height={40} fill={pielO} stroke={TINTA} strokeWidth={L - 1} />
        {brazo !== "pensar" ? brazoView(1) : null}
      </g>
      {/* cabeza */}
      <g transform={`translate(0 ${cabezaY + respira}) rotate(${mira * 4 + (expresion === "confuso" ? Math.sin(f / 10) * 6 : 0)})`}>
        {peloDetras()}
        <ellipse cx={-R * 0.98} cy={10} rx={22} ry={30} fill={piel} stroke={TINTA} strokeWidth={L} />
        <ellipse cx={R * 0.98} cy={10} rx={22} ry={30} fill={piel} stroke={TINTA} strokeWidth={L} />
        <ellipse cx={0} cy={0} rx={R} ry={R * 0.96} fill={piel} stroke={TINTA} strokeWidth={L} />
        <path d={`M ${R * 0.35} ${-R * 0.85} Q ${R * 1.05} ${-R * 0.3} ${R * 0.55} ${R * 0.8} Q ${R * 0.95} ${R * 0.1} ${R * 0.35} ${-R * 0.85} Z`} fill={pielO} opacity={0.4} />
        <ellipse cx={-R * 0.62} cy={R * 0.38} rx={24} ry={14} fill="#F08A8A" opacity={0.45} />
        <ellipse cx={R * 0.62} cy={R * 0.38} rx={24} ry={14} fill="#F08A8A" opacity={0.45} />
        {edad === "anciano" ? <g stroke={pielO} strokeWidth={4} fill="none" strokeLinecap="round"><path d={`M ${-R * 0.4} ${-R * 0.55} q ${R * 0.4} -10 ${R * 0.8} 0`} /><path d={`M ${-R * 0.75} ${R * 0.05} q 8 14 0 26`} /><path d={`M ${R * 0.75} ${R * 0.05} q -8 14 0 26`} /></g> : null}
        <g transform="translate(0 -6)">
          {ojo(-46 + ox)}
          {ojo(46 + ox)}
          <path d={`M ${-74 + ox} ${-38 + ci} Q ${-48 + ox} ${-50 + ci * 0.5} ${-22 + ox} ${-38 - ci * 0.3}`} stroke={edad === "anciano" ? "#9A968F" : osc(pc, 0.2)} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M ${22 + ox} ${-38 - cd * 0.3} Q ${48 + ox} ${-50 + cd * 0.5} ${74 + ox} ${-38 + cd}`} stroke={edad === "anciano" ? "#9A968F" : osc(pc, 0.2)} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
        <path d={`M ${ox * 0.8 - 4} 10 Q ${ox * 0.8 + 16} 34 ${ox * 0.8 - 6} 40`} stroke={pielO} strokeWidth={7} fill="none" strokeLinecap="round" />
        {barba ? <path d={`M ${-R * 0.95} ${R * 0.15} Q ${-R * 0.9} ${R * 1.25} 0 ${R * 1.3} Q ${R * 0.9} ${R * 1.25} ${R * 0.95} ${R * 0.15} Q ${R * 0.5} ${R * 0.85} 0 ${R * 0.8} Q ${-R * 0.5} ${R * 0.85} ${-R * 0.95} ${R * 0.15} Z`} fill={pc} stroke={TINTA} strokeWidth={L - 1} /> : null}
        {bocaView()}
        {bigote ? <path d={`M -62 50 Q -30 22 0 42 Q 30 22 62 50 Q 36 58 0 50 Q -36 58 -62 50 Z`} fill={pc} stroke={TINTA} strokeWidth={4} /> : null}
        {gafas ? <g fill="rgba(200,230,255,0.25)" stroke={TINTA} strokeWidth={6}><circle cx={-46 + ox} cy={-6} r={32} /><circle cx={46 + ox} cy={-6} r={32} /><path d={`M ${-14 + ox} -8 h 28`} /></g> : null}
        {peloDelante()}
        {gorro()}
        {expresion === "idea" ? (
          <g transform={`translate(${R * 1.15} ${-R * 1.4}) scale(${1 + Math.sin(f / 4) * 0.06})`}>
            <circle r={42} fill="#FFE45C" stroke={TINTA} strokeWidth={6} />
            <rect x={-16} y={36} width={32} height={24} rx={6} fill="#9a9a9a" stroke={TINTA} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d="M 0 -58 L 0 -80" stroke="#FFD12E" strokeWidth={8} strokeLinecap="round" transform={`rotate(${-60 + i * 30})`} />)}
          </g>
        ) : null}
        {expresion === "confuso" ? <text x={R * 1.1} y={-R * 1.1} fontSize={100} fontWeight={900} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke" fontFamily="Fredoka, sans-serif" transform={`rotate(${Math.sin(f / 6) * 10} ${R * 1.1} ${-R * 1.4})`}>?</text> : null}
        {expresion === "preocupado" || expresion === "triste" ? <path d={`M ${R * 1.05} ${-R * 0.3 + (f % 30)} q 11 20 0 28 q -11 -8 0 -28`} fill="#8FD3FF" stroke={TINTA} strokeWidth={4} /> : null}
        {expresion === "enfadado" ? <g transform={`translate(${R * 0.9} ${-R * 1.0})`} stroke="#E8463A" strokeWidth={9} strokeLinecap="round"><path d="M -18 -18 l 12 12 M 18 -18 l -12 12 M -18 18 l 12 -12 M 18 18 l -12 -12" /></g> : null}
      </g>
      {brazo === "pensar" ? <g transform={`translate(0 ${respira * 0.5})`}>{brazoView(1)}</g> : null}
    </g>
  );
};
