/**
 * QOORA AI · Vídeo de presentación (línea corporativa oscura)
 * Narrativa: un sistema que se construye delante del espectador —
 * punto → núcleo → agentes → equipo → herramientas → órdenes → procesos → control humano → manifiesto.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, Series, staticFile, useVideoConfig } from "remotion";
import { EASE, FONT, MIX } from "../qoora/brand";
import { BrandScene, Sfx, Subtitles } from "../qoora/components";
import {
  at,
  Core,
  D,
  DarkBackground,
  Defs,
  DrawEdge,
  DSignature,
  DTitle,
  edge,
  EntryLine,
  Label,
  Module,
  p,
  Packet,
  Pt,
  Pulse,
  ring,
  Rings,
  towards,
  useT,
} from "./kit";
import { HAS_VOICE, LEAD, S, V, VOICE_FILE, wordTime } from "./timeline";

const SUB_Y = 1300;
const W = 1080;
const H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }}>
    <Defs />
    {children}
  </svg>
);

/** Ventana de visibilidad para titulares que se sustituyen dentro de una escena */
const Swap: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = useT();
  const out = to === undefined ? 1 : 1 - p(t, to - 0.2, 0.2);
  if (t < from - 0.01 || out <= 0) return null;
  return (
    <Sequence from={Math.round(from * 30)} layout="none">
      <div style={{ opacity: out }}>{children}</div>
    </Sequence>
  );
};

/* ================================================================== 1 · GANCHO */
const Hook: React.FC = () => {
  const t = useT();
  const sc = S.hook;
  const c = { x: 540, y: 820 };
  const strike = sc.rel(wordTime(0, "chatbot")) + 0.15;
  const burst = sc.rel(wordTime(1, "seis"));
  const nodes = ring(6, c.x, c.y, 270, 270, -90);
  const bubbleOut = 1 - p(t, burst - 0.1, 0.25);
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 820] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.1 + 0.1 * p(t, burst, 0.5)} />} shakeAt={[burst]}>
      <DSignature />
      <DTitle text="Tu empresa no necesita otro chatbot." accent="chatbot." y={270} size={70} />
      <Svg>
        {/* Burbuja de chatbot que se descarta */}
        <g opacity={bubbleOut * p(t, 0.25, 0.35)}>
          <rect x={300} y={700} width={480} height={170} rx={34} fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <path d="M 360 868 L 340 920 L 410 868" fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <text x={540} y={772} textAnchor="middle" fontFamily={FONT.body} fontWeight={500} fontSize={34} fill="#9a9a9a">
            ¿En qué puedo ayudarte?
          </text>
          <text x={540} y={826} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={20} letterSpacing={4} fill={D.mute2}>
            CHATBOT
          </text>
          <line x1={290} y1={895} x2={290 + 500 * p(t, strike, 0.25)} y2={895 - 220 * p(t, strike, 0.25)} stroke={D.orange} strokeWidth={8} strokeLinecap="round" />
        </g>
        {/* El punto se convierte en 6 agentes */}
        <circle cx={c.x} cy={c.y} r={10 * p(t, burst - 0.15, 0.2)} fill={D.orange2} />
        <Pulse c={c} start={burst - 0.1} r1={160} />
        {nodes.map((n, i) => {
          const s = burst + [0, 0.05, 0.09, 0.12, 0.14, 0.16][i];
          const e = edge(towards(c, n, 18), n, 0);
          return (
            <g key={i}>
              <DrawEdge e={e} k={p(t, s, 0.35, EASE.inOut)} hot />
              <circle cx={n.x} cy={n.y} r={26 * p(t, s + 0.3, 0.3, EASE.back)} fill={D.panel} stroke={D.orange} strokeWidth={3} />
              <text x={n.x} y={n.y + 7} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={19} fill="#fff" opacity={p(t, s + 0.4, 0.2)}>
                0{i + 1}
              </text>
              <Pulse c={n} start={s + 0.3} r0={26} r1={70} dur={0.7} />
            </g>
          );
        })}
      </Svg>
      <Sequence from={Math.round((burst + 0.25) * 30)} layout="none">
        <DTitle text="6 agentes" accent="6" y={1100} size={110} />
      </Sequence>
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="OPEN" at={0} />
      <Sfx name="POP" at={0.3} />
      <Sfx name="BUZZ" at={strike} />
      <Sfx name="BOOM" at={burst} />
      {[0.32, 0.37, 0.41, 0.44, 0.46, 0.48].map((d) => (
        <Sfx key={d} name="POP" at={burst + d} />
      ))}
    </BrandScene>
  );
};

