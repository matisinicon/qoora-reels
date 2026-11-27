import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Short } from "./Short";
import { Historia, HistoriaProps } from "./Historia";
import { Muestra, MuestraProps } from "./Muestra";
import { Portada, PortadaProps } from "./Portada";
import { COLA, FPS, ShortProps } from "./tipos";

const ejemplo: ShortProps = {
  id: "EJEMPLO",
  gancho: "",
  subtitulos: true,
  volumenMusica: 0.12,
  palabras: [],
  voz: "job/voz.mp3",
  musica: null,
  escenas: [],
};

const calcular: CalculateMetadataFunction<ShortProps> = async ({ props }) => {
  const voz = await getAudioDurationInSeconds(staticFile(props.voz));
  return { durationInFrames: Math.ceil((voz + COLA) * FPS), props };
};

const calcularHistoria: CalculateMetadataFunction<HistoriaProps> = async ({ props }) => {
  const voz = await getAudioDurationInSeconds(staticFile(props.voz));
  return { durationInFrames: Math.ceil((voz + COLA) * FPS), props };
};

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Portada" component={Portada} width={1080} height={1920} fps={FPS} durationInFrames={60} defaultProps={{ diseno_portada: { fondo: { tipo: "pueblo_medieval", momento: "atardecer" }, texto: "LO VENDIÓ COMO ORO" } } as PortadaProps} />
  <Composition id="Muestra" component={Muestra} width={1080} height={1920} fps={FPS} durationInFrames={120} defaultProps={{ escena: { desde: 0, hasta: 4, fondo: { tipo: "campo" }, elementos: [] } } as MuestraProps} />
  <Composition
    id="Historia"
    component={Historia}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={300}
    defaultProps={{ id: "EJEMPLO", voz: "job/voz.mp3", musica: null, volumenMusica: 0.1, palabras: [], escenas: [] } as HistoriaProps}
    calculateMetadata={calcularHistoria}
  />
  <Composition
    id="Short"
    component={Short}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={300}
    defaultProps={ejemplo}
    calculateMetadata={calcular}
  />
  </>
);
