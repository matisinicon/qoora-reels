/**
 * Escenas de la LÍNEA DE CASOS (crema), parametrizadas a partir de RASTRO y TURNO.
 */
import React from "react";
import { Sequence } from "remotion";
import { C, FONT } from "../qoora/brand";
import { BrandScene, CtaPill, Halo, Mascot, PopIn, Sfx, Signature, Slam, StepLabel, Subtitles, Title } from "../qoora/components";
import { Agenda, Bubble, Chip, Confetti, Headset, Phone, Stamp, Typing } from "../turno/TurnoVideo";
import type { Scene, Timed } from "./spec";

type S<K extends Scene["type"]> = { T: Timed; s: Extract<Scene, { type: K }>; sig: { name: string; tagline: string } };

const SUB_Y = 1442;
const tone = { bad: C.bad, warn: C.amber, neutral: C.muted, ok: C.ok } as const;

const Agent: React.FC<{ headset?: boolean } & Omit<React.ComponentProps<typeof Mascot>, "accessory" | "name" | "view">> = ({ headset, ...p }) => (
  <Mascot {...p} name="RASTRO" view="frente" accessory={headset ? <Headset /> : undefined} />
);

/* ---------------------------------------------------------------- gancho: chat sin respuesta */
export const HookChat: React.FC<S<"hook_chat">> = ({ T, s, sig }) => {
  const tStamp = T.at(s.stampWord, T.dur - 1.2);
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 760] }} shakeAt={[0.35, tStamp]}>
      <Signature {...sig} />
      <Title text={s.pre} y={230} size={72} />
      <Slam word={s.slam} y={310} delay={0.35} size={170} />
      <Phone x={240} y={560} h={760} title={s.business} time={s.time}>
        <Bubble at={0.9}>{s.message}</Bubble>
        <PopIn delay={1.6} style={{ alignSelf: "flex-start" }}>
          <span style={{ fontFamily: FONT.body, fontSize: 24, color: C.muted }}>Visto ✓✓ · sin respuesta</span>
        </PopIn>
      </Phone>
      <Stamp text={s.stamp} cx={540} cy={1180} at={tStamp} />
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="OPEN" at={0} />
      <Sfx name="POP" at={0.9} />
      <Sfx name="TICK" at={1.6} />
      <Sfx name="BUZZ" at={tStamp} />
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- problema en capas */
export const Chips: React.FC<S<"chips">> = ({ T, s, sig }) => {
  const pos = [
    { x: 110, y: 520, r: -4 },
    { x: 330, y: 680, r: 3 },
    { x: 140, y: 850, r: -2 },
    { x: 380, y: 1010, r: 4 },
    { x: 170, y: 1170, r: -3 },
  ];
  const ts = s.chips.map((c, i) => T.at(c.word, 0.3 + i * 0.5));
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 900] }}>
      <Signature {...sig} />
      <Title text={s.title} accent={s.accent} y={260} size={76} />
      {s.chips.map((c, i) => (
        <Chip key={c.text} at={ts[i]} x={pos[i].x} y={pos[i].y} rot={pos[i].r} dot={tone[c.tone]}>
          {c.text}
        </Chip>
      ))}
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="WHOOSH" at={0} />
      {ts.map((t, i) => (
        <Sfx key={i} name="POP" at={t} />
      ))}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- presentación del agente */