/* ================================================================== 2 · CHATBOT vs AGENTE */
const Versus: React.FC = () => {
  const t = useT();
  const sc = S.versus;
  const tInv = sc.rel(wordTime(3, "investiga"));
  const tDec = sc.rel(wordTime(3, "decide"));
  const tAct = sc.rel(wordTime(3, "actúa"));
  const tNight = sc.rel(wordTime(4, "tres"));
  const L = { x: 290 };
  const R = { x: 690 };
  const steps = [
    { label: "INVESTIGA", y: 640, t: tInv },
    { label: "DECIDE", y: 820, t: tDec },
    { label: "ACTÚA", y: 1000, t: tAct },
  ];
  return (
    <BrandScene camera={{ preset: "QOORA_TILT_IN_R" }} bg={D.bg} background={<DarkBackground glow={{ x: 690, y: 820 }} glowA={0.12} />} shakeAt={[tAct]}>
      <DSignature />
      <DTitle text="Contestar no es trabajar." accent="trabajar." y={260} size={66} />
      <Svg>
        <EntryLine to={{ x: 490, y: 520 }} />
        <line x1={490} y1={520} x2={490} y2={520 + 640 * p(t, 0.1, 0.6, EASE.inOut)} stroke="#fff" strokeOpacity={0.12} strokeWidth={2} />
        {/* CHATBOT: pregunta → respuesta → fin */}
        <text x={L.x} y={540} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={24} letterSpacing={5} fill={D.mute} opacity={p(t, 0.2, 0.3)}>
          CHATBOT
        </text>
        {[
          { y: 650, txt: "¿Horario?", s: 0.35 },
          { y: 770, txt: "De 9 a 18 h.", s: 0.75 },
        ].map((b, i) => (
          <g key={i} opacity={p(t, b.s, 0.3)}>
            <rect x={L.x - 150} y={b.y - 40} width={300} height={80} rx={22} fill={i ? "#1a1a1a" : D.panel} stroke="#333" strokeWidth={2} />
            <text x={L.x} y={b.y + 10} textAnchor="middle" fontFamily={FONT.body} fontWeight={500} fontSize={28} fill="#cfcfcf">
              {b.txt}
            </text>
          </g>
        ))}
        <text x={L.x} y={920} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={22} letterSpacing={4} fill={D.mute2} opacity={p(t, 1.2, 0.3)}>
          FIN DE LA CONVERSACIÓN
        </text>
        {/* AGENTE: investiga → decide → actúa */}
        <text x={R.x} y={540} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={24} letterSpacing={5} fill={D.orange} opacity={p(t, 0.2, 0.3)}>
          AGENTE
        </text>
        {steps.map((s, i) => {
          const next = steps[i + 1];
          return (
            <g key={s.label}>
              {next && <DrawEdge e={edge({ x: R.x, y: s.y + 30 }, { x: R.x, y: next.y - 30 }, 0)} k={p(t, next.t - 0.25, 0.25)} hot />}
              <Module c={{ x: R.x, y: s.y }} label={s.label} start={s.t - 0.2} active={s.t} w={280} />
              <Pulse c={{ x: R.x, y: s.y }} start={s.t} r0={40} r1={140} />
            </g>
          );
        })}
        {/* 03:00 — el agente sigue activo */}
        <g opacity={p(t, tNight, 0.3)}>
          <rect x={R.x - 150} y={1110} width={300} height={70} rx={35} fill="#1a1006" stroke={D.orange} strokeWidth={2} />
          <circle cx={R.x - 112} cy={1145} r={8} fill={D.ok} opacity={0.6 + 0.4 * Math.sin(t * 8)} />
          <text x={R.x + 12} y={1155} textAnchor="middle" fontFamily={FONT.body} fontWeight={700} fontSize={28} fill="#fff">
            03:00 · ACTIVO
          </text>
        </g>
      </Svg>
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="POP" at={0.35} />
      <Sfx name="POP" at={0.75} />
      <Sfx name="DING" at={tInv} />
      <Sfx name="DING" at={tDec} />
      <Sfx name="BOOM" at={tAct} />
      <Sfx name="TICK" at={tNight} />
    </BrandScene>
  );
};

