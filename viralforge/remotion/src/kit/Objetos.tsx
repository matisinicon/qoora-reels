import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TINTA, TRAZO } from "./estilo";

// Barco de vapor de 1917 visto de lado. dazzle: 0 (gris) … 1 (pintado del todo)
export const Barco: React.FC<{ x: number; y: number; escala?: number; dazzle?: number; espejo?: boolean; balanceo?: boolean; id?: string; hundido?: number }> = ({
  x, y, escala = 1, dazzle = 0, espejo = false, balanceo = true, id = "b", hundido = 0,
}) => {
  const f = useCurrentFrame();
  const rot = balanceo ? Math.sin(f / 18) * 1.6 : 0;
  const bob = balanceo ? Math.sin(f / 14) * 6 : 0;
  const casco = "M -430 -40 L 430 -40 L 360 90 L -380 90 Z";
  const sup = "M -250 -40 L -250 -150 L 160 -150 L 160 -40 Z M -150 -150 L -150 -230 L 60 -230 L 60 -150 Z";
  return (
    <g transform={`translate(${x} ${y + bob + hundido * 260}) rotate(${rot + hundido * 18}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      <defs>
        <clipPath id={`casco-${id}`}><path d={casco + " " + sup} /></clipPath>
        <clipPath id={`revela-${id}`}><rect x={-450} y={-260} width={900 * dazzle} height={380} /></clipPath>
      </defs>
      {/* Chimeneas y mástiles */}
      <line x1={-330} y1={-40} x2={-330} y2={-330} stroke={TINTA} strokeWidth={10} />
      <line x1={300} y1={-40} x2={300} y2={-300} stroke={TINTA} strokeWidth={10} />
      <path d="M -330 -320 L 300 -290" stroke={TINTA} strokeWidth={4} />
      <rect x={-90} y={-360} width={70} height={140} fill="#3a3a3a" stroke={TINTA} strokeWidth={TRAZO} />
      <rect x={10} y={-340} width={70} height={120} fill="#3a3a3a" stroke={TINTA} strokeWidth={TRAZO} />
      <rect x={-90} y={-360} width={70} height={22} fill="#C0392B" />
      <rect x={10} y={-340} width={70} height={22} fill="#C0392B" />
      {/* Cuerpo gris */}
      <path d={casco} fill="#8C949C" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
      <path d={sup} fill="#A9B0B7" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
      {/* Dazzle */}
      <g clipPath={`url(#casco-${id})`}>
        <g clipPath={`url(#revela-${id})`}>
          <rect x={-450} y={-260} width={900} height={380} fill="#F4F4F4" />
          {[
            "M -450 -260 L -300 -260 L -120 120 L -270 120 Z",
            "M -150 -260 L -40 -260 L -260 120 L -370 120 Z",
            "M 20 -260 L 160 -260 L 40 120 L -100 120 Z",
            "M 200 -260 L 300 -260 L 450 60 L 450 120 L 380 120 Z",
            "M 120 -40 L 450 -120 L 450 -40 L 160 40 Z",
            "M -450 20 L -100 -40 L -100 20 L -450 90 Z",
          ].map((d, i) => (
            <path key={i} d={d} fill={i % 3 === 2 ? "#2E5DA8" : "#151515"} />
          ))}
          <path d="M 250 -260 L 330 -260 L 120 120 L 40 120 Z" fill="#6EA6D9" />
        </g>
        {dazzle > 0 && dazzle < 1 ? <rect x={-450 + 900 * dazzle - 6} y={-260} width={12} height={380} fill="#fff" opacity={0.8} /> : null}
      </g>
      <path d={casco} fill="none" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
      <path d={sup} fill="none" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
      {[-200, -120, -40, 40, 110].map((cx) => <circle key={cx} cx={cx} cy={-95} r={14} fill="#FFE9A6" stroke={TINTA} strokeWidth={5} />)}
      {/* Humo */}
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 20) % 60) / 60;
        return <circle key={i} cx={-55 - t * 160} cy={-380 - t * 160} r={30 + t * 50} fill="#cfcfcf" opacity={0.7 * (1 - t)} />;
      })}
      {/* Espuma */}
      <path d={`M -400 90 Q -200 ${110 + Math.sin(f / 5) * 8} 0 95 T 380 92`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.8} strokeLinecap="round" />
    </g>
  );
};

