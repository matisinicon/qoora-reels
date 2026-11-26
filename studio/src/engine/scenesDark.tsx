/**
 * Escenas de la LÍNEA OSCURA (marca), parametrizadas a partir del vídeo de presentación aprobado.
 * Cada escena recibe su bloque del guion y el reloj de palabras (`T.at("palabra")`).
 */
import React from "react";
import { AbsoluteFill, interpolate, Sequence } from "remotion";
import { EASE, FONT } from "../qoora/brand";
import { BrandScene, Sfx, Subtitles } from "../qoora/components";
import { at, Core, D, DarkBackground, Defs, DrawEdge, DSignature, DTitle, edge, EntryLine, Label, Module, p, Packet, Pt, Pulse, ring, Rings, towards, useT } from "../presentacion/kit";
import type { Scene, Timed } from "./spec";

type S<K extends Scene["type"]> = { T: Timed; s: Extract<Scene, { type: K }>; first?: boolean; last?: boolean };

const SUB_Y = 1300;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
    <Defs />
    {children}
  </svg>
);
const Late: React.FC<{ at: number; children: React.ReactNode }> = ({ at: a, children }) => (
  <Sequence from={Math.max(0, Math.round(a * 30))} layout="none">
    {children}
  </Sequence>
);

/* ---------------------------------------------------------------- gancho: burbuja tachada → explosión de nodos */
export const HookBurst: React.FC<S<"hook_burst">> = ({ T, s }) => {
  const t = useT();
  const c = { x: 540, y: 820 };
  const strike = T.at(s.strikeWord) + 0.15;
  const burst = T.at(s.burstWord);
  const nodes = ring(s.count, c.x, c.y, 270, 270, -90);
  const bubbleOut = 1 - p(t, burst - 0.1, 0.25);
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 820] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.1 + 0.1 * p(t, burst, 0.5)} />} shakeAt={[burst]}>
      <DSignature />
      <DTitle text={s.title} accent={s.accent} y={270} size={70} />
      <Svg>
        <g opacity={bubbleOut * p(t, 0.25, 0.35)}>
          <rect x={300} y={700} width={480} height={170} rx={34} fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <path d="M 360 868 L 340 920 L 410 868" fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <text x={540} y={772} textAnchor="middle" fontFamily={FONT.body} fontWeight={500} fontSize={34} fill="#9a9a9a">
            {s.bubble}
          </text>
          <line x1={290} y1={895} x2={290 + 500 * p(t, strike, 0.25)} y2={895 - 220 * p(t, strike, 0.25)} stroke={D.orange} strokeWidth={8} strokeLinecap="round" />
        </g>
        <circle cx={c.x} cy={c.y} r={10 * p(t, burst - 0.15, 0.2)} fill={D.orange2} />
        <Pulse c={c} start={burst - 0.1} r1={160} />
        {nodes.map((n, i) => {
          const st = burst + Math.sqrt(i) * 0.07;
          const e = edge(towards(c, n, 18), n, 0);
          return (
            <g key={i}>
              <DrawEdge e={e} k={p(t, st, 0.35, EASE.inOut)} hot />
              <circle cx={n.x} cy={n.y} r={26 * p(t, st + 0.3, 0.3, EASE.back)} fill={D.panel} stroke={D.orange} strokeWidth={3} />
              <text x={n.x} y={n.y + 7} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={19} fill="#fff" opacity={p(t, st + 0.4, 0.2)}>
                {String(i + 1).padStart(2, "0")}
              </text>
              <Pulse c={n} start={st + 0.3} r0={26} r1={70} dur={0.7} />
            </g>
          );
        })}
      </Svg>
      <Late at={burst + 0.25}>
        <DTitle text={s.big} accent={s.bigAccent} y={1100} size={110} />
      </Late>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="OPEN" at={0} />
      <Sfx name="POP" at={0.3} />
      <Sfx name="BUZZ" at={strike} />
      <Sfx name="BOOM" at={burst} />
      {nodes.map((_, i) => (
        <Sfx key={i} name="POP" at={burst + 0.32 + Math.sqrt(i) * 0.07} />
      ))}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- comparación A vs B */