/* ================================================================== 3 · REVELACIÓN */
const Reveal: React.FC = () => {
  const t = useT();
  const sc = S.reveal;
  const c = { x: 540, y: 760 };
  const tName = sc.rel(V[5][1]);
  const tTag = sc.rel(wordTime(6, "Ingeniería"));
  const coreStart = Math.max(0.3, tName - 0.4);
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
        QOORA <span style={{ color: D.orange }}>AI</span>
      </div>
      <Label text="INGENIERÍA DE INTELIGENCIA AGÉNTICA" y={1170} delay={tTag} />
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="REVEAL" at={coreStart + 0.45 - 0.95} />
    </BrandScene>
  );
};

/* ================================================================== 4 · EL SISTEMA (agentes → equipo → herramientas) */
const AGENTS = ["INVESTIGACIÓN", "DATOS", "ESTRATEGIA", "OPERACIONES", "ATENCIÓN", "AUTOMATIZACIÓN"];
const AGENT_WORDS = ["Investigación", "Datos", "Estrategia", "Operaciones", "Atención", "Automatización"];
const TOOLS = [
  { label: "CRM", word: "CRM" },
  { label: "BASE DE DATOS", word: "bases" },
  { label: "EMAIL", word: "herramientas" },
  { label: "CALENDARIO", word: "herramientas" },
  { label: "DOCUMENTOS", word: "herramientas" },
  { label: "APIs", word: "herramientas" },
];

