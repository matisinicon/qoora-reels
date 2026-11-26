import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Cielo, Interior, Mar } from "./Escenario";
import { Barco, Calendario, Contador, Explosion, Flecha, Submarino, Torpedo, VistaPeriscopio } from "./Objetos";
import { Personaje } from "./Personaje";
import { TINTA } from "./estilo";
import { CapasView, EscenaCapas, Reparto } from "./Capas";

// Catálogo de escenas que FRAME puede pedir. Cada una recibe sus parámetros (p) y dibuja en 1080x1920.
export type EscenaKit = { tipo?: string; desde: number; hasta: number; camara?: string; p?: Record<string, any> } & Partial<EscenaCapas>;

const Texto: React.FC<{ y: number; children: React.ReactNode; tam?: number; color?: string }> = ({ y, children, tam = 90, color = "#fff" }) => (
  <text x={540} y={y} textAnchor="middle" fontSize={tam} fontWeight={800} fill={color} stroke={TINTA} strokeWidth={14} paintOrder="stroke" fontFamily="Fredoka, sans-serif">{children}</text>
);

const Escenas: Record<string, React.FC<{ p: Record<string, any>; dur: number }>> = {
  barco_mar: ({ p, dur }) => {
    const f = useCurrentFrame();
    const avance = interpolate(f, [0, dur], [Number(p.desdeX ?? 520), Number(p.hastaX ?? 560)]) as number;
    return (
      <g>
        <Cielo momento={p.momento} />
        <Mar momento={p.momento} />
        <Barco x={avance} y={1180} escala={p.escala ?? 1} dazzle={p.dazzle ?? 0} espejo={p.espejo} id="bm" />
      </g>
    );
  },
  calendario: ({ p }) => (
    <g>
      <rect x={-400} y={-400} width={1880} height={2720} fill={p.fondo ?? "#F3E3C3"} />
      {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 397) % 1920} r={120} fill="rgba(0,0,0,0.04)" />)}
      <Calendario mes={p.mes ?? "ABRIL"} anio={p.anio ?? "1917"} />
    </g>
  ),
  submarino_acecha: ({ p, dur }) => {
    const f = useCurrentFrame();
    const sube = interpolate(f, [0, dur * 0.6], [0, 1], { extrapolateRight: "clamp" });
    return (
      <g>
        <Cielo momento="noche" horizonte={760} />
        <Mar momento="noche" horizonte={760} />
        <rect x={-400} y={760} width={1880} height={2000} fill="rgba(5,20,50,0.35)" />
        <Submarino x={interpolate(f, [0, dur], [420, 600])} y={1250} escala={1.05} periscopio={sube * 2.6} />
        {p.barcoLejos ? <Barco x={850} y={730} escala={0.25} id="lejos" /> : null}
      </g>
    );
  },
  hundimiento: ({ p, dur }) => {
    const f = useCurrentFrame();
    const impacto = Math.round(dur * 0.35);
    const torpX = interpolate(f, [0, impacto], [-200, 470], { extrapolateRight: "clamp" });
    const hund = interpolate(f, [impacto + 6, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <g>
        <Cielo momento="atardecer" />
        <Mar momento="dia" />
        <Barco x={560} y={1180} escala={0.95} hundido={hund} id="hund" />
        {f < impacto ? <Torpedo x={torpX} y={1330} escala={0.8} /> : null}
        <Explosion x={500} y={1200} inicio={impacto} escala={1.3} />
        {p.contador ? (
          <g opacity={interpolate(f, [impacto, impacto + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <Texto y={520} tam={210} color="#FFD23F">{p.contador}</Texto>
            <Texto y={630} tam={80}>{p.etiqueta}</Texto>
          </g>
        ) : null}
      </g>
    );
  },
  oceano_vacio: ({ dur }) => {
    const f = useCurrentFrame();
    const z = interpolate(f, [0, dur], [1, 0.55]);
    return (
      <g>
        <Cielo momento="dia" horizonte={900} />
        <Mar momento="dia" horizonte={900} />
        <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
          <Barco x={540} y={1150} escala={0.55} id="solo" />
        </g>
        <Flecha x={300} y={1450} angulo={-30} aparece={10} color="#ff6b6b" texto="?" />
        <Flecha x={790} y={1450} angulo={210} aparece={20} color="#ff6b6b" />
      </g>
    );
  },
  personaje_interior: ({ p }) => (
    <g>
      <Interior pared={p.pared} cuadro={p.cuadro ?? true} ventana={p.ventana ?? true} mesa={p.mesa} />
      {p.caballete ? (
        <g transform="translate(220 1500)">
          <path d="M 0 0 L 90 -620 L 180 0 M 90 -620 L 90 0" stroke="#8B5A2B" strokeWidth={22} fill="none" strokeLinecap="round" />
          <rect x={-40} y={-600} width={260} height={320} fill="#fff" stroke={TINTA} strokeWidth={8} />
          <g transform="translate(90 -440) scale(0.22)"><Barco x={0} y={0} dazzle={p.dazzleCuadro ?? 0.6} balanceo={false} id="cuadro" /></g>
        </g>
      ) : null}
      <Personaje x={p.x ?? 640} y={1640} escala={p.escala ?? 1.55} {...(p.personaje ?? {})} />
      {p.rotulo ? <Texto y={360} tam={80}>{p.rotulo}</Texto> : null}
    </g>
  ),
  pintando_barco: ({ p, dur }) => {
    const f = useCurrentFrame();
    const prog = interpolate(f, [4, dur - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <g>
        <Cielo momento="dia" horizonte={1250} />
        <Mar momento="dia" horizonte={1250} />
        <rect x={-400} y={1430} width={1880} height={600} fill="#9a8f7f" stroke={TINTA} strokeWidth={8} />
        <Barco x={540} y={1180} escala={1.05} dazzle={prog} balanceo={false} id="pinta" />
        <Personaje x={180 + prog * 700} y={1700} escala={0.75} brazo="pincel" sombrero="boina" bigote expresion="feliz" piel="#F6CFA8" ropa="#5C6B3A" semilla={2} />
      </g>
    );
  },
  vista_periscopio: ({ p, dur }) => {
    const f = useCurrentFrame();
    const voltea = p.voltear ? Math.floor(f / 14) % 2 === 1 : false;
    return (
      <g>
        <rect x={-400} y={-400} width={1880} height={2720} fill="#0b0b0f" />
        <VistaPeriscopio>
          <Cielo momento={p.momento ?? "dia"} horizonte={950} />
          <Mar momento={p.momento ?? "dia"} horizonte={950} />
          <Barco x={interpolate(f, [0, dur], [480, 600])} y={960} escala={0.62} dazzle={p.dazzle ?? 1} espejo={voltea} id="peri" />
        </VistaPeriscopio>
        {(p.flechas ?? []).map((fl: any, i: number) => <Flecha key={i} {...fl} />)}
        {p.rotulo ? <Texto y={1520} tam={88} color="#FFD23F">{p.rotulo}</Texto> : null}
      </g>
    );
  },
  torpedo_falla: ({ dur }) => {
    const f = useCurrentFrame();
    const tx = interpolate(f, [0, dur * 0.8], [-300, 1400]);
    const bx = interpolate(f, [0, dur], [560, 760]);
    const fallo = f > dur * 0.55;
    return (
      <g>
        <Cielo momento="dia" />
        <Mar momento="dia" />
        <Barco x={bx} y={1150} escala={0.9} dazzle={1} id="falla" />
        <Torpedo x={tx} y={1380} escala={0.85} angulo={-3} />
        {fallo ? <Texto y={560} tam={170} color="#FF5A5A">¡FALLO!</Texto> : null}
      </g>
    );
  },
  flota: ({ p, dur }) => {
    const f = useCurrentFrame();
    const filas = [
      { y: 1010, e: 0.22, n: 6, v: 0.6 },
      { y: 1080, e: 0.32, n: 5, v: 0.9 },
      { y: 1190, e: 0.48, n: 4, v: 1.3 },
      { y: 1360, e: 0.72, n: 3, v: 1.8 },
    ];
    return (
      <g>
        <Cielo momento="atardecer" horizonte={1000} />
        <Mar momento="dia" horizonte={1000} />
        {filas.map((fila, i) =>
          Array.from({ length: fila.n }).map((_, k) => {
            const x = ((k * (1500 / fila.n) + f * fila.v + i * 90) % 1700) - 300;
            return <Barco key={`${i}-${k}`} x={x} y={fila.y} escala={fila.e} dazzle={1} id={`fl${i}${k}`} />;
          })
        )}
        <Contador desde={0} hasta={p.hasta ?? 4000} duracion={Math.round(dur * 0.6)} sufijo="+" etiqueta={p.etiqueta ?? "barcos"} y={520} />
      </g>
    );
  },
};

// Cámara por escena: acercar, alejar, panorámica, temblor; con un pequeño «golpe» al entrar
export const Camara: React.FC<{ tipo?: string; dur: number; children: React.ReactNode }> = ({ tipo = "acercar", dur, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const golpe = spring({ frame: f, fps, config: { damping: 14, stiffness: 220 } });
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  let s = 1, x = 0, y = 0, r = 0;
  if (tipo === "acercar") s = 1 + p * 0.12;
  if (tipo === "alejar") s = 1.14 - p * 0.12;
  if (tipo === "pan_der") { s = 1.08; x = interpolate(p, [0, 1], [40, -40]); }
  if (tipo === "pan_izq") { s = 1.08; x = interpolate(p, [0, 1], [-40, 40]); }
  if (tipo === "temblor") { s = 1.06 + p * 0.05; x = Math.sin(f * 1.7) * 7; y = Math.cos(f * 2.1) * 7; r = Math.sin(f) * 0.3; }
  s *= interpolate(golpe, [0, 1], [1.06, 1]);
  return <g transform={`translate(540 960) scale(${s}) rotate(${r}) translate(${-540 + x} ${-960 + y})`}>{children}</g>;
};

export const EscenaKitView: React.FC<{ escena: EscenaKit; dur: number; reparto?: Reparto }> = ({ escena, dur, reparto = {} }) => {
  const C = escena.tipo && escena.tipo !== "capas" ? Escenas[escena.tipo] : undefined;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Camara tipo={escena.camara} dur={dur}>
        {C ? <C p={escena.p ?? {}} dur={dur} /> : <CapasView escena={{ fondo: escena.fondo ?? { tipo: "liso" }, vista: escena.vista, elementos: escena.elementos ?? [] }} dur={dur} reparto={reparto} />}
      </Camara>
    </svg>
  );
};

export const TIPOS_ESCENA = Object.keys(Escenas);
