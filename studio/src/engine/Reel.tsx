/**
 * QOORA Reels Engine · composición genérica.
 * Recibe un ReelSpec (guion estructurado + palabras medidas) y monta el Reel completo.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, staticFile, useVideoConfig } from "remotion";
import { C, MIX, VIDEO } from "../qoora/brand";
import { D } from "../presentacion/kit";
import * as Dk from "./scenesDark";
import * as Cr from "./scenesCream";
import { LEAD, reelSpecSchema, ReelSpec, timeline, Timed } from "./spec";

const render = (T: Timed, sig: { name: string; tagline: string }) => {
  const s = T.scene;
  switch (s.type) {
    case "hook_burst": return <Dk.HookBurst T={T} s={s} />;
    case "versus": return <Dk.Versus T={T} s={s} />;
    case "core_reveal": return <Dk.CoreReveal T={T} s={s} />;
    case "system": return <Dk.System T={T} s={s} />;
    case "command_split": return <Dk.CommandSplit T={T} s={s} />;
    case "pipeline": return <Dk.Pipeline T={T} s={s} />;
    case "approval": return <Dk.Approval T={T} s={s} />;
    case "manifesto": return <Dk.Manifesto T={T} s={s} />;
    case "cta_dark": return <Dk.CtaDark T={T} s={s} />;
    case "phone_clip": return <Dk.PhoneClip T={T} s={s} />;
    case "agent_chain": return <Dk.AgentChain T={T} s={s} />;
    case "hook_chat": return <Cr.HookChat T={T} s={s} sig={sig} />;
    case "chips": return <Cr.Chips T={T} s={s} sig={sig} />;
    case "mascot_reveal": return <Cr.MascotReveal T={T} s={s} sig={sig} />;
    case "chat_steps": return <Cr.ChatSteps T={T} s={s} sig={sig} />;
    case "agenda": return <Cr.AgendaScene T={T} s={s} sig={sig} />;
    case "cta_cream": return <Cr.CtaCream T={T} s={s} sig={sig} />;
  }
};

export const Reel: React.FC<{ spec: ReelSpec }> = ({ spec }) => {
  const { fps } = useVideoConfig();
  const { scenes } = timeline(spec);
  const sig = spec.signature ?? { name: "QOORA", tagline: "agentes de IA" };
  return (
    <AbsoluteFill style={{ backgroundColor: spec.line === "dark" ? D.bg : C.bg }}>
      {scenes.map((T, i) => (
        <Sequence key={i} from={Math.round(T.from * fps)} durationInFrames={Math.round((T.from + T.dur) * fps) - Math.round(T.from * fps)} name={`${i + 1} · ${T.scene.type}`}>
          {render(T, sig)}
        </Sequence>
      ))}
      <Sequence from={Math.round(LEAD * fps)} name="Voz oficial">
        <Audio src={staticFile(spec.voice)} volume={MIX.voice} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const reelSchema = reelSpecSchema;
export const calculateReelMetadata: CalculateMetadataFunction<{ spec: ReelSpec }> = ({ props }) => {
  const { total } = timeline(props.spec);
  return { durationInFrames: Math.ceil(total * VIDEO.fps), fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };
};
