/**
 * QOORA AI · "La recepcionista que nunca duerme" (demo del agente TURNO)
 * Brand DNA v1.0 · presets: HOOK → PROBLEM_STACK → REVEAL → PROCESS_STEP ×3 → RESULT → FINAL_FRAME
 * Los tiempos de cada escena y de cada frase salen de `timeline.ts` (alineados con la toma de voz).
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, random, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT, MIX } from "../qoora/brand";
import {
  BrandScene,
  CtaPill,
  Halo,
  Mascot,
  PopIn,
  Sfx,
  Signature,
  Slam,
  StepLabel,
  Subtitles,
  Title,
} from "../qoora/components";
import { LEAD, SCENES, TOTAL, VOICE_FILE } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SIG = { name: "TURNO", tagline: "recepcionista con IA · demo" };

/* ------------------------------------------------------------------ piezas */

/** Auriculares de TURNO, dibujados sobre la mascota de la familia RASTRO (coords. 1028×929) */
export const Headset: React.FC = () => (
  <svg viewBox="0 0 1028 929" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
    <path d="M 62 330 C 40 -95, 988 -95, 966 330" fill="none" stroke={C.ink} strokeWidth={38} strokeLinecap="round" />
    <path d="M 62 330 C 40 -95, 988 -95, 966 330" fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round" strokeDasharray="0 0" opacity={0.9} />
    <rect x={-6} y={290} width={120} height={230} rx={44} fill={C.ink} />
    <rect x={18} y={318} width={72} height={174} rx={30} fill={C.accent} />
    <rect x={914} y={290} width={120} height={230} rx={44} fill={C.ink} />
    <rect x={938} y={318} width={72} height={174} rx={30} fill={C.accent} />
    <path d="M 960 500 C 930 640, 760 640, 650 560" fill="none" stroke={C.ink} strokeWidth={20} strokeLinecap="round" />
    <rect x={590} y={530} width={84} height={56} rx={28} fill={C.ink} />
  </svg>
);

export const Turno: React.FC<Omit<React.ComponentProps<typeof Mascot>, "accessory" | "name" | "view">> = (p) => (
  <Mascot {...p} name="RASTRO" view="frente" accessory={<Headset />} />
);

/** QOORA_STAMP_01 */
export const Stamp: React.FC<{ text: string; cx: number; cy: number; at: number; color?: string }> = ({ text, cx, cy, at, color = C.bad }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - at;
  if (t < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        translate: "-50% -50%",
        rotate: "-11deg",
        scale: String(interpolate(t, [0, 0.18], [2.4, 1], { ...clamp, easing: EASE.out })),
        opacity: interpolate(t, [0, 0.12], [0, 1], clamp),
        border: `14px solid ${color}`,
        borderRadius: 26,
        padding: "18px 40px",
        color,
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: 84,
        whiteSpace: "nowrap",
        background: "rgba(250,247,242,.85)",
      }}
    >
      {text}
    </div>
  );
};

/** QOORA_CONFETTI */
export const Confetti: React.FC<{ at: number; cx: number; cy: number; n?: number; seed?: string }> = ({ at, cx, cy, n = 70, seed = "c" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dt = frame / fps - at;
  if (dt < 0 || dt > 2.2) return null;
  const colors = [C.accent, C.ok, C.confetti, C.ink, "#FF8C78"];
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = -Math.PI * (0.05 + 0.9 * random(`${seed}a${i}`));
        const v = 700 + 800 * random(`${seed}v${i}`);
        const x = cx + Math.cos(ang) * v * dt * 0.8;
        const y = cy + Math.sin(ang) * v * dt + 1500 * dt * dt;
        if (y > 1920) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 18,
              height: 10,
              borderRadius: 3,
              background: colors[i % colors.length],
              rotate: `${dt * 600 * (random(`${seed}r${i}`) - 0.5)}deg`,
            }}
          />
        );
      })}
    </>
  );
};

