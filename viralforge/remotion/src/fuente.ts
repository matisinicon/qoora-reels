import "@fontsource/fredoka/latin-700.css";
import { continueRender, delayRender } from "remotion";

// Espera a que la fuente esté cargada antes de dibujar el primer fotograma
const espera = delayRender("Cargando Fredoka");
document.fonts
  .load('700 96px "Fredoka"')
  .then(() => continueRender(espera))
  .catch(() => continueRender(espera));

export const fontFamily = "Fredoka";
