import React from "react";
// Posición de la cámara de la escena actual (para el paralaje del decorado)
export const CamaraCtx = React.createContext({ x: 0, y: 0, s: 1 });
