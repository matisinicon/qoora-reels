import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Escena } from "./Escena";
import { Subtitulos } from "./Subtitulos";
import { Gancho } from "./Gancho";
import { ShortProps, TRANSICION } from "./tipos";

const EFECTOS = ["acercar", "pan_der", "temblor", "pan_izq", "subir", "golpe", "alejar"];

// Reparte la duración total entre escenas en proporción a lo planificado
export function repartir(escenas: ShortProps["escenas"], totalFrames: number): number[] {
  const n = escenas.length;
  const util = totalFrames + (n - 1) * TRANSICION;
  const suma = escenas.reduce((a, e) => a + e.duracion, 0);
  const frames = escenas.map((e) => Math.max(Math.round((e.duracion / suma) * util), TRANSICION * 2 + 6));
  frames[n - 1] += util - frames.reduce((a, b) => a + b, 0);
  return frames;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transicion(i: number): any {
  const t = [fade(), slide({ direction: "from-right" }), wipe({ direction: "from-left" }), fade(), slide({ direction: "from-bottom" })];
  return t[i % t.length];
}

export const Short: React.FC<ShortProps> = (p) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const frames = repartir(p.escenas, durationInFrames);
  const cierre = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {p.escenas.flatMap((e, i) => {
          const items = [
            <TransitionSeries.Sequence key={`e${i}`} durationInFrames={frames[i]}>
              <Escena escena={e} indice={i} efecto={e.efecto || EFECTOS[i % EFECTOS.length]} />
            </TransitionSeries.Sequence>,
          ];
          if (i < p.escenas.length - 1) {
            items.push(
              <TransitionSeries.Transition key={`t${i}`} presentation={transicion(i)} timing={linearTiming({ durationInFrames: TRANSICION })} />
            );
          }
          return items;
        })}
      </TransitionSeries>
      {p.gancho ? <Gancho texto={p.gancho} /> : null}
      {p.subtitulos ? <Subtitulos palabras={p.palabras} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: cierre }} />
      <Audio src={staticFile(p.voz)} />
      {p.musica ? <Audio src={staticFile(p.musica)} volume={p.volumenMusica} loop /> : null}
    </AbsoluteFill>
  );
};