export const MascotReveal: React.FC<S<"mascot_reveal">> = ({ T, s, sig }) => {
  const tName = T.at(s.nameWord, 0.6);
  const drop = Math.max(0.2, tName - 0.4);
  return (
    <BrandScene camera={{ preset: "QOORA_PULL_OUT_01", focus: [540, 860] }} shakeAt={[drop + 0.45]}>
      <Signature {...sig} />
      <Title text={s.pre} y={280} size={64} color={C.muted} />
      <Halo cx={540} cy={860} r={340} delay={0.2} />
      <Confetti at={drop + 0.45} cx={540} cy={1000} seed={s.name} />
      <Sequence from={Math.round(drop * 30)} layout="none">
        <Agent headset={s.headset} cx={540} baseY={1130} width={500} dropFrom={900} />
      </Sequence>
      <Title text={s.name} y={1180} size={140} delay={drop + 0.4} />
      <Title text={s.slogan} y={1345} size={46} delay={drop + 0.65} color={C.accent} />
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="REVEAL" at={Math.max(0, drop + 0.45 - 0.95)} />
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- conversación paso a paso */
export const ChatSteps: React.FC<S<"chat_steps">> = ({ T, s, sig }) => {
  const ts = s.messages.map((m, i) => T.at(m.word, 0.2 + i * 0.8));
  const lastAgent = s.messages.findIndex((m) => m.ok);
  const jump = lastAgent >= 0 ? ts[lastAgent] : undefined;
  return (
    <BrandScene camera={{ preset: s.step % 2 ? "QOORA_TILT_IN_R" : "QOORA_TILT_IN_L" }}>
      <Signature {...sig} />
      <StepLabel n={s.step} y={220} />
      <Title text={s.title} accent={s.accent} y={300} size={74} />
      <Phone x={330} y={470} h={900} w={640} title={s.business} time={s.time}>
        {s.messages.map((m, i) => (
          <React.Fragment key={i}>
            {m.from === "agent" && <Typing from={Math.max(0, ts[i] - 0.6)} to={ts[i]} />}
            <Bubble at={ts[i]} me={m.from === "agent"} tone={m.ok ? "ok" : undefined}>
              {m.text}
            </Bubble>
          </React.Fragment>
        ))}
      </Phone>
      <Agent headset cx={190} baseY={1360} width={260} jumpAt={jump} />
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="WHOOSH" at={0} />
      {s.messages.map((m, i) =>
        m.from === "agent" ? (
          <React.Fragment key={i}>
            {[0.45, 0.3, 0.15].map((d) => (
              <Sfx key={d} name="TYPE" at={Math.max(0, ts[i] - d)} />
            ))}
            <Sfx name={m.ok ? "DING" : "POP"} at={ts[i]} />
          </React.Fragment>
        ) : (
          <Sfx key={i} name="POP" at={ts[i]} />
        ),
      )}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- agenda / tabla de estado */
export const AgendaScene: React.FC<S<"agenda">> = ({ T, s, sig }) => {
  const ts = s.slots.map((x) => (x.word ? T.at(x.word, 99) : 99));
  const changes = ts.filter((x) => x < 99);
  return (
    <BrandScene camera={{ preset: s.confetti ? "QOORA_PULL_OUT_02" : "QOORA_PUSH_IN_01", focus: [540, 900] }} shakeAt={changes}>
      <Signature {...sig} />
      {s.step && <StepLabel n={s.step} y={220} />}
      <Title text={s.title} accent={s.accent} y={s.step ? 300 : 260} size={76} />
      <Agenda
        x={220}
        y={520}
        slots={(t) =>
          s.slots.map((x, i) => {
            const changed = x.becomes && t >= ts[i];
            return { time: x.time, who: changed && x.whoAfter ? x.whoAfter : x.who, state: changed ? x.becomes! : x.state };
          })
        }
      />
      {s.confetti && <Confetti at={0.6} cx={540} cy={900} seed={s.title} />}
      {s.note && <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", fontFamily: FONT.body, fontSize: 26, color: C.muted }}>{s.note}</div>}
      <Agent headset cx={880} baseY={1390} width={240} jumpAt={changes[changes.length - 1]} />
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="WHOOSH" at={0} />
      {s.slots.map((x, i) => (ts[i] < 99 ? <Sfx key={i} name={x.becomes === "cancel" ? "BUZZ" : x.becomes === "filled" ? "REWARD" : "DING"} at={ts[i]} /> : null))}
      {s.confetti && <Sfx name="REWARD" at={0.6} />}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- cierre crema */
export const CtaCream: React.FC<S<"cta_cream">> = ({ T, s, sig }) => {
  const tCta = T.at(s.ctaWord, T.dur - 1.5);
  return (
    <BrandScene camera={{ preset: "QOORA_PULL_OUT_02", focus: [540, 700] }} whipOut={false} shakeAt={[0.1, tCta]}>
      <Signature {...sig} />
      <Halo cx={540} cy={640} r={300} />
      <Agent headset={s.name !== "RASTRO"} cx={540} baseY={880} width={400} jumpAt={tCta} />
      <Title text="¿Quieres uno para" y={960} size={78} delay={0.3} />
      <Title text="tu negocio?" accent="tu negocio?" y={1050} size={92} delay={0.45} />
      <CtaPill y={1230} delay={tCta} />
      <Subtitles phrases={T.phrases} y={SUB_Y} />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="BOOM" at={0.1} />
      <Sfx name="IMPACT" at={tCta} />
    </BrandScene>
  );
};