export const Submarino: React.FC<{ x: number; y: number; escala?: number; periscopio?: number; espejo?: boolean }> = ({ x, y, escala = 1, periscopio = 1, espejo = false }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 16) * 6}) scale(${(espejo ? -1 : 1) * escala} ${escala})`}>
      <rect x={60} y={-90 - 160 * periscopio} width={18} height={160 * periscopio + 20} fill="#4b5360" stroke={TINTA} strokeWidth={6} />
      <rect x={60} y={-110 - 160 * periscopio} width={60} height={26} rx={6} fill="#4b5360" stroke={TINTA} strokeWidth={6} />
      <path d="M -120 -40 L -80 -110 L 120 -110 L 150 -40 Z" fill="#5d6673" stroke={TINTA} strokeWidth={TRAZO} strokeLinejoin="round" />
      <path d="M -420 0 Q -420 -60 -300 -60 L 330 -60 Q 440 -50 450 0 Q 440 50 330 60 L -300 60 Q -420 60 -420 0 Z" fill="#6c7480" stroke={TINTA} strokeWidth={TRAZO} />
      <text x={-40} y={20} fontSize={60} fontWeight={900} fill="#e8e8e8" fontFamily="Fredoka, sans-serif">U-9</text>
      <path d="M -420 0 L -480 -50 L -480 50 Z" fill="#5d6673" stroke={TINTA} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={-480 - ((f * 3 + i * 25) % 100)} cy={Math.sin(f / 4 + i) * 20} r={8 + i * 2} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />)}
    </g>
  );
};

export const Torpedo: React.FC<{ x: number; y: number; angulo?: number; escala?: number }> = ({ x, y, angulo = 0, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo}) scale(${escala})`}>
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-120 - i * 45} cy={Math.sin(f / 3 + i) * 10} r={10 + i * 3} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7 - i * 0.1} />)}
      <path d="M -110 -26 L 90 -26 Q 140 -26 150 0 Q 140 26 90 26 L -110 26 Z" fill="#B8BEC6" stroke={TINTA} strokeWidth={TRAZO} />
      <rect x={-130} y={-40} width={24} height={80} fill="#8a9099" stroke={TINTA} strokeWidth={6} />
      <rect x={90} y={-26} width={14} height={52} fill="#C0392B" />
    </g>
  );
};

