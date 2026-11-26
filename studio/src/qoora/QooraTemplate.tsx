/**
 * Plantilla QOORA: estructura tipo de BRAND_DNA.md con los presets de marca.
 * HOOK → REVEAL → PROCESS_STEP → FINAL_FRAME (amplíala con PROBLEM_STACK, RESULT…)
 *
 * Voz: genera la locución con la voz oficial (brand.ts → VOICE) y pásala en `voiceSrc`
 * (archivo en public/), ajustando los tiempos de `phrases` a la toma real.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { C, FONT, MIX } from "./brand";
import { BrandScene, CtaPill, Halo, Mascot, PopIn, Sfx, Signature, Slam, StepLabel, Subtitles, Title } from "./components";

export const qooraTemplateSchema = z.object({
  agentName: z.string(),
  agentTagline: z.string(),
  hookLine: z.string(),
  hookWord: z.string(),
  revealSlogan: z.string(),
  stepTitle: z.string(),
  stepAccent: z.string(),
  voiceSrc: z.string().optional(),
});
export type QooraTemplateProps = z.infer<typeof qooraTemplateSchema>;

export const SCENES = { hook: 2.6, reveal: 3.0, step: 3.4, final: 4.4 };
export const TEMPLATE_SECONDS = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const QooraTemplate: React.FC<QooraTemplateProps> = (p) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        {/* BRAND_HOOK */}
        <Series.Sequence durationInFrames={f(SCENES.hook)} name="BRAND_HOOK">
          <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 700] }} shakeAt={[0.35]}>
            <Signature name={p.agentName} tagline={p.agentTagline} />
            <Title text={p.hookLine} y={520} size={80} />
            <Slam word={p.hookWord} y={660} delay={0.9} />
            <Subtitles phrases={[{ text: `${p.hookLine} ${p.hookWord}`, start: 0.05, end: 2.2 }]} />
          </BrandScene>
          <Sfx name="OPEN" at={0} />
          <Sfx name="POP" at={0.9} />
        </Series.Sequence>

        {/* BRAND_REVEAL */}
        <Series.Sequence durationInFrames={f(SCENES.reveal)} name="BRAND_REVEAL">
          <BrandScene camera={{ preset: "QOORA_PULL_OUT_01", focus: [540, 860] }} shakeAt={[1.0]}>
            <Signature name={p.agentName} tagline={p.agentTagline} />
            <Title text="Así nació" y={300} size={64} color={C.muted} />
            <Halo cx={540} cy={860} r={330} delay={0.2} />
            <Mascot cx={540} baseY={1130} width={520} dropFrom={900} />
            <Title text={p.agentName} y={1170} size={130} delay={0.55} />
            <Title text={p.revealSlogan} y={1330} size={46} delay={0.75} color={C.accent} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="REVEAL" at={0} />
        </Series.Sequence>

        {/* BRAND_PROCESS_STEP */}
        <Series.Sequence durationInFrames={f(SCENES.step)} name="BRAND_PROCESS_STEP">
          <BrandScene camera={{ preset: "QOORA_TILT_IN_R" }}>
            <Signature name={p.agentName} tagline={p.agentTagline} />
            <StepLabel n={1} y={250} />
            <Title text={p.stepTitle} accent={p.stepAccent} y={340} size={78} />
            <Mascot view="tres_cuartos" cx={300} baseY={1250} width={380} jumpAt={1.6} />
            {["Catálogo", "Referencias", "Precio final"].map((label, i) => (
              <PopIn
                key={label}
                delay={0.6 + [0, 0.45, 0.82][i]}
                origin="0% 50%"
                style={{ position: "absolute", left: 560, top: 820 + i * 130 }}
              >
                <div
                  style={{
                    background: C.card,
                    borderRadius: 22,
                    padding: "22px 30px",
                    boxShadow: "0 10px 24px rgba(60,40,20,.16)",
                    fontFamily: FONT.body,
                    fontWeight: 600,
                    fontSize: 36,
                    color: C.ink,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: 7, background: C.ok }} />
                  {label}
                </div>
              </PopIn>
            ))}
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="DING" at={0.6} />
          <Sfx name="DING" at={1.05} />
          <Sfx name="DING" at={1.42} />
        </Series.Sequence>

        {/* BRAND_FINAL_FRAME */}
        <Series.Sequence durationInFrames={f(SCENES.final)} name="BRAND_FINAL_FRAME">
          <BrandScene camera={{ preset: "QOORA_PULL_OUT_02", focus: [540, 700] }} whipOut={false} shakeAt={[0.1, 2.6]}>
            <Signature name={p.agentName} tagline={p.agentTagline} />
            <Halo cx={540} cy={640} r={300} />
            <Mascot cx={540} baseY={880} width={400} jumpAt={2.6} />
            <Title text="¿Quieres uno para" y={960} size={78} delay={0.3} />
            <Title text="tu negocio?" accent="tu negocio?" y={1050} size={92} delay={0.45} />
            <CtaPill y={1230} delay={2.6} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="BOOM" at={0.1} />
          <Sfx name="IMPACT" at={2.6} />
        </Series.Sequence>
      </Series>

      {p.voiceSrc ? <Audio src={staticFile(p.voiceSrc)} volume={MIX.voice} /> : null}
    </AbsoluteFill>
  );
};
