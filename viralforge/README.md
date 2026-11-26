# VIRALFORGE AI · motor de montaje

Montaje automático de los Shorts de VIRALFORGE AI.

- `render/render.py` — une clips (o imágenes con zoom suave), voz en off y subtítulos en un MP4 vertical 1080×1920, y genera portada y hoja de 8 fotogramas.
- `jobs/` — encargos que sube n8n (flujo «VF · 06 MOTION»). Cada encargo nuevo lanza `.github/workflows/viralforge-render.yml`.
- El resultado se publica como **release** con el mismo nombre que el encargo (`video.mp4`, `portada.jpg`, `hoja.jpg`, `info.json`), así los vídeos no engordan el repositorio. PUBLISHER borra la release cuando el vídeo ya está en YouTube.
