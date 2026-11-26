import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { EscenaKit, EscenaKitView } from "./kit/Escenas";
import { SubtituloCentral, CajaNarracion } from "./kit/Rotulos";
import "./fuente";
import { Palabra } from "./tipos";
import { Reparto } from "./kit/Capas";

export type Sonido = { t: number; nombre: string; vol: number };
export type HistoriaProps = { id: string; voz: string; sonidos?: Sonido[]; volumenEfectos?: number; musica: string | null; volumenMusica: number; palabras: Palabra[]; escenas: EscenaKit[]; titulo?: string; reparto?: Reparto; portada?: boolean };

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
          <CajaNarracion palabras={p.palabras} />
          <SubtituloCentral palabras={p.palabras} />
        </>
      )}
      {p.portada ? null : <Audio src={staticFile(p.voz)} />}
      {p.portada ? null : (p.sonidos ?? []).map((x, i) => (
        <Sequence key={"sfx" + i} from={Math.max(Math.round(x.t * fps), 0)} durationInFrames={Math.round(3 * fps)}>
          <Audio src={staticFile(`sfx/${x.nombre}.mp3`)} volume={Math.min(x.vol * (p.volumenEfectos ?? 1), 1)} />
        </Sequence>
      ))}
      {p.musica ? <Audio src={staticFile(p.musica)} volume={p.volumenMusica} loop /> : null}
    </AbsoluteFill>
  );
};
