import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, spring } from "remotion";
import { EscenaProps } from "./tipos";
import { Particulas } from "./Particulas";

type Mov = { escala: number; x: number; y: number; rot: number };

function movimiento(efecto: string, f: number, dur: number, fps: number): Mov {
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  switch (efecto) {
    case "alejar":
      return { escala: interpolate(p, [0, 1], [1.28, 1.08]), x: 0, y: 0, rot: 0 };
    case "pan_der":
      return { escala: 1.2, x: interpolate(p, [0, 1], [-60, 60]), y: interpolate(p, [0, 1], [10, -10]), rot: 0 };
    case "pan_izq":
      return { escala: 1.2, x: interpolate(p, [0, 1], [60, -60]), y: 0, rot: 0 };
    case "subir":
      return { escala: 1.22, x: 0, y: interpolate(p, [0, 1], [70, -70]), rot: 0 };
    case "temblor": {
      const s = interpolate(p, [0, 1], [1.12, 1.22]);
      const fuerza = interpolate(f, [0, 8, dur], [9, 5, 2], { extrapolateRight: "clamp" });
      return { escala: s, x: Math.sin(f * 1.9) * fuerza, y: Math.cos(f * 2.3) * fuerza, rot: Math.sin(f * 0.9) * 0.35 };
    }
    case "golpe": {
      const sp = spring({ frame: f, fps, config: { damping: 9, stiffness: 140 } });
      return { escala: interpolate(sp, [0, 1], [1.45, 1.12]) + p * 0.06, x: 0, y: 0, rot: 0 };
    }
    case "acercar":
    default:
      return { escala: interpolate(p, [0, 1], [1.06, 1.24]), x: 0, y: interpolate(p, [0, 1], [0, -25]), rot: 0 };
  }
}

export const Escena: React.FC<{ escena: EscenaProps; indice: number; efecto: string }> = ({ escena, indice, efecto }) => {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const m = movimiento(efecto, f, durationInFrames, fps);
  const destello = efecto === "golpe" ? interpolate(f, [0, 2, 9], [0.85, 0.6, 0], { extrapolateRight: "clamp" }) : 0;
  const barrido = interpolate(f, [0, durationInFrames], [-40, 140]);
  const transform = `translate(${m.x}px, ${m.y}px) scale(${m.escala}) rotate(${m.rot}deg)`;
  const media: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform, filter: "saturate(1.12) contrast(1.05)" };

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0614" }}>
      {/* Fondo desenfocado: rellena los bordes y da profundidad */}
      {escena.imagen ? (
        <Img src={staticFile(escena.imagen)} style={{ ...media, position: "absolute", filter: "blur(30px) brightness(0.7)", transform: `scale(${m.escala * 1.15}) translate(${-m.x * 0.4}px, ${-m.y * 0.4}px)` }} />
      ) : null}
      {escena.clip ? (
        <OffthreadVideo src={staticFile(escena.clip)} muted style={media} />
      ) : escena.imagen ? (
        <Img src={staticFile(escena.imagen)} style={{ ...media, position: "absolute" }} />
      ) : null}
      {/* Rayo de luz que cruza el plano */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${barrido - 18}%, rgba(255,236,180,0.16) ${barrido}%, transparent ${barrido + 18}%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* Polvo dorado en dos capas (paralaje) */}
      <Particulas semilla={`lejos-${indice}`} cantidad={26} tam={[3, 7]} velocidad={0.6} desplX={-m.x * 0.3} opacidad={0.55} />
      <Particulas semilla={`cerca-${indice}`} cantidad={12} tam={[8, 16]} velocidad={1.4} desplX={m.x * 0.8} opacidad={0.8} desenfoque={3} />
      {/* Viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,4,25,0.55) 100%)" }} />
      {escena.texto ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 260 }}>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 70, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,.6)", textAlign: "center", padding: "0 80px" }}>
            {escena.texto}
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: destello }} />
    </AbsoluteFill>
  );
};
