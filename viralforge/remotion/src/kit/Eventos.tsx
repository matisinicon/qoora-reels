import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Explosion } from "./Objetos";
import { TINTA } from "./estilo";

// EVENTOS: lo que «le pasa» a la escena justo en la palabra que lo narra.
// FRAME escribe { tipo, palabra } y preparar.mjs lo convierte en t (segundos desde el inicio de la escena).
export type Evento = {
  tipo:
    | "apagon" | "oscurecer" | "foco" | "destello" | "relampago" | "temblor" | "zoom"
    | "brillo" | "monedas" | "lluvia_objetos" | "humo" | "explosion" | "cambio" | "rotulo";
  t?: number; // segundos desde que empieza la escena
  palabra?: string; // palabra de la narración que lo dispara (la resuelve preparar.mjs)
  dur?: number; // segundos (si falta: hasta el final de la escena o duración típica)
  ref?: string; // personaje afectado (C1, C2… o "todos")
  x?: number; y?: number;
  color?: string;
  nombre?: string; // emoji/objeto para lluvia_objetos
  texto?: string; // rotulo
  props?: Record<string, any>; // cambio: nuevas props del personaje (expresion, brazo, torso, ropa…)
  intensidad?: number;
};

export const CABEZA_Y = 518; // distancia de los pies al centro de la cabeza (escala 1)

// Estado de un evento en el fotograma actual
export function activo(ev: Evento, f: number, fps: number, dur: number, porDefecto = 0) {
  const t0 = Math.round((ev.t ?? 0) * fps);
  const d = ev.dur != null ? Math.round(ev.dur * fps) : porDefecto > 0 ? Math.round(porDefecto * fps) : dur - t0 + 1;
  return { on: f >= t0 && f <= t0 + d, lf: f - t0, t0, d };
}

