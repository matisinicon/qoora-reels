import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Fondo, FondoSpec } from "./Fondos";
import { BIBLIOTECA, limpiarSvg } from "./Biblioteca";
import { Personaje, PersonajeProps } from "./Personaje";
import { Contador, Explosion, Flecha, VistaPeriscopio } from "./Objetos";
import { TINTA } from "./estilo";
import { CamaraCtx } from "./camara";
import { Atmosfera } from "./Atmosfera";
import { Evento, EfectosEvento, Oscuridad, estadoPersonaje, transformacionEventos, CABEZA_Y } from "./Eventos";

// Escena genérica por capas: FRAME la describe en JSON y Remotion la dibuja.
export type Elemento = {
  tipo: "personaje" | "objeto" | "texto" | "contador" | "flecha" | "efecto";
  ref?: string; // personaje del reparto
  nombre?: string; // objeto de la biblioteca o efecto
  svg?: string; // objeto dibujado por la IA (SVG centrado en 0,0, ~300 px)
  x?: number; y?: number; escala?: number; rotacion?: number;
  entra?: "pop" | "izq" | "der" | "arriba" | "abajo" | "fundido" | null;
  sale?: boolean;
  en?: number; // momento de entrada (0..1 de la escena)
  hasta?: number; // momento de salida (0..1)
  a?: { x?: number; y?: number; escala?: number; rotacion?: number }; // movimiento a lo largo de la escena
  flotar?: boolean; temblar?: boolean; saltar?: boolean; girar?: number; latir?: boolean;
  texto?: string; tam?: number; color?: string;
  desde?: number; hasta_valor?: number; sufijo?: string; etiqueta?: string; angulo?: number;
  props?: Record<string, any>; // parámetros del objeto o del personaje (expresion, brazo, hablando…)
};
export type EscenaCapas = { fondo: FondoSpec; vista?: "normal" | "periscopio"; elementos: Elemento[]; luz?: "izq" | "der"; atmosfera?: string; primer_plano?: { nombre?: string; svg?: string; x?: number }; eventos?: Evento[] };
export type Reparto = Record<string, Partial<PersonajeProps>>;