export const Versus: React.FC<S<"versus">> = ({ T, s }) => {
  const t = useT();
  const L = 290;
  const R = 690;
  const steps = s.right.steps.map((st, i) => ({ ...st, y: 640 + i * (s.right.steps.length > 3 ? 140 : 180), t: T.at(st.word, 0.6 + i * 0.6) }));
  const badgeT = s.badge ? T.at(s.badge.word, steps[steps.length - 1].t + 0.6) : 0;
  const badgeY = steps[steps.length - 1].y + 110;
  return (
    <BrandScene camera={{ preset: "QOORA_TILT_IN_R" }} bg={D.bg} background={<DarkBackground glow={{ x: 690, y: 820 }} glowA={0.12} />} shakeAt={[steps[steps.length - 1].t]}>
      <DSignature />
      <DTitle text={s.title} accent={s.accent} y={260} size={66} />
      <Svg>
        <EntryLine to={{ x: 490, y: 520 }} />
        <line x1={490} y1={520} x2={490} y2={520 + 640 * p(t, 0.1, 0.6, EASE.inOut)} stroke="#fff" strokeOpacity={0.12} strokeWidth={2} />
        <text x={L} y={540} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={24} letterSpacing={5} fill={D.mute} opacity={p(t, 0.2, 0.3)}>
          {s.left.label}
        </text>
        {s.left.lines.map((txt, i) => (
          <g key={i} opacity={p(t, 0.35 + i * 0.4, 0.3)}>
            <rect x={L - 150} y={610 + i * 120} width={300} height={80} rx={22} fill={i % 2 ? "#1a1a1a" : D.panel} stroke="#333" strokeWidth={2} />
            <text x={L} y={660 + i * 120} textAnchor="middle" fontFamily={FONT.body} fontWeight={500} fontSize={28} fill="#cfcfcf">
              {txt}
            </text>
          </g>
        ))}
        <text x={L} y={650 + s.left.lines.length * 120} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={20} letterSpacing={3} fill={D.mute2} opacity={p(t, 0.4 + s.left.lines.length * 0.4, 0.3)}>
          {s.left.end}
        </text>
        <text x={R} y={540} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={24} letterSpacing={5} fill={D.orange} opacity={p(t, 0.2, 0.3)}>
          {s.right.label}
        </text>
        {steps.map((st, i) => {
          const next = steps[i + 1];
          return (
            <g key={st.label}>
              {next && <DrawEdge e={edge({ x: R, y: st.y + 31 }, { x: R, y: next.y - 31 }, 0)} k={p(t, next.t - 0.25, 0.25)} hot />}
              <Module c={{ x: R, y: st.y }} label={st.label} start={st.t - 0.2} active={st.t} w={290} />
              <Pulse c={{ x: R, y: st.y }} start={st.t} r0={40} r1={140} />
            </g>
          );
        })}
        {s.badge && (
          <g opacity={p(t, badgeT, 0.3)}>
            <rect x={R - 160} y={badgeY - 35} width={320} height={70} rx={35} fill="#1a1006" stroke={D.orange} strokeWidth={2} />
            <circle cx={R - 122} cy={badgeY} r={8} fill={D.ok} opacity={0.6 + 0.4 * Math.sin(t * 8)} />
            <text x={R + 12} y={badgeY + 10} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={28} fill="#fff">
              {s.badge.text}
            </text>
          </g>
        )}
      </Svg>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {s.left.lines.map((_, i) => (
        <Sfx key={`l${i}`} name="POP" at={0.35 + i * 0.4} />
      ))}
      {steps.map((st, i) => (i < steps.length - 1 ? <Sfx key={st.label} name="DING" at={st.t} /> : <Sfx key={st.label} name="BOOM" at={st.t} />))}
      {s.badge && <Sfx name="TICK" at={badgeT} />}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- revelación de marca */
export const CoreReveal: React.FC<S<"core_reveal">> = ({ T, s }) => {
  const t = useT();
  const c = { x: 540, y: 760 };
  const tName = T.at(s.nameWord, 0.6);
  const tTag = T.at(s.taglineWord, tName + 0.8);
  const coreStart = Math.max(0.3, tName - 0.4);
  const parts = s.nameAccent ? s.name.split(s.nameAccent) : [s.name];
  return (
    <BrandScene camera={{ preset: "QOORA_PULL_OUT_01", focus: [540, 760] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.22 * p(t, coreStart, 0.8)} />} shakeAt={[coreStart + 0.45]}>
      <Svg>
        <EntryLine to={{ x: c.x, y: c.y - 100 }} />
        <Rings c={c} radii={[150, 230, 320, 420, 530]} start={coreStart + 0.2} />
        <Core c={c} r={100} start={coreStart} />
        <Pulse c={c} start={coreStart + 0.45} r0={110} r1={420} dur={1.1} />
      </Svg>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.head,
          fontWeight: 700,
          fontSize: 120,
          letterSpacing: interpolate(t, [tName, tName + 0.8], [30, 10], { ...clamp, easing: EASE.out }),
          color: D.white,
          opacity: p(t, tName, 0.5),
        }}
      >
        {parts[0]}
        {s.nameAccent && <span style={{ color: D.orange }}>{s.nameAccent}</span>}
        {parts[1]}
      </div>
      <Label text={s.tagline} y={1170} delay={tTag} />
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="REVEAL" at={Math.max(0, coreStart + 0.45 - 0.95)} />
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- sistema que se construye */
export const System: React.FC<S<"system">> = ({ T, s }) => {
  const t = useT();
  const c: Pt = { x: 480, y: 790 };
  const n = s.modules.length;
  const mods = ring(n, c.x, c.y, 290, 330, -90);
  const modT = s.modules.map((m, i) => T.at(m.word, 0.5 + i * 0.5));
  const tTeam = s.teamWord ? T.at(s.teamWord, 99) : 99;
  const tools = s.tools ?? [];
  const toolPts = ring(Math.max(tools.length, 1), c.x, c.y, 360, 500, -60);
  const tConnect = s.toolsWord ? T.at(s.toolsWord, 99) : 99;
  const toolT = tools.map((x, i) => T.at(x.word, tConnect + 0.5 + i * 0.2) + (i > 0 && tools[i - 1].word === x.word ? i * 0.12 : 0));
  const zoom = tools.length ? interpolate(t, [0, tConnect - 0.2, tConnect + 0.9], [1.08, 1.0, 0.8], { ...clamp, easing: EASE.inOut }) : interpolate(t, [0, T.dur], [1.06, 1], clamp);
  const coreEdges = mods.map((m, i) => edge(towards(c, m, 100), m, i % 2 ? 0.1 : -0.1));
  const peers = mods.map((m, i) => edge(m, mods[(i + 1) % n], -0.18));
  const toolEdges = toolPts.map((tp, i) => edge(mods[i % n], tp, 0.08));
  const titleT = s.titles.map((x, i) => (i === 0 ? 0 : T.at(x.word, 99)));
  return (
    <BrandScene camera={{ preset: "QOORA_SLOW_ZOOM_01", focus: [480, 790] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.14} />} shakeAt={tTeam < 99 ? [tTeam] : []}>
      <DSignature />
      {s.titles.map((x, i) => {
        const end = titleT[i + 1] ?? 999;
        const out = 1 - p(t, end - 0.2, 0.2);
        if (t < titleT[i] - 0.01 || out <= 0) return null;
        return (
          <Late key={x.text} at={titleT[i]}>
            <div style={{ opacity: out }}>
              <DTitle text={x.text} accent={x.accent} y={250} size={66} />
            </div>
          </Late>
        );
      })}
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: `${c.x}px ${c.y}px` }}>
        <Svg>
          <Rings c={c} radii={[130, 220, 460]} start={0} />
          {tools.map((x, i) => {
            const show = p(t, tConnect + 0.3 + i * 0.06, 0.4);
            const solid = t >= toolT[i];
            return (
              <g key={x.label} opacity={show}>
                <DrawEdge e={toolEdges[i]} k={solid ? p(t, toolT[i], 0.3) : 1} hot={solid} dash={!solid} opacity={solid ? 0.9 : 0.35} />
                {solid && <Packet e={toolEdges[i]} start={toolT[i] + 0.3} period={1.4} reverse={i % 2 === 0} />}
              </g>
            );
          })}
          {peers.map((e, i) => (
            <g key={i}>
              <DrawEdge e={e} k={p(t, tTeam + Math.sqrt(i) * 0.12, 0.5, EASE.inOut)} hot opacity={0.55} />
              <Packet e={e} start={tTeam + 0.6 + i * 0.15} period={1.8} travel={1.1} r={4} />
            </g>
          ))}
          {coreEdges.map((e, i) => (
            <g key={i}>
              <DrawEdge e={e} k={p(t, modT[i] - 0.3, 0.35, EASE.inOut)} hot={t >= modT[i]} />
              <Packet e={e} start={modT[i] + 0.4} period={2 + (i % 3) * 0.3} />
            </g>
          ))}
          <Core c={c} r={86} start={0} />
          {modT.map((m, i) => (
            <Pulse key={i} c={c} start={m - 0.05} r0={90} r1={150} dur={0.6} />
          ))}
          {mods.map((m, i) => (
            <g key={s.modules[i].label}>
              <Module c={m} label={s.modules[i].label} start={modT[i] - 0.05} active={modT[i]} />
              <Pulse c={m} start={modT[i]} r0={50} r1={130} />
            </g>
          ))}
          {tools.map((x, i) => (
            <Module key={x.label} c={toolPts[i]} label={x.label} start={tConnect + 0.3 + i * 0.06} active={toolT[i]} />
          ))}
          {tTeam < 99 && <Pulse c={c} start={tTeam} r0={90} r1={520} dur={1.2} />}
        </Svg>
      </AbsoluteFill>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {modT.map((m, i) => (
        <Sfx key={i} name="POP" at={m} />
      ))}
      {tTeam < 99 && <Sfx name="REWARD" at={tTeam} />}
      {tConnect < 99 && <Sfx name="WHOOSH" at={tConnect} />}
      {toolT.slice(0, 3).map((x, i) => (
        <Sfx key={`t${i}`} name="DING" at={x} />
      ))}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- una orden → acciones */
export const CommandSplit: React.FC<S<"command_split">> = ({ T, s }) => {
  const t = useT();
  const chars = Math.floor(interpolate(t, [0.1, 0.6], [0, s.command.length], clamp));
  const tSplit = Math.max(0.7, T.at(s.word, 1.2) - 0.6);
  const src = { x: 540, y: 600 };
  const outs = [
    { x: 320, y: 900 },
    { x: 740, y: 900 },
    { x: 320, y: 1090 },
    { x: 740, y: 1090 },
  ];
  const delays = [0, 0.05, 0.2, 0.25];
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 760] }} bg={D.bg} background={<DarkBackground glow={{ x: 540, y: 760 }} glowA={0.1} />}>
      <DSignature />
      <DTitle text={s.title} accent={s.accent} y={250} size={66} />
      <Svg>
        <EntryLine to={{ x: 540, y: 500 }} from={{ x: -40, y: 500 }} />
        <g opacity={p(t, 0.05, 0.25)}>
          <rect x={150} y={500} width={780} height={100} rx={24} fill={D.panel} stroke={D.orange} strokeWidth={2} />
          <text x={190} y={562} fontFamily={FONT.body} fontWeight={500} fontSize={34} fill="#fff">
            <tspan fill={D.orange}>›</tspan> {s.command.slice(0, chars)}
            {t < 0.7 && Math.floor(t * 4) % 2 === 0 ? "▍" : ""}
          </text>
        </g>
        {outs.map((o, i) => {
          const e = i < 2 ? edge(src, { x: o.x, y: o.y - 32 }, o.x < 540 ? 0.1 : -0.1) : edge({ x: outs[i - 2].x, y: outs[i - 2].y + 32 }, { x: o.x, y: o.y - 32 }, 0);
          const st = tSplit + delays[i];
          return (
            <g key={i}>
              <DrawEdge e={e} k={p(t, st, 0.4, EASE.inOut)} hot />
              <Packet e={e} start={st + 0.5} period={1.2} travel={0.6} />
              <Module c={o} label={s.actions[i]} start={st + 0.3} active={st + 0.4} w={300} />
            </g>
          );
        })}
      </Svg>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {[0.12, 0.24, 0.36, 0.48].map((x) => (
        <Sfx key={x} name="TYPE" at={x} />
      ))}
      <Sfx name="CLICK" at={0.65} />
      {delays.map((d) => (
        <Sfx key={d} name="POP" at={tSplit + 0.3 + d} />
      ))}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- de manual a proceso */
