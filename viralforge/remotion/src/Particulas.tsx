import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const Particulas: React.FC<{
  semilla: string;
  cantidad: number;
  tam: [number, number];
  velocidad: number;
  desplX: number;
  opacidad: number;
  desenfoque?: number;
}> = ({ semilla, cantidad, tam, velocidad, desplX, opacidad, desenfoque = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: cantidad }).map((_, i) => {
        const r = (k: string) => random(`${semilla}-${i}-${k}`);
        const size = tam[0] + r("s") * (tam[1] - tam[0]);
        const x = r("x") * 1080 + desplX + Math.sin(f / 30 + r("f") * 6) * 18;
        const y = ((r("y") * 2100 - f * velocidad * (0.6 + r("v"))) % 2100 + 2100) % 2100 - 90;
        const brillo = 0.45 + 0.55 * Math.abs(Math.sin(f / (12 + r("t") * 18) + r("p") * 6));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff7d1 0%, #ffd45a 45%, rgba(255,200,60,0) 70%)",
              opacity: opacidad * brillo,
              filter: desenfoque ? `blur(${desenfoque}px)` : undefined,
              boxShadow: `0 0 ${size * 1.6}px rgba(255,210,90,0.7)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