const ElementoView: React.FC<{ e: Elemento; dur: number; reparto: Reparto; i: number; luz?: "izq" | "der"; evs?: Evento[]; capa?: "normal" | "brillo" }> = ({ e, dur, reparto, i, luz, evs = [], capa = "normal" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = Math.round((e.en ?? 0) * dur);
  const t1 = e.hasta != null ? Math.round(e.hasta * dur) : dur + 1;
  if (f < t0 || f > t1) return null;
  const est = e.tipo === "personaje" ? estadoPersonaje(e.ref, evs, f, fps, dur) : { props: {}, brilla: null };
  if (capa === "brillo" && !est.brilla) return null;
  if (capa === "normal" && est.brilla) return null;
  const lf = f - t0;
  const sp = spring({ frame: lf, fps, config: { damping: 12, stiffness: 170 } });
  const prog = interpolate(f, [t0, Math.max(t1 === dur + 1 ? dur : t1, t0 + 1)], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  let x = (e.x ?? 540) + ((e.a?.x ?? e.x ?? 540) - (e.x ?? 540)) * prog;
  let y = (e.y ?? 1200) + ((e.a?.y ?? e.y ?? 1200) - (e.y ?? 1200)) * prog;
  let s = (e.escala ?? 1) + ((e.a?.escala ?? e.escala ?? 1) - (e.escala ?? 1)) * prog;
  let r = (e.rotacion ?? 0) + ((e.a?.rotacion ?? e.rotacion ?? 0) - (e.rotacion ?? 0)) * prog;
  let o = 1;
  switch (e.entra) {
    case "pop": s *= interpolate(sp, [0, 1], [0.2, 1]); break;
    case "izq": x += interpolate(sp, [0, 1], [-900, 0]); break;
    case "der": x += interpolate(sp, [0, 1], [900, 0]); break;
    case "arriba": y += interpolate(sp, [0, 1], [-1200, 0]); break;
    case "abajo": y += interpolate(sp, [0, 1], [1200, 0]); break;
    case "fundido": o = interpolate(lf, [0, 8], [0, 1], { extrapolateRight: "clamp" }); break;
  }
  if (e.sale && t1 <= dur) o *= interpolate(f, [t1 - 6, t1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (e.flotar) y += Math.sin((f + i * 13) / 12) * 14;
  if (e.temblar) { x += Math.sin(f * 2.1) * 8; y += Math.cos(f * 1.7) * 6; }
  if (e.saltar) y -= Math.abs(Math.sin((f + i * 7) / 6)) * 50;
  if (e.girar) r += (e.girar * f) / fps;
  if (e.latir) s *= 1 + Math.sin(f / 4) * 0.05;

  if (e.tipo === "personaje") {
    const base = reparto[e.ref ?? ""] ?? {};
    const pp = { luz, ...base, ...(e.props ?? {}), ...est.props, ...(est.brilla ? { brilla: est.brilla } : {}) } as PersonajeProps;
    return (
      <g opacity={o} transform={`translate(${x} ${y}) rotate(${r})`}>
        <Personaje {...pp} x={0} y={0} escala={s} semilla={i} />
      </g>
    );
  }
  if (e.tipo === "texto") {
    return (
      <g opacity={o} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
        <text textAnchor="middle" fontSize={e.tam ?? 90} fontWeight={800} fill={e.color ?? "#fff"} stroke={TINTA} strokeWidth={14} paintOrder="stroke" fontFamily="Fredoka, sans-serif">{e.texto}</text>
      </g>
    );
  }
  if (e.tipo === "contador") {
    return <g opacity={o}><Contador desde={e.desde ?? 0} hasta={e.hasta_valor ?? 100} duracion={Math.max(Math.round((t1 > dur ? dur : t1) - t0) * 0.7, 10)} sufijo={e.sufijo} etiqueta={e.etiqueta} y={y} /></g>;
  }
  if (e.tipo === "flecha") {
    return <g opacity={o}><Flecha x={x} y={y} angulo={e.angulo ?? 0} color={e.color} texto={e.texto} /></g>;
  }
  if (e.tipo === "efecto") {
    if (e.nombre === "explosion") return <Explosion x={x} y={y} inicio={t0} escala={s} />;
    if (e.nombre === "destello") return <rect x={-400} y={-400} width={1880} height={2720} fill="#fff" opacity={interpolate(lf, [0, 2, 10], [0.9, 0.7, 0], { extrapolateRight: "clamp" })} />;
    if (e.nombre === "humo")
      return <g>{[0, 1, 2, 3].map((k) => { const tt = ((f + k * 12) % 48) / 48; return <circle key={k} cx={x + Math.sin(k) * 30 - tt * 60} cy={y - tt * 300} r={40 + tt * 70} fill="#bdbdbd" opacity={0.6 * (1 - tt)} />; })}</g>;
    return null;
  }
  // objeto
  const C = e.nombre ? BIBLIOTECA[e.nombre] : undefined;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {C ? <C {...(e.props ?? {})} id={`o${i}`} inicio={0} /> : e.svg ? <g dangerouslySetInnerHTML={{ __html: limpiarSvg(e.svg) }} /> : (
        <text textAnchor="middle" fontSize={60} fill="#fff" stroke={TINTA} strokeWidth={8} paintOrder="stroke">{e.nombre}</text>
      )}
    </g>
  );
};

export const CapasView: React.FC<{ escena: EscenaCapas; dur: number; reparto: Reparto }> = ({ escena, dur, reparto }) => {
  const cam = React.useContext(CamaraCtx);
  // Paralaje: el decorado se mueve menos que los personajes → sensación de profundidad
  const k = 0.45;
  const fondoT = `translate(540 960) scale(${1 / (1 + (cam.s - 1) * k)}) translate(-540 -960) translate(${-cam.x * k} ${-cam.y * k})`;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elementos = escena.elementos ?? [];
  // Los eventos ligados a un personaje toman su posición (cabeza) si FRAME no la da
  const evs: Evento[] = (escena.eventos ?? []).map((ev) => {
    if (!ev.ref || ev.ref === "todos" || (ev.x != null && ev.y != null)) return ev;
    const el = elementos.find((e) => e.tipo === "personaje" && e.ref === ev.ref);
    if (!el) return ev;
    return { ...ev, x: ev.x ?? el.x ?? 540, y: ev.y ?? (el.y ?? 1200) - CABEZA_Y * (el.escala ?? 1) };
  });
  const ev = transformacionEventos(evs, f, fps, dur);
  const contenido = (
    <g transform={`translate(${ev.tx} ${ev.ty}) translate(${ev.cx} ${ev.cy}) scale(${ev.s}) translate(${-ev.cx} ${-ev.cy})`}>
      <g transform={fondoT}><Fondo f={escena.fondo ?? { tipo: "liso" }} /></g>
      {elementos.map((e, i) => <ElementoView key={i} e={e} dur={dur} reparto={reparto} i={i} luz={escena.luz ?? "izq"} evs={evs} />)}
      <Atmosfera tipo={escena.atmosfera ?? "particulas"} luz={escena.luz ?? "izq"} />
      {escena.primer_plano ? <PrimerPlano p={escena.primer_plano} /> : null}
      <Oscuridad evs={evs} dur={dur} />
      {elementos.map((e, i) => <ElementoView key={"b" + i} e={e} dur={dur} reparto={reparto} i={i} luz={escena.luz ?? "izq"} evs={evs} capa="brillo" />)}
      <EfectosEvento evs={evs} dur={dur} />
    </g>
  );
  if (escena.vista === "periscopio") {
    return (
      <g>
        <rect x={-400} y={-400} width={1880} height={2720} fill="#0b0b0f" />
        <VistaPeriscopio>{contenido}</VistaPeriscopio>
      </g>
    );
  }
  return contenido;
};

// Objeto desenfocado en primer plano (profundidad de campo reducida): grande, en una esquina inferior y con un paralaje mayor
const PrimerPlano: React.FC<{ p: { nombre?: string; svg?: string; x?: number } }> = ({ p }) => {
  const cam = React.useContext(CamaraCtx);
  const C = p.nombre ? BIBLIOTECA[p.nombre] : undefined;
  const x = p.x ?? 120;
  return (
    <g transform={`translate(${x + cam.x * 0.6} ${1880 + cam.y * 0.6}) scale(1.5)`} filter="url(#desenfoque)" opacity={0.95}>
      <defs><filter id="desenfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter></defs>
      {C ? <C id="pp" inicio={0} /> : p.svg ? <g dangerouslySetInnerHTML={{ __html: limpiarSvg(p.svg) }} /> : <ellipse rx={160} ry={110} fill="#3F7A3A" />}
    </g>
  );
};
