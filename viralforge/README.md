# VIRALFORGE AI · motor de montaje

Montaje automático de los Shorts de VIRALFORGE AI. No guarda vídeos en el repositorio.

- `render/render.py` — une clips (o imágenes con zoom suave), voz en off y subtítulos en un MP4 vertical 1080×1920.
- `.github/workflows/viralforge-render.yml` — lo lanza n8n (flujo «VF · 06 MOTION») con `workflow_dispatch` y los inputs `id` y `job_url`. El resultado (`video.mp4`, `portada.jpg`, `info.json`) queda como artefacto de la ejecución durante 7 días; n8n lo descarga y lo guarda en Supabase Storage.