/** Móvil genérico (chat ficticio, sin marcas de terceros) */
export const Phone: React.FC<{ x: number; y: number; w?: number; h?: number; title: string; time: string; children: React.ReactNode }> = ({
  x,
  y,
  w = 600,
  h = 860,
  title,
  time,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 64,
      background: C.ink,
      padding: 16,
      boxShadow: "0 30px 60px rgba(60,40,20,.22)",
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 50, background: "#F3EEE6", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          height: 120,
          background: C.card,
          borderBottom: `2px solid ${C.line}`,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 30px 18px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: C.accentSoft, display: "grid", placeItems: "center", fontSize: 28 }}>✂️</div>
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</span>
        </div>
        <span style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 26, color: C.muted }}>{time}</span>
      </div>
      <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
    </div>
  </div>
);

export const Bubble: React.FC<{ at: number; me?: boolean; children: React.ReactNode; tone?: "ok" }> = ({ at, me, children, tone }) => (
  <PopIn delay={at} origin={me ? "100% 100%" : "0% 100%"} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "82%" }}>
    <div
      style={{
        background: tone === "ok" ? C.okSoft : me ? "#FFE3C8" : C.card,
        color: C.ink,
        borderRadius: 26,
        borderBottomRightRadius: me ? 6 : 26,
        borderBottomLeftRadius: me ? 26 : 6,
        padding: "18px 24px",
        fontFamily: FONT.body,
        fontWeight: 500,
        fontSize: 30,
        lineHeight: 1.3,
        boxShadow: "0 4px 10px rgba(60,40,20,.08)",
      }}
    >
      {children}
    </div>
  </PopIn>
);

export const Typing: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < from || t > to) return null;
  return (
    <div style={{ alignSelf: "flex-end", background: "#FFE3C8", borderRadius: 26, padding: "18px 26px", display: "flex", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: C.accent,
            translate: `0px ${-6 * Math.max(0, Math.sin((t - from) * 10 - i * 0.8))}px`,
          }}
        />
      ))}
    </div>
  );
};

