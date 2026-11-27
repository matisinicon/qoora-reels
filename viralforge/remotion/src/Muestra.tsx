import React from "react";
import { AbsoluteFill } from "remotion";
import { EscenaKit, EscenaKitView } from "./kit/Escenas";
import { Reparto } from "./kit/Capas";
import "./fuente";

// Vista previa de una escena suelta (para probar el kit sin voz)
export type MuestraProps = { escena: EscenaKit; reparto?: Reparto };
export const Muestra: React.FC<MuestraProps> = ({ escena, reparto }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <EscenaKitView escena={escena} dur={120} reparto={reparto ?? {}} />
  </AbsoluteFill>
);
