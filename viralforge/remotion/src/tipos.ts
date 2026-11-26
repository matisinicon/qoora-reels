export type Palabra = { t: string; s: number; e: number };
export type EscenaProps = {
  duracion: number;
  efecto: string | null;
  texto: string | null;
  imagen: string | null;
  clip: string | null;
};
export type ShortProps = {
  id: string;
  gancho: string;
  subtitulos: boolean;
  volumenMusica: number;
  palabras: Palabra[];
  voz: string;
  musica: string | null;
  escenas: EscenaProps[];
};
export const FPS = 30;
export const TRANSICION = 10; // fotogramas que se solapan dos escenas
export const COLA = 0.6; // segundos de cierre tras la última palabra