/** Chip que cae torcido (BRAND_PROBLEM_STACK) */
export const Chip: React.FC<{ at: number; x: number; y: number; rot: number; dot: string; children: React.ReactNode }> = ({ at, x, y, rot, dot, children }) => (
  <PopIn delay={at} style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg` }}>
    <div
      style={{
        background: C.card,
        borderRadius: 22,
        padding: "20px 30px",
        boxShadow: "0 10px 24px rgba(60,40,20,.14)",
        fontFamily: FONT.body,
        fontWeight: 600,
        fontSize: 38,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        gap: 16,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: 8, background: dot }} />
      {children}
    </div>
  </PopIn>
);

/** Agenda del día con huecos que cambian de estado */
export type Slot = { time: string; who: string; state: "ok" | "cancel" | "empty" | "filled" };
export const Agenda: React.FC<{ x: number; y: number; slots: (t: number) => Slot[] }> = ({ x, y, slots }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const list = slots(frame / fps);
  const style: Record<Slot["state"], { bg: string; fg: string; label: string }> = {
    ok: { bg: C.card, fg: C.ink, label: "" },
    cancel: { bg: C.badSoft, fg: C.bad, label: "CANCELADA" },
    empty: { bg: "#F1ECE4", fg: C.muted, label: "HUECO LIBRE" },
    filled: { bg: C.okSoft, fg: C.ok, label: "RESERVADO ✓" },
  };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 640,
        background: C.card,
        borderRadius: 34,
        padding: 30,
        boxShadow: "0 20px 44px rgba(60,40,20,.16)",
      }}
    >
      <div style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 34, color: C.ink, marginBottom: 18 }}>Agenda · mañana</div>
      {list.map((s) => (
        <div
          key={s.time}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "18px 20px",
            marginTop: 10,
            borderRadius: 18,
            background: style[s.state].bg,
          }}
        >
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.ink, width: 100 }}>{s.time}</span>
          <span
            style={{
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 30,
              color: style[s.state].fg,
              flex: 1,
              textDecoration: s.state === "cancel" ? "line-through" : undefined,
            }}
          >
            {s.who}
          </span>
          <span style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 22, color: style[s.state].fg }}>{style[s.state].label}</span>
        </div>
      ))}
    </div>
  );
};

export const Moon: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y + 8 * Math.sin(frame / 20), fontSize: 110 }}>
      🌙
    </div>
  );
};

/** Reloj que gira rápido (noche que pasa) */
export const Clock: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y }}>
      <circle cx={50} cy={50} r={44} fill={C.card} stroke={C.ink} strokeWidth={6} />
      <line x1={50} y1={50} x2={50} y2={22} stroke={C.ink} strokeWidth={6} strokeLinecap="round" style={{ transformOrigin: "50px 50px", rotate: `${frame * 2}deg` }} />
      <line x1={50} y1={50} x2={50} y2={12} stroke={C.accent} strokeWidth={4} strokeLinecap="round" style={{ transformOrigin: "50px 50px", rotate: `${frame * 24}deg` }} />
    </svg>
  );
};

/* ------------------------------------------------------------------ escenas */

const sceneSubs = (key: keyof typeof SCENES) => SCENES[key].phrases;

export const TurnoVideo: React.FC<{ withVoice: boolean }> = ({ withVoice }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const S = SCENES;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        {/* 1 · BRAND_HOOK */}
        <Series.Sequence durationInFrames={f(S.hook.dur)} name="BRAND_HOOK">
          <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 760] }} shakeAt={[0.35, S.hook.dur - 1.2]}>
            <Signature {...SIG} />
            <Moon x={860} y={190} />
            <Title text="Son las" y={230} size={72} />
            <Slam word="23:47" y={310} delay={0.35} size={170} />
            <Phone x={240} y={560} h={760} title="Salón Nácar" time="23:47">
              <Bubble at={0.9}>¡Hola! ¿Tenéis hueco mañana por la tarde? 🙏</Bubble>
              <PopIn delay={1.6} style={{ alignSelf: "flex-start" }}>
                <span style={{ fontFamily: FONT.body, fontSize: 24, color: C.muted }}>Visto ✓✓ · sin respuesta</span>
              </PopIn>
            </Phone>
            <Stamp text="SIN RESPUESTA" cx={540} cy={1180} at={S.hook.dur - 1.2} />
            <Subtitles phrases={sceneSubs("hook")} />
          </BrandScene>
          <Sfx name="OPEN" at={0} />
          <Sfx name="POP" at={0.9} />
          <Sfx name="TICK" at={1.6} />
          <Sfx name="BUZZ" at={S.hook.dur - 1.2} />
        </Series.Sequence>

        {/* 2 · BRAND_PROBLEM_STACK */}
        <Series.Sequence durationInFrames={f(S.problem.dur)} name="BRAND_PROBLEM_STACK">
          <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 900] }}>
            <Signature {...SIG} />
            <Title text="Cada noche pasa lo mismo" accent="lo mismo" y={260} size={76} />
            <Clock x={800} y={420} size={150} />
            <Chip at={0.8} x={110} y={520} rot={-4} dot={C.bad}>3 llamadas perdidas</Chip>
            <Chip at={1.3} x={330} y={680} rot={3} dot={C.amber}>“Te digo mañana…”</Chip>
            <Chip at={2.0} x={140} y={850} rot={-2} dot={C.bad}>Cancelación 11:00</Chip>
            <Chip at={3.8} x={380} y={1010} rot={4} dot={C.muted}>Hueco vacío 17:00</Chip>
            <Chip at={0.3} x={170} y={1170} rot={-3} dot={C.bad}>Mensaje sin contestar</Chip>
            <Subtitles phrases={sceneSubs("problem")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          {[0.3, 0.8, 1.3, 2.0, 3.8].map((t) => (
            <Sfx key={t} name="POP" at={t} />
          ))}
        </Series.Sequence>

        {/* 3 · BRAND_REVEAL */}
        <Series.Sequence durationInFrames={f(S.reveal.dur)} name="BRAND_REVEAL">
          <BrandScene camera={{ preset: "QOORA_PULL_OUT_01", focus: [540, 860] }} shakeAt={[2.35]}>
            <Signature {...SIG} />
            <Title text="Por eso diseñamos…" y={280} size={64} color={C.muted} />
            <Halo cx={540} cy={860} r={340} delay={0.2} />
            <Confetti at={2.35} cx={540} cy={1000} seed="rev" />
            <Sequence from={Math.round(1.9 * fps)} layout="none" name="TURNO cae">
              <Turno cx={540} baseY={1130} width={500} dropFrom={900} />
            </Sequence>
            <Title text="TURNO" y={1180} size={140} delay={2.3} />
            <Title text="No un chatbot. Un agente." y={1345} size={46} delay={2.6} color={C.accent} />
            <Subtitles phrases={sceneSubs("reveal")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="REVEAL" at={1.4} />
        </Series.Sequence>

        {/* 4 · BRAND_PROCESS_STEP · responde y reserva */}
        <Series.Sequence durationInFrames={f(S.step1.dur)} name="PASO 01 · responde y reserva">
          <BrandScene camera={{ preset: "QOORA_TILT_IN_R" }}>
            <Signature {...SIG} />
            <StepLabel n={1} y={220} />
            <Title text="Responde al momento" accent="al momento" y={300} size={74} />
            <Phone x={330} y={470} h={900} w={640} title="Salón Nácar" time="23:47">
              <Bubble at={0}>¡Hola! ¿Tenéis hueco mañana por la tarde? 🙏</Bubble>
              <Typing from={0.3} to={0.9} />
              <Bubble at={0.9} me>
                ¡Hola, Laura! Mañana tengo libre a las <b>17:00</b> o a las <b>18:30</b>. ¿Cuál te va mejor?
              </Bubble>
              <Bubble at={2.0}>¡17:00 perfecto!</Bubble>
              <Bubble at={S.step1.reserved} me tone="ok">
                ✅ Reservado: mañana a las 17:00. ¡Te espero!
              </Bubble>
            </Phone>
            <Turno cx={190} baseY={1360} width={260} jumpAt={S.step1.reserved} />
            <Subtitles phrases={sceneSubs("step1")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          {[0.35, 0.5, 0.65, 0.8].map((t) => (
            <Sfx key={t} name="TYPE" at={t} />
          ))}
          <Sfx name="POP" at={0.9} />
          <Sfx name="POP" at={2.0} />
          <Sfx name="DING" at={S.step1.reserved} />
        </Series.Sequence>

        {/* 5 · BRAND_PROCESS_STEP · cancelación */}
        <Series.Sequence durationInFrames={f(S.step2.dur)} name="PASO 02 · cancelación">
          <BrandScene camera={{ preset: "QOORA_TILT_IN_L" }} shakeAt={[S.step2.cancel]}>
            <Signature {...SIG} />
            <StepLabel n={2} y={220} />
            <Title text="¿Alguien cancela?" accent="cancela?" y={300} size={84} />
            <Agenda
              x={220}
              y={520}
              slots={(t) => [
                { time: "10:00", who: "Ana", state: "ok" },
                { time: "11:00", who: "Marta", state: t > S.step2.cancel ? "cancel" : "ok" },
                { time: "12:30", who: "Sara", state: "ok" },
                { time: "17:00", who: "Laura", state: "ok" },
              ]}
            />
            <Turno cx={540} baseY={1400} width={300} />
            <Subtitles phrases={sceneSubs("step2")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="BUZZ" at={S.step2.cancel} />
        </Series.Sequence>

        {/* 6 · BRAND_PROCESS_STEP · lista de espera */}
        <Series.Sequence durationInFrames={f(S.step3.dur)} name="PASO 03 · lista de espera">
          <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 900] }} shakeAt={[S.step3.fill]}>
            <Signature {...SIG} />
            <StepLabel n={3} y={220} />
            <Title text="Avisa a la lista de espera" accent="lista de espera" y={300} size={70} />
            {["Lucía", "Carmen", "Irene"].map((n, i) => (
              <PopIn key={n} delay={0.4 + [0, 0.4, 0.75][i]} origin="0% 50%" style={{ position: "absolute", left: 130, top: 520 + i * 120 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    background: C.card,
                    borderRadius: 22,
                    padding: "16px 26px",
                    boxShadow: "0 8px 18px rgba(60,40,20,.12)",
                    fontFamily: FONT.body,
                    fontWeight: 600,
                    fontSize: 32,
                    color: C.ink,
                  }}
                >
                  <span
                    style={{ width: 48, height: 48, borderRadius: 24, background: C.accentSoft, display: "grid", placeItems: "center", fontSize: 24, fontWeight: 700 }}
                  >
                    {n[0]}
                  </span>
                  {n} · <span style={{ color: C.muted, fontWeight: 500 }}>aviso enviado</span>
                </div>
              </PopIn>
            ))}
            <PopIn delay={S.step3.fill - 0.5} origin="100% 100%" style={{ position: "absolute", right: 110, top: 900 }}>
              <div
                style={{
                  background: "#FFE3C8",
                  borderRadius: 26,
                  borderBottomRightRadius: 6,
                  padding: "18px 26px",
                  fontFamily: FONT.body,
                  fontWeight: 600,
                  fontSize: 32,
                  color: C.ink,
                }}
              >
                Lucía: “¡Sí, lo quiero!” 🙌
              </div>
            </PopIn>
            <Agenda
              x={120}
              y={1020}
              slots={(t) => [{ time: "11:00", who: t > S.step3.fill ? "Lucía" : "—", state: t > S.step3.fill ? "filled" : "empty" }]}
            />
            <Turno cx={910} baseY={1420} width={230} jumpAt={S.step3.fill} />
            <Subtitles phrases={sceneSubs("step3")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          {[0.4, 0.8, 1.15].map((t) => (
            <Sfx key={t} name="POP" at={t} />
          ))}
          <Sfx name="CLICK" at={S.step3.fill - 0.5} />
          <Sfx name="REWARD" at={S.step3.fill} />
        </Series.Sequence>

        {/* 7 · BRAND_RESULT */}
        <Series.Sequence durationInFrames={f(S.result.dur)} name="BRAND_RESULT">
          <BrandScene camera={{ preset: "QOORA_PULL_OUT_02", focus: [540, 900] }} shakeAt={[0.6]}>
            <Signature {...SIG} />
            <Moon x={880} y={120} />
            <Title text="Mientras tú duermes…" y={250} size={70} />
            <Title text="tu agenda trabaja" accent="trabaja" y={340} size={84} delay={0.15} />
            <Agenda
              x={220}
              y={520}
              slots={() => [
                { time: "10:00", who: "Ana", state: "filled" },
                { time: "11:00", who: "Lucía", state: "filled" },
                { time: "12:30", who: "Sara", state: "filled" },
                { time: "17:00", who: "Laura", state: "filled" },
              ]}
            />
            <Confetti at={0.6} cx={540} cy={900} seed="res" />
            <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", fontFamily: FONT.body, fontSize: 26, color: C.muted }}>
              Demo ilustrativa · así funcionaría un agente como TURNO
            </div>
            <Subtitles phrases={sceneSubs("result")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="REWARD" at={0.6} />
        </Series.Sequence>

        {/* 8 · BRAND_FINAL_FRAME */}
        <Series.Sequence durationInFrames={f(S.final.dur)} name="BRAND_FINAL_FRAME">
          <BrandScene camera={{ preset: "QOORA_PULL_OUT_02", focus: [540, 700] }} whipOut={false} shakeAt={[0.1, S.final.cta]}>
            <Signature {...SIG} />
            <Halo cx={540} cy={640} r={300} />
            <Turno cx={540} baseY={880} width={400} jumpAt={S.final.cta} />
            <Title text="¿Quieres uno para" y={960} size={78} delay={0.3} />
            <Title text="tu negocio?" accent="tu negocio?" y={1050} size={92} delay={0.45} />
            <CtaPill y={1230} delay={S.final.cta} />
            <Subtitles phrases={sceneSubs("final")} />
          </BrandScene>
          <Sfx name="WHOOSH" at={0} />
          <Sfx name="BOOM" at={0.1} />
          <Sfx name="IMPACT" at={S.final.cta} />
        </Series.Sequence>
      </Series>

      {withVoice ? (
        <Sequence from={Math.round(LEAD * fps)} name="Voz oficial · Manu Arias">
          <Audio src={staticFile(VOICE_FILE)} volume={MIX.voice} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const TURNO_SECONDS = TOTAL;