const System: React.FC = () => {
  const t = useT();
  const sc = S.system;
  const c: Pt = { x: 480, y: 790 };
  const mods = ring(6, c.x, c.y, 290, 330, -90);
  const tools = ring(6, c.x, c.y, 360, 500, -60);
  const tTeam = sc.rel(V[9][1]);
  const tConnect = sc.rel(V[10][1]);
  const tAgentsTitle = 0;
  const modT = AGENT_WORDS.map((w) => sc.rel(wordTime(8, w)));
  const toolT = TOOLS.map((x, i) => sc.rel(wordTime(11, x.word)) + (x.word === "herramientas" ? (i - 2) * 0.12 : 0));
  // Cámara interna: se acerca al construir y se aleja para mostrar las herramientas
  const zoom = interpolate(t, [0, tConnect - 0.2, tConnect + 0.9], [1.08, 1.0, 0.8], { ...clamp, easing: EASE.inOut });
  const coreEdges = mods.map((m, i) => edge(towards(c, m, 100), m, i % 2 ? 0.1 : -0.1));
  const peers = mods.map((m, i) => edge(m, mods[(i + 1) % 6], -0.18));
  const toolEdges = tools.map((tp, i) => edge(mods[i], tp, 0.08));
  const teamDelays = [0, 0.1, 0.18, 0.24, 0.28, 0.31];

  return (
    <BrandScene camera={{ preset: "QOORA_SLOW_ZOOM_01", focus: [500, 790] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.14} />} shakeAt={[tTeam]}>
      <DSignature />
      <Swap from={tAgentsTitle} to={tTeam}>
        <DTitle text="Agentes especializados" accent="especializados" y={250} size={68} />
      </Swap>
      <Swap from={tTeam} to={tConnect}>
        <DTitle text="Trabajan como un equipo" accent="un equipo" y={250} size={68} />
      </Swap>
      <Swap from={tConnect}>
        <DTitle text="Conectados a lo que ya usas" accent="ya usas" y={250} size={64} />
      </Swap>
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: `${c.x}px ${c.y}px` }}>
        <Svg>
          <Rings c={c} radii={[130, 220, 460]} start={0} />
          {/* Fase 3: herramientas */}
          {tools.map((tp, i) => {
            const show = p(t, tConnect + 0.3 + i * 0.06, 0.4);
            const solid = t >= toolT[i];
            return (
              <g key={TOOLS[i].label} opacity={show}>
                <DrawEdge e={toolEdges[i]} k={solid ? p(t, toolT[i], 0.3) : 1} hot={solid} dash={!solid} opacity={solid ? 0.9 : 0.35} />
                {solid && <Packet e={toolEdges[i]} start={toolT[i] + 0.3} period={1.4} reverse={i % 2 === 0} />}
              </g>
            );
          })}
          {/* Fase 2: colaboración entre agentes */}
          {peers.map((e, i) => (
            <g key={i}>
              <DrawEdge e={e} k={p(t, tTeam + teamDelays[i], 0.5, EASE.inOut)} hot opacity={0.55} />
              <Packet e={e} start={tTeam + 0.6 + i * 0.15} period={1.8} travel={1.1} r={4} />
            </g>
          ))}
          {/* Fase 1: núcleo → agentes, uno por palabra */}
          {coreEdges.map((e, i) => (
            <g key={AGENTS[i]}>
              <DrawEdge e={e} k={p(t, modT[i] - 0.3, 0.35, EASE.inOut)} hot={t >= modT[i]} />
              <Packet e={e} start={modT[i] + 0.4} period={2 + (i % 3) * 0.3} />
            </g>
          ))}
          <Core c={c} r={86} start={0} />
          {coreEdges.map((_, i) => (
            <Pulse key={i} c={c} start={modT[i] - 0.05} r0={90} r1={150} dur={0.6} />
          ))}
          {mods.map((m, i) => (
            <g key={AGENTS[i]}>
              <Module c={m} label={AGENTS[i]} start={modT[i] - 0.05} active={modT[i]} />
              <Pulse c={m} start={modT[i]} r0={50} r1={130} />
            </g>
          ))}
          {tools.map((tp, i) => (
            <Module key={TOOLS[i].label} c={tp} label={TOOLS[i].label} start={tConnect + 0.3 + i * 0.06} active={toolT[i]} />
          ))}
          <Pulse c={c} start={tTeam} r0={90} r1={520} dur={1.2} />
        </Svg>
      </AbsoluteFill>
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {modT.map((m, i) => (
        <Sfx key={i} name="POP" at={m} />
      ))}
      <Sfx name="REWARD" at={tTeam} />
      <Sfx name="WHOOSH" at={tConnect} />
      {TOOLS.map((x, i) => (i < 3 ? <Sfx key={x.label} name="DING" at={toolT[i]} /> : null))}
    </BrandScene>
  );
};

