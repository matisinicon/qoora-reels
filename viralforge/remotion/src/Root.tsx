import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Short } from "./Short";
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

export const RemotionRoot: React.FC = () => (
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
);