// Desplazamiento de cámara por temblor / zoom (se aplica a todo el contenido)
export function transformacionEventos(evs: Evento[], f: number, fps: number, dur: number) {
  let tx = 0, ty = 0, s = 1, cx = 540, cy = 960;
  for (const ev of evs) {
    if (ev.tipo === "temblor" || ev.tipo === "explosion" || ev.tipo === "relampago") {
      const a = activo(ev, f, fps, dur, ev.tipo === "temblor" ? 0.7 : 0.4);
      if (a.on) {
        const k = (ev.intensidad ?? (ev.tipo === "temblor" ? 1 : 0.6)) * interpolate(a.lf, [0, a.d], [1, 0], { extrapolateRight: "clamp" });
        tx += Math.sin(a.lf * 2.3) * 22 * k;
        ty += Math.cos(a.lf * 1.9) * 16 * k;
      }
    }
    if (ev.tipo === "zoom") {
      const a = activo(ev, f, fps, dur);
      if (f >= a.t0) {
        const p = interpolate(a.lf, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        s *= 1 + (ev.intensidad ?? 0.35) * p;
        cx = ev.x ?? 540; cy = ev.y ?? 960;
      }
    }
  }
  return { tx, ty, s, cx, cy };
}

// ¿Este personaje brilla/cambia ahora?
export function estadoPersonaje(ref: string | undefined, evs: Evento[], f: number, fps: number, dur: number) {
  let props: Record<string, any> = {};
  let brilla: string | null = null;
  for (const ev of evs) {
    if (ev.tipo === "cambio" && (ev.ref === ref || ev.ref === "todos") && f >= Math.round((ev.t ?? 0) * fps)) props = { ...props, ...(ev.props ?? {}) };
    if (ev.tipo === "apagon" && (ev.ref === ref || ev.ref === "todos") && activo(ev, f, fps, dur).on) brilla = ev.color ?? "#9CFFB0";
  }
  return { props, brilla };
}

// Oscuridad (apagón / oscurecer / foco) — va por encima del decorado y de los personajes que no brillan
export const Oscuridad: React.FC<{ evs: Evento[]; dur: number }> = ({ evs, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const capas: React.ReactNode[] = [];
  evs.forEach((ev, i) => {
    if (ev.tipo !== "apagon" && ev.tipo !== "oscurecer" && ev.tipo !== "foco") return;
    const a = activo(ev, f, fps, dur);
    if (!a.on) return;
    const fin = a.d - a.lf; // fotogramas que quedan
    const entrada = ev.tipo === "apagon" ? interpolate(a.lf, [0, 1, 3, 4, 6], [0, 0.95, 0.3, 0.95, 0.93], { extrapolateRight: "clamp" }) : interpolate(a.lf, [0, 12], [0, ev.tipo === "foco" ? 0.82 : 0.6], { extrapolateRight: "clamp" });
    const o = entrada * interpolate(fin, [0, 5], [0, 1], { extrapolateRight: "clamp" });
    if (ev.tipo === "foco") {
      const id = `foco${i}`;
      capas.push(
        <g key={i}>
          <defs>
            <radialGradient id={id} cx={(ev.x ?? 540) / 1080} cy={(ev.y ?? 1100) / 1920} r="0.32" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#05040c" stopOpacity={0} />
              <stop offset="0.55" stopColor="#05040c" stopOpacity={0.2} />
              <stop offset="1" stopColor="#05040c" stopOpacity={1} />
            </radialGradient>
          </defs>
          <rect x={0} y={0} width={1080} height={1920} fill={`url(#${id})`} opacity={o} />
        </g>
      );
    } else {
      capas.push(<rect key={i} x={-400} y={-400} width={1880} height={2720} fill={ev.tipo === "apagon" ? "#04030a" : "#0d0b22"} opacity={o} />);
    }
  });
  return <g pointerEvents="none">{capas}</g>;
};

// Efectos que se dibujan encima de todo
export const EfectosEvento: React.FC<{ evs: Evento[]; dur: number }> = ({ evs, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <g pointerEvents="none">
      {evs.map((ev, i) => {
        const x = ev.x ?? 540, y = ev.y ?? 900;
        switch (ev.tipo) {
          case "destello": {
            const a = activo(ev, f, fps, dur, 0.5);
            if (!a.on) return null;
            return <rect key={i} x={-400} y={-400} width={1880} height={2720} fill={ev.color ?? "#fff"} opacity={interpolate(a.lf, [0, 2, 14], [0.95, 0.8, 0], { extrapolateRight: "clamp" })} />;
          }
          case "relampago": {
            const a = activo(ev, f, fps, dur, 0.6);
            if (!a.on) return null;
            return <rect key={i} x={-400} y={-400} width={1880} height={2720} fill="#DDE8FF" opacity={interpolate(a.lf, [0, 1, 3, 5, 6, 18], [0.9, 0.2, 0.85, 0.1, 0.6, 0], { extrapolateRight: "clamp" })} />;
          }
          case "explosion": {
            const a = activo(ev, f, fps, dur, 1.4);
            if (!a.on) return null;
            return (
              <g key={i}>
                <rect x={-400} y={-400} width={1880} height={2720} fill="#FFF3C4" opacity={interpolate(a.lf, [0, 6], [0.7, 0], { extrapolateRight: "clamp" })} />
                <Explosion x={x} y={y} inicio={a.t0} escala={1.4} />
              </g>
            );
          }
          case "brillo": {
            const a = activo(ev, f, fps, dur, 1.6);
            if (!a.on) return null;
            const c = ev.color ?? "#FFF27A";
            return (
              <g key={i}>
                {Array.from({ length: 14 }).map((_, k) => {
                  const ang = (k / 14) * Math.PI * 2 + k;
                  const d = 60 + ((a.lf * 6 + k * 23) % 220);
                  const sc = interpolate(Math.sin((a.lf + k * 5) / 3), [-1, 1], [0.3, 1.1]);
                  const op = interpolate(a.lf, [0, 4, a.d - 8, a.d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return <path key={k} transform={`translate(${x + Math.cos(ang) * d} ${y + Math.sin(ang) * d}) scale(${sc})`} d="M 0 -26 Q 4 -4 26 0 Q 4 4 0 26 Q -4 4 -26 0 Q -4 -4 0 -26 Z" fill={c} stroke="#fff" strokeWidth={3} opacity={op} />;
                })}
              </g>
            );
          }
          case "monedas":
          case "lluvia_objetos": {
            const a = activo(ev, f, fps, dur, 2.5);
            if (!a.on) return null;
            return (
              <g key={i}>
                {Array.from({ length: 22 }).map((_, k) => {
                  const xx = 60 + ((k * 397) % 960);
                  const yy = -120 + ((a.lf * (16 + (k % 5) * 3) + k * 140) % 2200);
                  const r = (a.lf * (6 + (k % 4) * 3) + k * 40) % 360;
                  if (ev.tipo === "monedas")
                    return (
                      <g key={k} transform={`translate(${xx} ${yy}) rotate(${r}) scale(${0.8 + (k % 3) * 0.2} 1)`}>
                        <ellipse rx={34} ry={34} fill="#F5C531" stroke={TINTA} strokeWidth={6} />
                        <ellipse rx={20} ry={20} fill="none" stroke="#D9A21E" strokeWidth={5} />
                        <path d="M -10 -18 Q -18 -6 -8 -2" stroke="#FFF3B0" strokeWidth={5} fill="none" strokeLinecap="round" />
                      </g>
                    );
                  return <text key={k} x={xx} y={yy} fontSize={90} textAnchor="middle" transform={`rotate(${r / 4} ${xx} ${yy})`}>{ev.nombre ?? "⭐"}</text>;
                })}
              </g>
            );
          }
          case "humo": {
            const a = activo(ev, f, fps, dur, 1.2);
            if (!a.on) return null;
            const p = a.lf / a.d;
            return (
              <g key={i}>
                {Array.from({ length: 9 }).map((_, k) => {
                  const ang = (k / 9) * Math.PI * 2;
                  const d = 30 + p * 220;
                  return <circle key={k} cx={x + Math.cos(ang) * d} cy={y + Math.sin(ang) * d * 0.7 - p * 80} r={70 + p * 60} fill={ev.color ?? "#ECECF2"} stroke="#C9C8D8" strokeWidth={6} opacity={interpolate(p, [0, 0.15, 1], [0, 0.95, 0])} />;
                })}
              </g>
            );
          }
          case "rotulo": {
            const a = activo(ev, f, fps, dur, 1.6);
            if (!a.on || !ev.texto) return null;
            const s = interpolate(a.lf, [0, 5, 9], [0.2, 1.15, 1], { extrapolateRight: "clamp" });
            const o = interpolate(a.lf, [a.d - 6, a.d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={i} transform={`translate(${x} ${ev.y ?? 560}) scale(${s}) rotate(-4)`} opacity={o}>
                <text textAnchor="middle" fontSize={150} fontWeight={900} fill={ev.color ?? "#FFE14D"} stroke={TINTA} strokeWidth={22} paintOrder="stroke" fontFamily="Fredoka, sans-serif">{ev.texto.toUpperCase()}</text>
              </g>
            );
          }
          case "cambio": {
            // pequeño «puf» al transformarse
            const a = activo(ev, f, fps, dur, 0.6);
            if (!a.on || ev.x == null) return null;
            const p = a.lf / a.d;
            return <circle key={i} cx={x} cy={y} r={60 + p * 260} fill="none" stroke="#FFFFFF" strokeWidth={18 * (1 - p)} opacity={1 - p} />;
          }
          default:
            return null;
        }
      })}
    </g>
  );
};
