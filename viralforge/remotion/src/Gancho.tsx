import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fuente";


// Titular de enganche durante los primeros ~2,5 s
export const Gancho: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: f, fps, config: { damping: 11, stiffness: 150 } });
  const salida = interpolate(f, [fps * 2.3, fps * 2.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f > fps * 3) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 300 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 84,
          color: "#fff",
          textAlign: "center",
          padding: "18px 44px",
          margin: "0 60px",
          borderRadius: 28,
          background: "linear-gradient(135deg, #7b2ff7, #f107a3)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
          transform: `scale(${interpolate(entrada, [0, 1], [0.4, 1])}) rotate(${interpolate(entrada, [0, 1], [-6, -2])}deg)`,
          opacity: Math.min(entrada, salida),
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};
