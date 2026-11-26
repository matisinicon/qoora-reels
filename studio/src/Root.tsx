import { z } from "zod";
import { Composition, continueRender, delayRender, Still } from "remotion";
import { loadBrandFonts, VIDEO } from "./qoora/brand";
import { QooraTemplate, qooraTemplateSchema, TEMPLATE_SECONDS } from "./qoora/QooraTemplate";
import { TURNO_SECONDS, TurnoVideo } from "./turno/TurnoVideo";
import { Presentacion } from "./presentacion/Presentacion";
import { Portada } from "./presentacion/Portada";
import { PortadaRastro } from "./qoora/PortadaRastro";
import { calculateReelMetadata, Reel, reelSchema } from "./engine/Reel";
import presentacionSpec from "../specs/qoora-presentacion.json";
import type { ReelSpec } from "./engine/spec";
import { TOTAL as PRES_SECONDS } from "./presentacion/timeline";

// Las tipografías de la marca se cargan antes de renderizar cualquier fotograma
const fontsHandle = delayRender("Cargando tipografías QOORA");
loadBrandFonts().then(() => continueRender(fontsHandle));

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QOORA-Plantilla"
        component={QooraTemplate}
        schema={qooraTemplateSchema}
        durationInFrames={Math.round(TEMPLATE_SECONDS * VIDEO.fps)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{
          agentName: "RASTRO",
          agentTagline: "agente de compras con IA",
          hookLine: "Este taller perdía",
          hookWord: "HORAS",
          revealSlogan: "No un chatbot. Un agente.",
          stepTitle: "Busca la pieza exacta",
          stepAccent: "exacta",
        }}
      />
      <Composition
        id="TURNO-recepcionista"
        component={TurnoVideo}
        durationInFrames={Math.round(TURNO_SECONDS * VIDEO.fps)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ withVoice: true }}
      />
      <Composition
        id="QOORA-Presentacion"
        component={Presentacion}
        durationInFrames={Math.round(PRES_SECONDS * VIDEO.fps)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Reel"
        component={Reel}
        schema={z.object({ spec: reelSchema })}
        calculateMetadata={calculateReelMetadata}
        durationInFrames={300}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ spec: presentacionSpec as ReelSpec }}
      />
      <Still id="RASTRO-Portada" component={PortadaRastro} width={VIDEO.width} height={VIDEO.height} />
      <Still id="QOORA-Portada" component={Portada} width={VIDEO.width} height={VIDEO.height} />
    </>
  );
};
