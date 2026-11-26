// VIRALFORGE · kit visual «lo absurdo tiene explicación»
export const TINTA = "#1d1a2b"; // contorno de todo
export const TRAZO = 9;
export const PIELES = ["#FFE9D2", "#F6CFA8", "#E3AE7F", "#B9794F", "#8A5434"];
export const PALETA = {
  cielo_dia: ["#7EC8F2", "#CDEBFA"],
  cielo_atardecer: ["#FF9A6B", "#FFD9A0"],
  cielo_noche: ["#0E1640", "#2D3A78"],
  mar_dia: ["#2C8BC7", "#155A8C"],
  mar_noche: ["#10295A", "#081634"],
  pared: "#E9D8B9",
  suelo: "#9C6B45",
};
export function ruido(semilla: number) {
  const x = Math.sin(semilla * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