export const Pipeline: React.FC<S<"pipeline">> = ({ T, s }) => {
  const t = useT();
  const tAuto = T.at(s.word, 1);
  const xs = [130, 370, 610, 850];
  const y = 900;
  const run = p(t, tAuto - 0.1, 1.4, (x) => x);
  const line = edge({ x: xs[0], y }, { x: xs[3], y }, 0);
  const head = at(line, run);
  return (
    <BrandScene camera={{ preset: "QOORA_TILT_IN_L" }} bg={D.bg} background={<DarkBackground glow={{ x: 500, y: 900 }} glowA={0.1} />}>
      <DSignature />
      <DTitle text={s.title} accent={s.accent} y={250} size={64} />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, fontFamily: FONT.body, fontWeight: 700, fontSize: 26, letterSpacing: 4 }}>
        <span style={{ color: t < tAuto ? "#fff" : D.mute2, textDecoration: t >= tAuto ? "line-through" : undefined }}>{s.from}</span>
        <span style={{ color: D.mute2 }}>→</span>
        <span style={{ color: t >= tAuto ? D.orange : D.mute2 }}>{s.to}</span>
      </div>
      <Svg>
        <EntryLine to={{ x: xs[0], y }} from={{ x: -40, y }} />
        <line x1={xs[0]} y1={y} x2={xs[3]} y2={y} stroke="#fff" strokeOpacity={0.12} strokeWidth={3} strokeDasharray="6 10" />
        <DrawEdge e={line} k={run} hot width={4} />
        {run > 0 && run < 1 && <circle cx={head.x} cy={head.y} r={10} fill={D.orange2} />}
        {s.steps.map((a, i) => {
          const done = run >= i / 3 - 0.001 && t >= tAuto - 0.1;
          return (
            <g key={a}>
              <circle cx={xs[i]} cy={y} r={48} fill={done ? "#1a1006" : D.panel} stroke={done ? D.orange : "#333"} strokeWidth={3} />
              <text x={xs[i]} y={y + 12} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={32} fill={done ? D.orange2 : D.mute2}>
                {done ? "✓" : `0${i + 1}`}
              </text>
              <text x={xs[i]} y={y + 100} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={19} letterSpacing={2} fill={done ? "#fff" : D.mute}>
                {a}
              </text>
              {done && <Pulse c={{ x: xs[i], y }} start={tAuto - 0.1 + (1.4 * i) / 3} r0={48} r1={110} dur={0.6} />}
            </g>
          );
        })}
      </Svg>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="DING" at={tAuto - 0.1 + (1.4 * i) / 3} />
      ))}
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- aprobación humana */
export const Approval: React.FC<S<"approval">> = ({ T, s }) => {
  const t = useT();
  const tProp = T.at(s.proposeWord, 0.8);
  const tOk = T.at(s.approveWord, tProp + 1.2);
  const A = { x: 540, y: 560 };
  const P = { x: 540, y: 790 };
  const U = { x: 540, y: 1030 };
  const ok = t >= tOk;
  const press = t >= tOk - 0.12 && t < tOk + 0.1 ? 0.95 : 1;
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 800] }} bg={D.bg} background={<DarkBackground glow={U} glowA={0.12 * p(t, tOk, 0.4) + 0.06} />} shakeAt={[tOk]}>
      <DSignature />
      <DTitle text={s.title} accent={s.accent} y={250} size={72} />
      <Svg>
        <EntryLine to={{ x: A.x, y: A.y - 30 }} />
        <Module c={A} label="AGENTE" start={0.1} active={0.2} w={220} />
        <DrawEdge e={edge({ x: A.x, y: A.y + 30 }, { x: P.x, y: P.y - 60 }, 0)} k={p(t, tProp - 0.35, 0.35, EASE.inOut)} hot />
        <g opacity={p(t, tProp - 0.05, 0.3)}>
          <rect x={P.x - 280} y={P.y - 60} width={560} height={120} rx={22} fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <text x={P.x - 250} y={P.y - 14} fontFamily={FONT.body} fontWeight={700} fontSize={19} letterSpacing={3} fill={D.orange}>
            PROPUESTA
          </text>
          <text x={P.x - 250} y={P.y + 30} fontFamily={FONT.body} fontWeight={500} fontSize={30} fill="#fff">
            {s.proposal}
          </text>
        </g>
        <DrawEdge e={edge({ x: P.x, y: P.y + 60 }, { x: U.x, y: U.y - 70 }, 0)} k={p(t, tProp + 0.25, 0.35, EASE.inOut)} hot={ok} />
        <g opacity={p(t, tProp + 0.5, 0.3)}>
          <circle cx={U.x - 170} cy={U.y} r={46} fill={D.panel} stroke={ok ? D.orange : "#444"} strokeWidth={3} />
          <circle cx={U.x - 170} cy={U.y - 12} r={13} fill="none" stroke="#ddd" strokeWidth={3} />
          <path d={`M ${U.x - 194} ${U.y + 26} Q ${U.x - 170} ${U.y + 2} ${U.x - 146} ${U.y + 26}`} fill="none" stroke="#ddd" strokeWidth={3} />
          <text x={U.x - 170} y={U.y + 86} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={20} letterSpacing={3} fill={D.mute}>
            TÚ
          </text>
          <g transform={`translate(${U.x + 90} ${U.y}) scale(${press}) translate(${-(U.x + 90)} ${-U.y})`}>
            <rect x={U.x - 60} y={U.y - 42} width={300} height={84} rx={42} fill={ok ? D.ok : D.orange} />
            <text x={U.x + 90} y={U.y + 11} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={30} letterSpacing={2} fill="#050505">
              {ok ? "APROBADO ✓" : "APROBAR"}
            </text>
          </g>
          {ok && <Pulse c={{ x: U.x + 90, y: U.y }} start={tOk} r0={60} r1={200} color={D.ok} />}
        </g>
        <g opacity={p(t, tOk + 0.25, 0.3)}>
          <DrawEdge e={edge({ x: U.x + 90, y: U.y + 45 }, { x: U.x + 90, y: U.y + 150 }, 0)} k={p(t, tOk + 0.2, 0.3)} hot />
          <Module c={{ x: U.x + 90, y: U.y + 185 }} label={s.result} start={tOk + 0.4} active={tOk + 0.5} w={260} />
        </g>
      </Svg>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="POP" at={tProp} />
      <Sfx name="CLICK" at={tOk - 0.12} />
      <Sfx name="REWARD" at={tOk} />
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- manifiesto */
export const Manifesto: React.FC<S<"manifesto">> = ({ T, s }) => {
  const t = useT();
  const tBuild = T.at(s.word, T.dur * 0.5);
  const c = { x: 540, y: 820 };
  const conv = p(t, 0, tBuild, EASE.inOut);
  const pts = ring(12, c.x, c.y, 470, 470, -90);
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 820] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.08 + 0.14 * p(t, tBuild, 0.5)} />} shakeAt={[tBuild]}>
      <DSignature />
      <Svg>
        {pts.map((q, i) => {
          const x = q.x + (c.x - q.x) * conv * 0.72;
          const y = q.y + (c.y - q.y) * conv * 0.72;
          return (
            <g key={i}>
              <line x1={c.x} y1={c.y} x2={x} y2={y} stroke={D.orange} strokeOpacity={0.5 * p(t, tBuild, 0.4)} strokeWidth={2} />
              <rect x={x - 14} y={y - 14} width={28} height={28} rx={6} fill={D.panel} stroke={t >= tBuild ? D.orange : "#444"} strokeWidth={2} transform={`rotate(${(1 - conv) * 45} ${x} ${y})`} />
            </g>
          );
        })}
        <Core c={c} r={70} start={tBuild - 0.3} />
        <Pulse c={c} start={tBuild} r0={80} r1={480} dur={1.1} />
      </Svg>
      <DTitle text={s.line1} y={1080} size={70} color="#BDBDBD" />
      <Late at={tBuild}>
        <DTitle text={s.line2} accent={s.accent} y={1170} size={78} />
      </Late>
      {s.en && <Label text={s.en} y={460} delay={tBuild + 0.3} />}
      <Subtitles phrases={T.phrases} y={SUB_Y + 90} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="RISER" at={Math.max(0, tBuild - 1.0)} />
      <Sfx name="BOOM" at={tBuild} />
    </BrandScene>
  );
};

