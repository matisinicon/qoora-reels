# qoora-reels

Estudio y almacén de los Reels de QOORA AI.

- `studio/` — motor de vídeo (Remotion): plantillas, componentes de marca y motor de ReelSpec.
- `brand/` — copia de trabajo del Brand DNA, la Voice Bible y la guía `ESTILO_VIRAL.md`. El original está en la carpeta QOORA AI del ordenador.
- `reels/<fecha>-<nombre>/` — vídeo y portada aprobados. Instagram los recoge desde aquí con su URL pública.
- `semanas/<AAAA-Www>/` — trabajo de cada semana: análisis, ideas, guiones, voces y vídeos para aprobar.
- `voz/` — encargos de voz que procesa n8n (texto → mp3 + tiempos por palabra).

Publicación: n8n (flujo «QOORA · Publicar Reels programados») publica lo que esté aprobado en la tabla «QOORA Reels programados».
