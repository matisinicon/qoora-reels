import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, interpolate } from "remotion";
import { EscenaKit, EscenaKitView } from "./kit/Escenas";
import { SubtituloCentral, CajaNarracion } from "./kit/Rotulos";
import "./fuente";
import { Palabra } from "./tipos";
import { Reparto } from "./kit/Capas";

export type Sonido = { t: number; nombre: string; vol: number };
export type Ambiente = { nombre: string; desde: number; hasta: number; vol: number };
export type HistoriaProps = { id: string; voz: string; sonidos?: Sonido[]; ambientes?: Ambiente[]; volumenEfectos?: number; musica: string | null; volumenMusica: number; palabras: Palabra[]; escenas: EscenaKit[]; titulo?: string; reparto?: Reparto; portada?: boolean };

export const Historia: React.FC<HistoriaProps> = (p) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {p.escenas.map((e, i) => {
        const desde = Math.round(e.desde * fps);
        const hasta = i === p.escenas.length - 1 ? durationInFrames : Math.round(e.hasta * fps);
        const dur = Math.max(hasta - desde, 1);
        return (
          <Sequence key={i} from={desde} durationInFrames={dur}>
            <EscenaKitView escena={e} dur={dur} reparto={p.reparto ?? {}} />
          </Sequence>
        );
      })}
      {p.portada ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 220 }}>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 104, lineHeight: 1.08, color: "#fff", WebkitTextStroke: "18px #1d1a2b", paintOrder: "stroke fill", textAlign: "center", padding: "0 70px", textShadow: "0 12px 30px rgba(0,0,0,.45)" }}>
            {p.titulo}
          </div>
        </AbsoluteFill>
      ) : (
        <>
          <SubtituloCentral palabras={p.palabras} />
        </>
      )}
      {p.portada ? null : <Audio src={staticFile(p.voz)} />}
      {p.portada ? null : (p.sonidos ?? []).map((x, i) => (
        <Sequence key={"sfx" + i} from={Math.max(Math.round(x.t * fps), 0)} durationInFrames={Math.round(3 * fps)}>
          <Audio src={staticFile(`sfx/${x.nombre}.mp3`)} volume={Math.min(x.vol * (p.volumenEfectos ?? 1), 1)} />
        </Sequence>
      ))}
      {p.portada ? null : (p.ambientes ?? []).map((a, i) => {
        const desde = Math.round(a.desde * fps);
        const d = Math.max(Math.round((a.hasta - a.desde) * fps), 1);
        return (
          <Sequence key={"amb" + i} from={desde} durationInFrames={d}>
            <Audio src={staticFile(`sfx/${a.nombre}.mp3`)} loop volume={(f) => a.vol * interpolate(f, [0, 12, d - 12, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </Sequence>
        );
      })}
      {p.musica && !p.portada ? (
        // La música baja sola mientras habla la voz y sube en los huecos y al final
        <Audio src={staticFile(p.musica)} loop volume={(f) => {
          const t = f / fps;
          const habla = p.palabras.some((w) => t >= w.s - 0.25 && t <= w.e + 0.35);
          const fin = p.palabras.length ? p.palabras[p.palabras.length - 1].e : 0;
          const base = p.volumenMusica * (t > fin + 0.3 ? 1.6 : habla ? 0.6 : 1);
          return Math.min(base * interpolate(f, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 1);
        }} />
      ) : null}
    </AbsoluteFill>
  );
};