/* ---------------------------------------------------------------- cierre oscuro */
export const CtaDark: React.FC<S<"cta_dark">> = ({ T, s }) => {
  const t = useT();
  const tCta = T.at(s.ctaWord, T.dur - 1.5);
  const c = { x: 540, y: 640 };
  return (
    <BrandScene camera={{ preset: "QOORA_PULL_OUT_02", focus: [540, 700] }} whipOut={false} bg={D.bg} background={<DarkBackground glow={c} glowA={0.2} />} shakeAt={[tCta]}>
      <Svg>
        <Rings c={c} radii={[140, 210, 290]} start={0.1} />
        <Core c={c} r={96} start={0} />
      </Svg>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center", fontFamily: FONT.head, fontWeight: 700, fontSize: 84, letterSpacing: 8, color: "#fff", opacity: p(t, 0.3, 0.4) }}>
        QOORA <span style={{ color: D.orange }}>AI</span>
      </div>
      <DTitle text={s.question} accent={s.accent} y={980} size={58} delay={0.4} />
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: D.orange,
            color: "#050505",
            borderRadius: 60,
            padding: "24px 56px",
            fontFamily: FONT.head,
            fontWeight: 700,
            fontSize: 54,
            opacity: t < tCta ? 0 : 1,
            scale: String(interpolate(t, [tCta, tCta + 0.35], [0, 1], { ...clamp, easing: EASE.back })),
          }}
        >
          Comenta AGENTE
        </div>
      </div>
      <Subtitles phrases={T.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="BOOM" at={0.1} />
      <Sfx name="IMPACT" at={tCta} />
    </BrandScene>
  );
};
