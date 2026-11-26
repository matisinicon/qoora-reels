# Agente semanal de Reels — QOORA AI

Procedimiento completo en la skill **qoora-videos-semana**. Este archivo guarda lo que cambia según la configuración, para que cualquier ejecución lo encuentre aunque la skill no esté instalada.

## Voz: modo actual = GRATIS (plan Free de ElevenLabs)

El plan gratuito **no permite usar la voz de biblioteca por API** (error 402 `paid_plan_required`), así que el flujo «QOORA · Generar voz» de n8n todavía no sirve. Mientras dure el plan gratuito:

1. `creative_create_flow`, y luego `creative_generate_speech` con `voice_id cfU714yVeokYQrpdyev5`, `model_id eleven_v4` y `generations_count 1`. El texto lleva «Córa» en lugar de QOORA. No se reintenta en el mismo turno: cada llamada cobra.
2. `creative_get_flow_run_status` → `content_url` del mp3.
3. En el **navegador integrado** (`request_access` a elevenlabsusercontent.com), navegar a `content_url` y ejecutar en la página:
   ```js
   const buf = await fetch(location.href).then(r=>r.arrayBuffer()); let s=''; const u=new Uint8Array(buf);
   for(let i=0;i<u.length;i+=32768){s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));}
   const r = await fetch('https://nicomolina.app.n8n.cloud/webhook/qoora-voz-subir',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'<ID>',audio_base64:btoa(s)})});
   r.status+' '+await r.text()
   ```
   El flujo de n8n «QOORA · Subir voz» lo guarda en `voz/<ID>/voz.mp3`. Después, `git pull`.
4. Tiempos: `creative_transcribe_audio` (gratis) con `connect_from` = node_id de la voz → `creative_get_flow_run_status` → `transcripts[0].words` → convertir a `[[texto, inicio, fin], …]` para `ReelSpec.words`.

Créditos: unos 10 000 al mes en el plan gratuito; cada vídeo de 45 s gasta unos 700-900. Si se acaban, avisa al usuario.

## Cuando el usuario pase al plan Starter

El usuario lo ha pedido así: cuando se acabe el plan gratuito, pasar a Starter. Entonces se usa el flujo de n8n **«QOORA · Generar voz»** (`execute_workflow`, trigger «Encargo de voz», body `{id, texto}`, voz `cfU714yVeokYQrpdyev5`). Ya tiene la credencial de ElevenLabs y la de GitHub, y devuelve `voz/<id>/voz.mp3` + `palabras.json`. Cambia la línea «modo actual» de este archivo.

## Calendario y publicación

- Lunes, miércoles y viernes a las 19:00 (Europe/Madrid).
- Tabla n8n «QOORA Reels programados» (id `tNtXIwbsLBJImaLg`), columnas `titulo, video_url, cover_url, caption, publicar_en, estado, media_id, error`. Solo `estado = aprobado`, y únicamente tras el «sí» del usuario.
- URLs públicas: `https://raw.githubusercontent.com/matisinicon/qoora-reels/main/reels/<carpeta>/video.mp4` y `portada.jpg`.