export const Explosion: React.FC<{ x: number; y: number; inicio: number; escala?: number }> = ({ x, y, inicio, escala = 1 }) => {
  const f = useCurrentFrame() - inicio;
  if (f < 0 || f > 40) return null;
  const s = interpolate(f, [0, 8, 40], [0.2, 1.1, 1.3]);
  const o = interpolate(f, [0, 25, 40], [1, 0.9, 0]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * escala})`} opacity={o}>
      <path d="M 0 -260 L 60 -110 L 220 -170 L 120 -40 L 260 40 L 90 70 L 140 230 L 0 120 L -140 230 L -90 70 L -260 40 L -120 -40 L -220 -170 L -60 -110 Z" fill="#FFB02E" stroke={TINTA} strokeWidth={10} strokeLinejoin="round" />
      <path d="M 0 -140 L 35 -60 L 120 -90 L 60 -10 L 140 30 L 40 45 L 0 120 L -40 45 L -140 30 L -60 -10 L -120 -90 L -35 -60 Z" fill="#FFF15C" />
    </g>
  );
};

export const Calendario: React.FC<{ mes: string; anio: string }> = ({ mes, anio }) => {
  const f = useCurrentFrame();
  const caida = interpolate(f, [0, 10], [-900, 0], { extrapolateRight: "clamp" });
  const rot = interpolate(f, [0, 10, 16, 22], [-25, 6, -3, 0], { extrapolateRight: "clamp" });
  return (
    <g transform={`translate(540 ${860 + caida}) rotate(${rot})`}>
      <rect x={-300} y={-330} width={600} height={660} rx={30} fill="#fff" stroke={TINTA} strokeWidth={12} />
      <rect x={-300} y={-330} width={600} height={190} rx={30} fill="#D63A3A" stroke={TINTA} strokeWidth={12} />
      {[-180, -60, 60, 180].map((cx) => <rect key={cx} x={cx - 12} y={-370} width={24} height={80} rx={12} fill="#555" stroke={TINTA} strokeWidth={6} />)}
      <text x={0} y={-205} textAnchor="middle" fontSize={96} fontWeight={800} fill="#fff" fontFamily="Fredoka, sans-serif">{mes}</text>
      <text x={0} y={140} textAnchor="middle" fontSize={230} fontWeight={800} fill={TINTA} fontFamily="Fredoka, sans-serif">{anio}</text>
    </g>
  );
};

export const Contador: React.FC<{ desde: number; hasta: number; duracion: number; sufijo?: string; etiqueta?: string; y?: number }> = ({ desde, hasta, duracion, sufijo = "", etiqueta = "", y = 520 }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [0, duracion], [desde, hasta], { extrapolateRight: "clamp" }));
  const pop = 1 + Math.max(0, 0.15 - f * 0.01);
  return (
    <g transform={`translate(540 ${y}) scale(${pop})`}>
      <text x={0} y={0} textAnchor="middle" fontSize={230} fontWeight={800} fill="#FFD23F" stroke={TINTA} strokeWidth={18} paintOrder="stroke" fontFamily="Fredoka, sans-serif">
        {v.toLocaleString("es-ES")}{sufijo}
      </text>
      {etiqueta ? <text x={0} y={95} textAnchor="middle" fontSize={70} fontWeight={700} fill="#fff" stroke={TINTA} strokeWidth={12} paintOrder="stroke" fontFamily="Fredoka, sans-serif">{etiqueta}</text> : null}
    </g>
  );
};

// Vista a través del periscopio: oscurece todo menos un círculo con retícula
export const VistaPeriscopio: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const r = 430;
  return (
    <g>
      <defs>
        <mask id="ojo-periscopio">
          <rect x={-400} y={-400} width={1880} height={2720} fill="#000" />
          <circle cx={540} cy={900} r={r} fill="#fff" />
        </mask>
      </defs>
      <g mask="url(#ojo-periscopio)">
        <g transform={`translate(${Math.sin(f / 20) * 12} ${Math.cos(f / 17) * 8})`}>{children}</g>
        <line x1={540} y1={900 - r} x2={540} y2={900 + r} stroke="#000" strokeWidth={4} opacity={0.7} />
        <line x1={540 - r} y1={900} x2={540 + r} y2={900} stroke="#000" strokeWidth={4} opacity={0.7} />
        {[-3, -2, -1, 1, 2, 3].map((i) => <line key={i} x1={540 + i * 110} y1={885} x2={540 + i * 110} y2={915} stroke="#000" strokeWidth={4} />)}
        <circle cx={540} cy={900} r={r} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={60} />
      </g>
      <rect x={-400} y={-400} width={1880} height={2720} fill="#0b0b0f" mask="url(#fuera-periscopio)" opacity={0} />
      <circle cx={540} cy={900} r={r + 6} fill="none" stroke="#0b0b0f" strokeWidth={14} />
    </g>
  );
};

export const Flecha: React.FC<{ x: number; y: number; angulo: number; color?: string; texto?: string; aparece?: number }> = ({ x, y, angulo, color = "#FFD23F", texto, aparece = 0 }) => {
  const f = useCurrentFrame() - aparece;
  if (f < 0) return null;
  const s = interpolate(f, [0, 6, 10], [0, 1.15, 1], { extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo}) scale(${s})`}>
      <path d="M -150 -26 L 60 -26 L 60 -70 L 170 0 L 60 70 L 60 26 L -150 26 Z" fill={color} stroke={TINTA} strokeWidth={10} strokeLinejoin="round" />
      {texto ? <text x={0} y={-90} textAnchor="middle" fontSize={90} fontWeight={800} fill="#fff" stroke={TINTA} strokeWidth={12} paintOrder="stroke" fontFamily="Fredoka, sans-serif" transform={`rotate(${-angulo} 0 -110)`}>{texto}</text> : null}
    </g>
  );
};