/* ================================================================== 5 · UNA ORDEN → ACCIONES */
const ACTIONS = ["BUSCAR DATOS", "ANALIZAR", "REDACTAR", "ENVIAR"];
const Order: React.FC = () => {
  const t = useT();
  const sc = S.order;
  const cmd = "Prepara el informe semanal";
  const chars = Math.floor(interpolate(t, [0.1, 0.6], [0, cmd.length], clamp));
  const tSplit = Math.max(0.7, sc.rel(wordTime(12, "acciones")) - 0.6);
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
      <DTitle text="Una orden. Varias acciones." accent="Varias acciones." y={250} size={66} />
      <Svg>
        <EntryLine to={{ x: 540, y: 500 }} from={{ x: -40, y: 500 }} />
        <g opacity={p(t, 0.05, 0.25)}>
          <rect x={150} y={500} width={780} height={100} rx={24} fill={D.panel} stroke={D.orange} strokeWidth={2} />
          <text x={190} y={562} fontFamily={FONT.body} fontWeight={500} fontSize={34} fill="#fff">
            <tspan fill={D.orange}>›</tspan> {cmd.slice(0, chars)}
            {t < 0.7 && Math.floor(t * 4) % 2 === 0 ? "▍" : ""}
          </text>
        </g>
        {outs.map((o, i) => {
          // La orden se divide en dos ramas y cada rama continúa hacia abajo (buscar → redactar, analizar → enviar)
          const from = i < 2 ? src : { x: outs[i - 2].x, y: outs[i - 2].y + 32 };
          const e = i < 2 ? edge(src, { x: o.x, y: o.y - 32 }, o.x < 540 ? 0.1 : -0.1) : edge(from, { x: o.x, y: o.y - 32 }, 0);
          const s = tSplit + delays[i];
          return (
            <g key={ACTIONS[i]}>
              <DrawEdge e={e} k={p(t, s, 0.4, EASE.inOut)} hot />
              <Packet e={e} start={s + 0.5} period={1.2} travel={0.6} />
              <Module c={o} label={ACTIONS[i]} start={s + 0.3} active={s + 0.4} w={300} />
            </g>
          );
        })}
      </Svg>
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
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

/* ================================================================== 6 · MANUAL → PROCESO AUTOMÁTICO */
const Process: React.FC = () => {
  const t = useT();
  const sc = S.process;
  const tAuto = sc.rel(wordTime(13, "proceso"));
  const xs = [170, 410, 650, 890].map((x) => x - 40);
  const y = 900;
  const run = p(t, tAuto - 0.1, 1.4, (x) => x);
  const line = edge({ x: xs[0], y }, { x: xs[3], y }, 0);
  const head = at(line, run);
  return (
    <BrandScene camera={{ preset: "QOORA_TILT_IN_L" }} bg={D.bg} background={<DarkBackground glow={{ x: 500, y: 900 }} glowA={0.1} />}>
      <DSignature />
      <DTitle text="De tarea manual a proceso" accent="proceso" y={250} size={64} />
      <div style={{ position: "absolute", top: 430, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, fontFamily: FONT.body, fontWeight: 700, fontSize: 26, letterSpacing: 4 }}>
        <span style={{ color: t < tAuto ? "#fff" : D.mute2, textDecoration: t >= tAuto ? "line-through" : undefined }}>MANUAL</span>
        <span style={{ color: D.mute2 }}>→</span>
        <span style={{ color: t >= tAuto ? D.orange : D.mute2 }}>AUTOMÁTICO</span>
      </div>
      <Svg>
        <EntryLine to={{ x: xs[0], y }} from={{ x: -40, y }} />
        <line x1={xs[0]} y1={y} x2={xs[3]} y2={y} stroke="#fff" strokeOpacity={0.12} strokeWidth={3} strokeDasharray="6 10" />
        <DrawEdge e={line} k={run} hot width={4} />
        {run > 0 && run < 1 && <circle cx={head.x} cy={head.y} r={10} fill={D.orange2} />}
        {ACTIONS.map((a, i) => {
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
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="DING" at={tAuto - 0.1 + (1.4 * i) / 3} />
      ))}
    </BrandScene>
  );
};

/* ================================================================== 7 · PERSONAS AL MANDO */
const Human: React.FC = () => {
  const t = useT();
  const sc = S.human;
  const tProp = sc.rel(wordTime(15, "propone"));
  const tOk = sc.rel(wordTime(15, "apruebas"));
  const A = { x: 540, y: 560 };
  const P = { x: 540, y: 790 };
  const U = { x: 540, y: 1030 };
  const e1 = edge({ x: A.x, y: A.y + 30 }, { x: P.x, y: P.y - 60 }, 0);
  const e2 = edge({ x: P.x, y: P.y + 60 }, { x: U.x, y: U.y - 70 }, 0);
  const ok = t >= tOk;
  const press = t >= tOk - 0.12 && t < tOk + 0.1 ? 0.95 : 1;
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 800] }} bg={D.bg} background={<DarkBackground glow={U} glowA={0.12 * p(t, tOk, 0.4) + 0.06} />} shakeAt={[tOk]}>
      <DSignature />
      <DTitle text="Personas al mando" accent="al mando" y={250} size={72} />
      <Svg>
        <EntryLine to={{ x: A.x, y: A.y - 30 }} />
        <Module c={A} label="AGENTE" start={0.1} active={0.2} w={220} />
        <DrawEdge e={e1} k={p(t, tProp - 0.35, 0.35, EASE.inOut)} hot />
        <g opacity={p(t, tProp - 0.05, 0.3)}>
          <rect x={P.x - 280} y={P.y - 60} width={560} height={120} rx={22} fill={D.panel} stroke="#3a3a3a" strokeWidth={2} />
          <text x={P.x - 250} y={P.y - 14} fontFamily={FONT.body} fontWeight={700} fontSize={19} letterSpacing={3} fill={D.orange}>
            PROPUESTA
          </text>
          <text x={P.x - 250} y={P.y + 30} fontFamily={FONT.body} fontWeight={500} fontSize={30} fill="#fff">
            Enviar informe a dirección
          </text>
        </g>
        <DrawEdge e={e2} k={p(t, tProp + 0.25, 0.35, EASE.inOut)} hot={ok} />
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
          <Module c={{ x: U.x + 90, y: U.y + 185 }} label="EJECUCIÓN" start={tOk + 0.4} active={tOk + 0.5} w={230} />
        </g>
      </Svg>
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="POP" at={tProp} />
      <Sfx name="CLICK" at={tOk - 0.12} />
      <Sfx name="REWARD" at={tOk} />
    </BrandScene>
  );
};

/* ================================================================== 8 · MANIFIESTO */
const Manifesto: React.FC = () => {
  const t = useT();
  const sc = S.manifesto;
  const tBuild = sc.rel(wordTime(16, "Construye"));
  const c = { x: 540, y: 820 };
  const conv = p(t, 0, tBuild, EASE.inOut);
  const pts = ring(12, c.x, c.y, 470, 470, -90);
  return (
    <BrandScene camera={{ preset: "QOORA_PUSH_IN_01", focus: [540, 820] }} bg={D.bg} background={<DarkBackground glow={c} glowA={0.08 + 0.14 * p(t, tBuild, 0.5)} />} shakeAt={[tBuild]}>
      <DSignature />
      <Svg>
        {/* Las piezas sueltas convergen en un sistema */}
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
      <DTitle text="No automatices tareas." y={1080} size={70} color="#BDBDBD" />
      <Sequence from={Math.round(tBuild * 30)} layout="none">
        <DTitle text="Construye inteligencia." accent="inteligencia." y={1170} size={78} />
      </Sequence>
      <Label text="DON'T JUST AUTOMATE TASKS. ENGINEER INTELLIGENCE." y={460} delay={tBuild + 0.3} />
      <Subtitles phrases={sc.phrases} y={SUB_Y + 90} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="RISER" at={Math.max(0, tBuild - 1.0)} />
      <Sfx name="BOOM" at={tBuild} />
    </BrandScene>
  );
};

/* ================================================================== 9 · CIERRE */
const Cta: React.FC = () => {
  const t = useT();
  const sc = S.cta;
  const tCta = sc.rel(V[18][1]);
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
      <DTitle text="¿Qué agente necesita tu negocio?" accent="tu negocio?" y={980} size={58} delay={0.4} />
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
      <Subtitles phrases={sc.phrases} y={SUB_Y} dark />
      <Sfx name="WHOOSH" at={0} />
      <Sfx name="BOOM" at={0.1} />
      <Sfx name="IMPACT" at={tCta} />
    </BrandScene>
  );
};

/* ================================================================== montaje */
export const Presentacion: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const scenes: [React.FC, number, string][] = [
    [Hook, S.hook.dur, "BRAND_HOOK"],
    [Versus, S.versus.dur, "CHATBOT vs AGENTE"],
    [Reveal, S.reveal.dur, "BRAND_REVEAL"],
    [System, S.system.dur, "SISTEMA: agentes → equipo → herramientas"],
    [Order, S.order.dur, "ORDEN → ACCIONES"],
    [Process, S.process.dur, "MANUAL → PROCESO"],
    [Human, S.human.dur, "PERSONAS AL MANDO"],
    [Manifesto, S.manifesto.dur, "MANIFIESTO"],
    [Cta, S.cta.dur, "BRAND_FINAL_FRAME"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: D.bg }}>
      <Series>
        {scenes.map(([C, d, name]) => (
          <Series.Sequence key={name} durationInFrames={f(d)} name={name}>
            <C />
          </Series.Sequence>
        ))}
      </Series>
      {HAS_VOICE ? (
        <Sequence from={Math.round(LEAD * fps)} name="Voz oficial · Manu Arias">
          <Audio src={staticFile(VOICE_FILE)} volume={MIX.voice} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
