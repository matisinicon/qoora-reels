# VIRALFORGE AI — Documentación completa del proyecto

> Última actualización: 27/11/2026 (madrugada, hora de Madrid).
> Este documento recoge todo lo necesario para entender, mantener y mejorar el sistema sin depender de la conversación en la que se construyó.
> **No contiene contraseñas, tokens ni secretos.** Esos datos solo están dentro de las credenciales de n8n y de los paneles de cada servicio.

---

## 1. Qué es VIRALFORGE AI

VIRALFORGE AI es un **equipo autónomo de agentes de IA** que produce cada día **2 YouTube Shorts originales en español**.

- **Formato:** se copia el *formato* de vídeos que ya funcionan, pero con **historias nuevas**. Las referencias son @soyzingo («Lo absurdo tiene explicación»), @RicksClips3000 y el short https://youtube.com/shorts/VS1Z_Q-Klt8.
- **Estilo:** animación 2D de dibujos (personajes y objetos vectoriales), una pregunta absurda como gancho y una explicación real basada en un hecho verificable.
- **Herramientas** (decisión del usuario):
  - **Remotion:** dibujo y animación por código.
  - **Claude / IA:** el cerebro de los agentes.
  - **ElevenLabs:** la voz y los efectos de sonido.
  - **No se usan** Higgsfield ni imágenes generadas por IA.
- **El usuario solo revisa y aprueba** desde Telegram. Nada se publica sin su aprobación.

### Reglas de funcionamiento acordadas
- **2 vídeos al día**, producidos y revisados por el control de calidad (GUARDIAN) antes de las **11:00 (hora de España peninsular)**.
- **A las 11:00** llegan a Telegram como «Vídeo 1» y «Vídeo 2». Cada envío incluye vídeo, portada, título, descripción, hashtags y los botones **✅ APROBAR VÍDEO** / **🔁 REHACER VÍDEO**.
- **APROBAR:** el Vídeo 1 se publica **2 h** después de su aprobación y el Vídeo 2, **6 h** después. Cada uno cuenta desde su propia aprobación.
- **REHACER:** se rehace **solo ese vídeo**.
  - Los agentes reciben el motivo que escribe el usuario.
  - La versión anterior queda en el historial y nunca se publica.
  - La nueva versión pasa otra vez por GUARDIAN y se reenvía a Telegram.
- **COMENZAR / PARAR:** interruptor general.
  - PARAR detiene las nuevas producciones, las entregas y las publicaciones automáticas, sin perder datos.
  - COMENZAR lo reanuda.
- **Requisitos:**
  - Memoria persistente e historial de vídeos, versiones, aprobaciones, publicaciones y resultados.
  - Sin repeticiones.
  - Registro de errores y recuperación automática.
  - Verificar que el vídeo está terminado antes de enviarlo y que la publicación existe antes de confirmarla.
  - Registro de lo que hace cada agente.
  - Funciona sin Claude abierto: todo corre en la nube.
- **Mensaje de arranque:** «VIRALFORGE AI está listo para empezar», con el botón COMENZAR. Solo se envía cuando no queda nada esencial pendiente.

---

## 2. Estado actual (27/11/2026)

| Pieza | Estado |
|---|---|
| Base de datos (Supabase) | ✅ Funcionando |
| Producción automática (motor + pasos) | ✅ Probada de principio a fin (2 vídeos de prueba) |
| Montaje Remotion en GitHub Actions | ✅ Funcionando (~2 min por vídeo) |
| Ritmo (recorte de pausas) y efectos de sonido | ✅ Funcionando (vídeo de prueba VF-0004-SFX-PRUEBA2) |
| Voz | ⚠️ Manu Arias configurada. Con el plan gratis de ElevenLabs puede fallar: entonces se usa la voz de respaldo «George» |
| Telegram (bot de control y entrega) | ✅ Chat registrado y entrega probada |
| YouTube | ✅ Credencial propia conectada (canal «Nicolas Molina», @nc_-nl6bh). Subida real todavía no probada |
| Panel del departamento | ✅ https://claude.ai/artifact/EFjXRWLqUws2bKczSq1UWf |
| Sistema | ▶️ **ACTIVADO** por el usuario con COMENZAR el 27/11/2026 a las 01:14 |

### Pendiente o mejorable (por prioridad)
1. **ElevenLabs de pago (plan Creator o superior).**
   - El plan gratis da 10.000 caracteres al mes y cada vídeo gasta unos 800-900, así que solo alcanza para unos 5 días.
   - Además, el plan gratis no permite usar voces de la biblioteca (Manu Arias) por API ni uso comercial (canal monetizado).
2. **Pasar el cerebro de los agentes de Cohere a Claude.**
   - Cohere inventa datos con facilidad. La historia de prueba sobre Wollaston y el piano en un globo es dudosa.
   - Se cambia solo el nodo «Modelo IA» del workflow VF·00 cuando haya una credencial de Anthropic en n8n.
3. **Probar la subida real a YouTube:** el flujo VF·09 está publicado, pero aún no ha subido ningún vídeo.
4. **SCOUT, METRICS y STORYLAB** (análisis diario de los canales de referencia y de las métricas propias):
   - Existen como workflows (01, 02, 03), pero están **desactivados** y sin adaptar al nicho nuevo.
   - Ahora que YouTube está conectado se pueden activar, siempre condicionados a `sistema_activo`.
5. **Calidad visual:**
   - Algunos objetos SVG que dibuja la IA salen como rectángulos blancos.
   - Los subtítulos centrales a veces tapan las caras.
   - Conviene ampliar la biblioteca del kit (piano, globo aerostático, etc.).
6. **Música de fondo:** no hay. Generar una pista con ElevenLabs Music cuesta unos 900 créditos y requiere un plan de pago para uso comercial.
7. **Mensaje «VIRALFORGE AI está listo para empezar»:** no llegó a enviarse formalmente, porque el usuario activó el sistema antes desde el menú del bot.
8. **Datos de prueba:**
   - Los vídeos VF-0002, VF-0003* y VF-0004* y el ciclo con fecha 2026-11-01 son de prueba.
   - El Vídeo 1 de prueba (VF-0004-v2) se mandó a rehacer y su nueva versión se está produciendo como real (`prueba=false`).

---

## 3. Arquitectura

```
                ┌───────────────────────────── n8n Cloud (nicomolina.app.n8n.cloud) ─────────────────────────────┐
  Cron 03/06/08h│  VF·10 MOTOR ──► VF·10p PASO ──► SCRIPTOR(04) → FRAME(05) → MOTION(06) → [montaje] → GUARDIAN(07) │
  Vigilancia/h  │      ▲    │                                                    │                    → METADATOS(09a)│
  Webhook GitHub│──────┘    └── un paso por ejecución (n8n corta a los 180 s) ───┘                                     │
                │                                                                                                    │
  Cron 11:00 ──►│  VF·12b ENTREGA DIARIA ──► VF·12 ENTREGAR (Telegram: portada + vídeo + botones)                     │
  Telegram ────►│  VF·08b BOT DE CONTROL (/start, /estado, COMENZAR, PARAR, APROBAR, REHACER)                         │
  Cada 20 min ─►│  VF·09 PUBLISHER (YouTube: sube programado, portada, verifica, confirma publicación)                │
  Errores ─────►│  VF·11 AVISOS DE ERROR (Telegram)                                                                    │
                └───────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                                │ RPC vf_call / vf_sql
                         ┌──────────────────────────────────────▼───────────────────────┐
                         │ Supabase (proyecto hpfzgiqdgcvytqydaxoz, esquema viralforge) │
                         │ memoria, estado, colas, historial, eventos, configuración    │
                         └──────────────────────────────────────▲───────────────────────┘
                                                                │
  VF·06 MOTION sube un encargo JSON ──► GitHub (matisinicon/qoora-reels, viralforge/jobs/*.json)
                                         └─► GitHub Actions «VIRALFORGE · Montar Short» (Remotion)
                                             └─► Release con video.mp4, portada.jpg, hoja.jpg, info.json, voz.mp3
                                             └─► Aviso (webhook) al MOTOR de n8n: «montaje terminado»
```

**Por qué funciona así:**
- **n8n Cloud** solo deja que una ejecución dure **180 s**. Por eso la producción es una **máquina de estados**: cada vídeo es una fila en `producciones` con un `paso`, y cada ejecución avanza **un único paso**.
- El montaje (renderizado) lo hace **GitHub Actions**, que es gratis y no tiene ese límite de tiempo. Al terminar, avisa a n8n por webhook. Si el aviso se pierde, la vigilancia horaria lo recoge.
- **Supabase** es la memoria persistente. Todo el estado vive allí, así que se puede parar, reanudar o reintentar sin perder nada.

---

## 4. Calendario diario (hora de Madrid)

| Hora | Qué pasa | Workflow |
|---|---|---|
| 03:00 | Se abre el ciclo del día y se crean las producciones del Vídeo 1 y el Vídeo 2 (solo si el sistema está ACTIVO) | VF·10 (turnos) |
| 06:00 y 08:00 | Turnos de rescate: si algún vídeo falló, se vuelve a crear | VF·10 |
| Cada hora (min. 17) | Vigilancia: reclama producciones atascadas o montajes terminados sin aviso | VF·10 |
| Continuo | Cada paso, al terminar, llama al motor para seguir con el siguiente | VF·10p → VF·10 |
| 11:00 | Entrega de los 2 vídeos en Telegram | VF·12b → VF·12 |
| Tras APROBAR | Se programa la publicación: +2 h (Vídeo 1) y +6 h (Vídeo 2) | VF·08b → `registrar_decision` |
| Cada 20 min | Sube los vídeos aprobados cuya hora se acerca (privado + publicación programada), verifica y confirma | VF·09 |

Si un vídeo rehecho, o cualquier vídeo, termina después de las 11:00, se entrega en cuanto está listo.

---

## 5. Los agentes

Todos los agentes de IA usan el mismo cerebro: el workflow **VF·00**. Recibe `{agente, tarea, formato}`, lee el *prompt* del agente y la «Biblia» del canal desde Supabase, llama al modelo y devuelve JSON.

| Agente | Función | Workflow n8n | Estado |
|---|---|---|---|
| **SCOUT** | Busca vídeos virales de referencia del nicho | VF·01 (`ygBA1xwVCPRqRQcm`) | Desactivado (pendiente de adaptar) |
| **METRICS** | Analiza el rendimiento de los vídeos publicados | VF·02 (`rWYEtlrMQktXDfJO`) | Desactivado (pendiente) |
| **STORYLAB** | Biblioteca narrativa: estructuras y ganchos | VF·03 (`cGbKrleBYEV64obz`) | Desactivado (pendiente) |
| **SCRIPTOR** | Escribe la historia original: título-pregunta, dato real con fuente, narración y guion por segmentos | VF·04 (`ye0uIqcS0BeWQxeu`) | ✅ |
| **FRAME** | Diseña el plan visual: reparto de personajes y una escena por segmento, con fondo, cámara y elementos del kit | VF·05 (`tjpwJYYCcyrGXaaU`) | ✅ (valida que haya suficientes escenas) |
| **MOTION** | Genera la voz con ElevenLabs y encarga el montaje a GitHub | VF·06 (`eqpDy0CT83i2Wcjw`) | ✅ (con voz de respaldo) |
| **GUARDIAN** | Control de calidad: revisa la hoja de fotogramas y la veracidad del dato | VF·07 (`ylRCaemZURjL3J7S`) | ✅ |
| **PUBLISHER** | Título, descripción y hashtags de YouTube; entrega en Telegram; publicación | VF·09a (`13yOZla82Q1VoRpP`), VF·12, VF·09 | ✅ |

**Dónde se editan:**
- Los *prompts* están en la tabla `viralforge.prompts_agentes`. Se editan sin tocar los workflows.
- La «Biblia» del canal (resumen del nicho y del estilo) está en `viralforge.documentos`, con la clave `biblia_resumen`.

**Reglas actuales de SCRIPTOR (resumen):**
- **Dato:** un hecho real y verificable, con su fuente.
- **Título:** una pregunta de 60 caracteres como máximo, y la narración empieza con ella.
- **Estructura:** pregunta → contexto → idea absurda → explicación real → cierre.
- **Narración:** 110-140 palabras, con ritmo de short viral:
  - frases de 4 a 12 palabras;
  - nada de puntos suspensivos;
  - enganchar en los 2 primeros segundos.
- **Segmentos:** de 9 a 14.
- **Personajes:** como máximo 4, descritos solo con rasgos del kit.
- **Repeticiones:** no repetir temas ni protagonistas.

---

## 6. Workflows de n8n (carpeta «VIRALFORGE AI»)

Instancia: **https://nicomolina.app.n8n.cloud**. Proyecto `n5PYCFzOGwBHTgSD`, carpeta `yNdXFh3hBSTkG55b`.
En todos los workflows activos: zona horaria `Europe/Madrid` y workflow de errores `KkQBhR5gduiaP7s9`.

| Nombre | ID | Disparador | Qué hace |
|---|---|---|---|
| VF · 00 IA (cerebro de los agentes) | `wfFROjexAn74RT8j` | subflujo | Prompt + Biblia → modelo (ahora Cohere `command-a-03-2025`) → extrae el JSON (repara respuestas cortadas) |
| VF · 01 SCOUT | `ygBA1xwVCPRqRQcm` | — | Desactivado |
| VF · 02 METRICS | `rWYEtlrMQktXDfJO` | — | Desactivado |
| VF · 03 STORYLAB | `cGbKrleBYEV64obz` | — | Desactivado |
| VF · 04 SCRIPTOR | `ye0uIqcS0BeWQxeu` | subflujo | Historia nueva o revisión con los cambios pedidos |
| VF · 05 FRAME | `tjpwJYYCcyrGXaaU` | subflujo | Plan de escenas por capas; el nodo «Comprobar plan» rechaza planes con pocas escenas |
| VF · 06 MOTION | `eqpDy0CT83i2Wcjw` | subflujo | Voz ElevenLabs con tiempos por palabra (y respaldo), sube `voz.mp3` a Storage y crea el encargo en GitHub |
| VF · 07 GUARDIAN | `ylRCaemZURjL3J7S` | subflujo | Revisión visual y de veracidad → listo / corregir / rechazado |
| VF · 08b Telegram (bot de control) | `9IZofBAy43d5PEXj` | Telegram Trigger | Comandos y botones (ver §10) |
| VF · 09 PUBLISHER (YouTube) | `XjJStjL8UpJKOWRn` | cada 20 min | Subida programada + portada + verificación + confirmación de publicado |
| VF · 09a PUBLISHER metadatos | `13yOZla82Q1VoRpP` | subflujo | Título, descripción y hashtags para YouTube |
| VF · 10 PRODUCCIÓN (motor) | `dZD1gl3wi3B5Nrfc` | cron 03/06/08 h, vigilancia horaria, webhook `vf-render-dd3ac0352fba6cf3`, subflujo «Continuar», manual «Probar ahora» | Reclama producciones y lanza un paso para cada una |
| VF · 10p Paso de producción | `EuHjgHWci5BVHAbM` | subflujo | Ejecuta el paso que toque (ver §7.3) |
| VF · 11 Avisos de error | `KkQBhR5gduiaP7s9` | Error Trigger | Avisa por Telegram de cualquier fallo |
| VF · 12 Entregar vídeos (Telegram) | `MBGpmey97KVRD9xm` | subflujo | Envía portada, vídeo y botones; marca como entregado |
| VF · 12b Entrega diaria 11:00 | `Umle8JyearYjvgaf` | cron 11:00 | Si el sistema está activo → VF·12 con la fecha de hoy y aviso de los vídeos que falten |
| VF · 99 Banco de pruebas | `JLNWILMLo8Jmec15` | manual | Pruebas: el nodo «Probar YouTube» lista el canal conectado |

**Archivados (no usar):**
- `Cy01ikVLKi5XF1ZL` (09 antiguo)
- `tiYwPqTpqveGlurP`, `O3XSCLlyvXjXjwcO`, `CiS67vjdvBVKGDqy` (motores antiguos)
- `E3FjrMv26Zdyq9gE`, `0IAsIAw42Sf7Uvjp` (08 y 08b antiguos)
- `Buh1awsAeBq0KNBU`, `gCmVpZLF6oTpUlBx` (06b y 06c, de la época de Higgsfield)
- Los temporales de diagnóstico

**Cómo se construyeron:**
- Con el *Workflow SDK* de n8n, a partir de un generador en Python (`gen.py`, más `wXX.py` → `wXX.js`). El SDK no admite funciones flecha auxiliares, así que el generador escribe nodos explícitos.
- Los workflows que llaman a otros deben **publicarse en orden de dependencia**. Para resolver la referencia circular motor ↔ 10p: se desactiva temporalmente el nodo «Continuar», se publica 10p, luego el motor, y se reactiva.
- Si un workflow está abierto en el editor, puede fallar al publicarlo y, en el caso del Telegram Trigger, quitarle el webhook. Hay que **cerrar el editor o despublicar y volver a publicar**.

---

## 7. Base de datos (Supabase)

- **Proyecto:** `hpfzgiqdgcvytqydaxoz`, URL `https://hpfzgiqdgcvytqydaxoz.supabase.co`
- **Esquema:** `viralforge`
- **Acceso desde n8n:** con la credencial «Supabase account» (service_role), mediante dos RPC públicas:
  - `public.vf_call(fn text, payload jsonb)`: ejecuta `viralforge.<fn>(payload)`; solo admite nombres `[a-z_]+`.
  - `public.vf_sql(query text, args jsonb)`: consulta SQL parametrizada con `$1`.
  - `public.vf_panel()`: solo lectura, security definer, con permiso para `anon`. Lo usa el panel.
- **Storage:** bucket `viralforge`, público para las voces: `/<codigo>/voz.mp3`.

### 7.1 Tablas
- `analisis_rendimiento`, `aprobaciones`, `biblioteca_narrativa`, `canales`
- `ciclos` (un registro por día: estado, `entregado_en`, `bloqueo_hasta`)
- `configuracion` (ver §7.4), `documentos` (Biblia)
- `ejecuciones_agentes` (registro de cada llamada a un agente: entrada, salida, estado, error, duración)
- `errores_qa`, `escenarios`, `escenas`
- `eventos` (registro general: nivel, agente, tipo, mensaje, video_id, datos)
- `generaciones`, `historia_recursos`, `historias` (código HIST-xxxx, versión y paquete JSON con la narración y el guion), `informes_metrics`, `objetos`, `observaciones`, `personajes`
- `planes_visuales` (plan de FRAME: `motor`, `reparto`, `escenas_capas`)
- **`producciones`** (máquina de estados, ver §7.3)
- `prompts_agentes`
- `publicaciones` (cola de YouTube: título, descripción, etiquetas, `fecha_programada`, `youtube_video_id`, url, estado, incidencias)
- `recursos_produccion`, `referencias`, `revisiones_qa`, `temas`
- **`videos`** (código VF-xxxx[-vN], versión, estado, slot, ciclo, `archivo_url`, `portada_url`, metadatos, `reemplaza_a`)
- Vistas: `v_cola_publicacion`, `v_metricas`, `v_uso_reciente`

**Estados de `videos.estado`:** en_produccion, en_qa, corregir, listo, entregado, aprobado, publicado, rehaciendo, reemplazado, fallido, rechazado.

### 7.2 Funciones principales (esquema viralforge)
- **Sistema y registro:**
  - `set_sistema` (COMENZAR / PARAR)
  - `log_evento`
  - `panel`
- **Ciclo diario y cola de producción:**
  - `abrir_ciclo({fecha?, forzar?})`: crea las producciones de los slots que faltan. Con `forzar` crea producciones de **prueba** aunque el sistema esté parado.
  - `motor_reclamar({release?})`: reclama hasta 4 producciones (si el sistema está activo o son de prueba) con un bloqueo de 4 min. Las que están en `montando` solo se reclaman pasados 4 min, salvo que llegue su release.
  - `avanzar_produccion`, `fallo_produccion`:
    - Hasta 3 fallos por paso; después pasa a `fallido`.
    - Si MOTION falla porque el plan de FRAME es pobre, vuelve al paso `frame`.
  - `liberar_ciclo`
- **Contexto para cada agente:** `contexto_scriptor`, `contexto_frame`, `contexto_motion`, `contexto_guardian`, `contexto_metadatos`, `contexto_publisher`, `contexto_storylab`, `contexto_aprobacion`.
- **Guardar resultados:**
  - `guardar_historia`, `guardar_plan` (crea el registro del vídeo), `guardar_qa`, `guardar_metadatos` (→ `listo`)
  - `guardar_generacion`, `guardar_scout`, `guardar_storylab`, `guardar_metrics`, `guardar_observaciones`
  - `asignar_slot`, `actualizar_video`, `cerrar_reemplazado`
- **Entrega y decisiones:**
  - `para_entregar`, `marcar_entregado`
  - `registrar_decision`:
    - `aprobado` → crea la publicación con +2 h / +6 h;
    - `rehacer` → el vídeo pasa a `rehaciendo` y se crea una producción en modo `rehacer` con el comentario.
- **Publicación en YouTube:**
  - `crear_publicacion`
  - `reclamar_publicacion`: solo si el sistema está activo; toma las que vencen en menos de 45 min y recupera las atascadas en `subiendo`.
  - `resultado_publicacion`, `por_confirmar`, `confirmar_publicada`

### 7.3 Máquina de estados de `producciones.paso`
```
scriptor → frame → motion → montando → guardian → metadatos → entregar/hecho
                                         │
                                         ├─ «corregir» (1.ª vez) → vuelve a scriptor en modo revisión con los cambios
                                         └─ rechazado 2 veces → fallido
cualquier paso: 3 fallos → fallido (y aviso).  Otros estados finales: hecho, cancelado
```
- `modo`: `nueva`, `revision` o `rehacer`.
- `prueba=true` marca las producciones lanzadas a mano con el sistema parado.

### 7.4 Configuración (tabla `configuracion`)
| Clave | Valor actual | Para qué |
|---|---|---|
| `sistema_activo` | true | Interruptor COMENZAR / PARAR |
| `sistema_listo` | false | Indica que se envió el mensaje de «listo» |
| `telegram_chat_id` | (chat del usuario) | Lo registra `/start`; solo responde a ese chat |
| `telegram_esperando` | null | Vídeo del que se espera el motivo de REHACER |
| `hora_entrega` | "11:00" | Hora de entrega |
| `zona_horaria` | Europe/Madrid | |
| `videos_por_dia` | 2 | |
| `retraso_publicacion_horas` | {"1":2,"2":6} | Horas desde la aprobación |
| `elevenlabs_voz` | cfU714yVeokYQrpdyev5 (Manu Arias, «Español Viral») | Voz principal |
| `elevenlabs_voz_respaldo` | JBFqnCBsd6RMkjVDRZzb (George) | Si falla la principal |
| `elevenlabs_modelo` | eleven_multilingual_v2 | |
| `elevenlabs_velocidad` | 1.12 | Velocidad de habla (máximo 1.2) |
| `elevenlabs_estabilidad` | 0.35 | Más bajo = más expresiva |
| `elevenlabs_estilo` | 0.5 | Más alto = más energía |
| `motor_montaje` | remotion | |
| `github_repo` | matisinicon/qoora-reels | |
| `max_ciclos_qa` | 2 | |
| `hecho_para_ninos` | false | YouTube |
| `idioma_produccion` | es | |
| `higgsfield_*`, `modo_escenas`, `horas_publicacion`, `presupuesto_creditos_video`, `max_regeneraciones_escena`, `referencias_por_busqueda`, `umbral_outlier` | — | Restos de versiones anteriores o para SCOUT; no se usan en la producción actual |

---

## 8. Montaje con Remotion (repositorio GitHub)

- **Repositorio:** `matisinicon/qoora-reels` (público). Carpeta `viralforge/`.
- **Copia local:** `Documentos/VIRALFORGE AI/04_herramientas/remotion/` (puede estar desactualizada respecto al repositorio; **la fuente de verdad es GitHub**).

### 8.1 Flujo
1. MOTION sube `viralforge/jobs/<CODIGO>-<fecha>.json` (el «encargo»).
2. El *push* dispara **`.github/workflows/viralforge-render.yml`** («VIRALFORGE · Montar Short»):
   - instala Node 22 y ejecuta `npm ci` y `npx remotion browser ensure`;
   - elige el motor: Remotion por defecto, o `"motor":"ffmpeg"` para el antiguo;
   - lanza `viralforge/remotion/montar.sh` (timeout de 60 min).
3. Se crea una **Release** con el nombre del encargo, con `video.mp4`, `portada.jpg`, `hoja.jpg` (8 fotogramas para GUARDIAN), `info.json` y `voz.mp3`. Si falla, la release se crea con un `info.json` de error.
4. Si el encargo trae `callback_url`, se hace POST `{"release": nombre}` al webhook del motor.

### 8.2 Archivos
- `package.json`: remotion, @remotion/cli, transitions y media-utils 4.0.547; React 19.1; @fontsource/fredoka 5.
- `preparar.mjs`: descarga los recursos a `public/job/` y escribe `props.json`. Para la composición «Historia»:
  - **Ritmo:** recorta toda pausa entre palabras de más de 0,12 s y deja 0,07 s (ffmpeg `atrim` + `concat`), y recoloca los tiempos de cada palabra. Se desactiva con `"sin_recorte_pausas": true` en el encargo; el umbral se cambia con `"pausa_max"`.
  - **Anclaje de escenas:** las primeras palabras (`texto`) de cada escena se buscan en los tiempos de la voz. La escena empieza 0,08 s antes de su primera palabra y la última termina 0,4 s después de la última palabra.
  - **Efectos de sonido automáticos:** ver §8.4.
- `montar.sh`: renderiza (crf 20) y para «Historia» genera además la **portada**: un *still* con `portada=true`, título grande y fotograma 40. Después crea `hoja.jpg` e `info.json`.
- `src/Root.tsx`: composiciones **Historia** (la actual) y **Short** (la antigua, de escenas con imagen). La duración es la de la voz más una cola, a 30 fps y 1080×1920.
- `src/Historia.tsx`: secuencias por escena con `EscenaKitView`, la caja de narración arriba y el subtítulo central de 1-2 palabras (Fredoka 112), la voz, los efectos (`sonidos[]`) y la música opcional.
- `src/fuente.ts`: carga la fuente Fredoka con `delayRender`. Google Fonts está bloqueado en local.

### 8.3 Kit de dibujo (`src/kit/`)
- `estilo.ts`: tinta `#1d1a2b`, paleta, ruido.
- `Personaje.tsx`: personaje paramétrico.
  - Aspecto: `piel`, `ropa`, `ropa2`, `sombrero` (ninguno | boina | marino | capitan | corona | chistera), `bigote`, `barba`.
  - `expresion`: normal | feliz | sorpresa | preocupado | confuso | idea | enfadado | risa.
  - `hablando`, `mira`, `brazo` (abajo | arriba | senala | pincel | periscopio).
  - Parpadeo y respiración.
- `Fondos.tsx` y `Escenario.tsx`: fondos de mar, interior, laboratorio, campo, granja, bosque, desierto, nieve, ciudad, espacio, cielo y liso (con «momento» día o noche).
- `Objetos.tsx` y `Biblioteca.tsx`: barco (dazzle, hundido), submarino, torpedo, calendario, explosión, árbol, casa, naranja, hielo, termómetro, reloj, bombilla, moneda, caja, vaca, coche, avión, cohete, fuego, gota, bandera, libro, interrogación, exclamación, check, cruz, vista de periscopio y flecha.
  - Para lo que no está en el catálogo, FRAME puede dibujar un `svg` propio, que se sanea con `limpiarSvg()`.
- `Capas.tsx`: escena genérica por capas.
  - Elementos: `personaje`, `objeto` (nombre o svg), `texto`, `contador`, `flecha`, `efecto` (explosion, destello, humo).
  - Animación: `entra` (pop, izq, der, arriba, abajo, fundido), `en` (0-1 dentro de la escena), `hasta`, `a{x,y,escala,rotacion}`, `flotar`, `temblar`, `saltar`, `girar`, `latir`, `sale`.
  - Escena: `{fondo, vista?, elementos}`.
- `Escenas.tsx`: tipos de escena predefinidos y la **Cámara**: acercar, alejar, pan_der, pan_izq y temblor, con un pequeño «golpe» al entrar.
- `Rotulos.tsx`: `SubtituloCentral` y `CajaNarracion`.

### 8.4 Efectos de sonido
- **Biblioteca:** `viralforge/remotion/public/sfx/`, con whoosh, pop, ding, boing, impacto, tension, explosion, scratch, tictac y silbato.
  - Se generaron con ElevenLabs (`eleven_text_to_sound_v2`, flujo `bRDsB2wKhLj6oPMgrnJq`) el 27/11/2026.
  - El workflow `.github/workflows/viralforge-sfx.yml` los descargó, recortó y normalizó; las URLs de origen están en `viralforge/assets/sfx.txt` (ya caducadas).
- **Colocación automática** (`planSonidos` en `preparar.mjs`):
  - **Cambios de escena:**
    - escena 1: «impacto»;
    - las demás: «whoosh» o, cada tercera, «silbato»;
    - cámara «temblor»: «impacto».
  - **Según los elementos:**
    - explosión: «explosion»;
    - destello, bombilla o check: «ding»;
    - contador o reloj: «tictac»;
    - interrogación: «boing»;
    - exclamación: «scratch»;
    - elementos que entran con «pop»: «pop» (uno por escena).
  - **Antes de la escena final:** «tension».
  - **Separación mínima** entre efectos: 0,35 s.
- **Control manual:**
  - FRAME puede forzar un efecto con `"sonido": "<nombre>"` en una escena o un elemento.
  - El encargo admite `"sin_efectos": true` y `"volumen_efectos"`.
- **Para añadir un efecto nuevo:** sube el mp3 a `public/sfx/` y añade su nombre a la lista `SFX` de `preparar.mjs`.

### 8.5 Formato del encargo (job JSON, composición Historia)
```json
{ "id": "VF-0005", "composicion": "Historia", "titulo": "¿Por qué...?",
  "reparto": { "protagonista": { "piel": "#F6CFA8", "ropa": "#5C6B3A", "sombrero": "boina", "bigote": true } },
  "escenas": [ { "texto": "primeras palabras exactas", "fondo": {"tipo":"mar","momento":"dia"}, "camara": "acercar",
                 "elementos": [ {"tipo":"objeto","nombre":"barco","x":540,"y":1180,"escala":1,"a":{"x":600}},
                                {"tipo":"personaje","ref":"protagonista","x":600,"y":1650,"escala":1.4,"entra":"der","props":{"expresion":"sorpresa","hablando":true}} ] } ],
  "voz_url": "https://hpfzgiqdgcvytqydaxoz.supabase.co/storage/v1/object/public/viralforge/VF-0005/voz.mp3",
  "palabras": [["¿Por", 0.0, 0.21], ["qué", 0.21, 0.4]],
  "musica_url": null,
  "callback_url": "https://nicomolina.app.n8n.cloud/webhook/vf-render-dd3ac0352fba6cf3" }
```
**Prueba sin tocar el sistema:** copia un encargo, cámbiale el `id`, **quítale `callback_url`** y súbelo a `viralforge/jobs/`. GitHub crea una release con ese id.

---

## 9. Voz (ElevenLabs)

- **Llamada:** `POST /v1/text-to-speech/{voz}/with-timestamps` (devuelve el audio y los tiempos por carácter, que se convierten en tiempos por palabra).
- **Credencial en n8n:** «Header Auth account» (cabecera `xi-api-key`).
- **Ajustes:** velocidad 1.12, estabilidad 0.35, estilo 0.5 y *speaker boost*. Se cambian en `configuracion` sin tocar el workflow.
- **Respaldo:** si la voz principal da error (por ejemplo, por el plan), MOTION usa `elevenlabs_voz_respaldo`.
- **Cuenta:** plan **gratis**, con 10.000 caracteres al mes, que se reinician cada mes. **Hay que pasar a un plan de pago** para usar Manu Arias por API, tener volumen suficiente y uso comercial.
- **Voces del espacio de trabajo:**
  - Manu Arias: `cfU714yVeokYQrpdyev5`
  - David Martin: `Nh2zY9kknu6z4pZy6FhD`
  - Efrayn: `1MxuWc12WPRxDkgfT3kj`
  - Abel Lz: `452WrNT9o8dphaYW5YGU`
  - George (prediseñada): `JBFqnCBsd6RMkjVDRZzb`

---

## 10. Telegram

- **Credencial en n8n:** «Telegram account» (token del bot creado con @BotFather).
  - El 27/11 el token guardado era inválido y hubo que pegarlo de nuevo.
  - Si el bot deja de responder: revisa el token y **despublica y vuelve a publicar VF·08b** para que se registre otra vez el webhook.
- **Seguridad:** solo responde al chat registrado con el primer `/start`. Los demás chats se ignoran.
- **Comandos:**
  - `/start`: registra el chat, o muestra el estado si ya estaba registrado.
  - `/estado` o `/panel`: resumen con un botón para COMENZAR o PARAR.
  - `/comenzar`, `/parar`.
- **Botones** (callback_data):
  - `ok:<video_id>`: aprobar;
  - `rh:<video_id>`: pide el motivo; el siguiente texto del usuario es el comentario;
  - `rs:<video_id>`: rehacer;
  - `go:0`: comenzar;
  - `st:0`: parar;
  - `es:0`: estado.
- **Mensajes automáticos:**
  - entrega de las 11:00;
  - «📅 programado» con el enlace;
  - «✅ Publicado» con el enlace;
  - «❌ No pude subir…»;
  - avisos de error (VF·11).

---

## 11. YouTube

- **Proyecto de Google Cloud:** «VIRALFORGE», id `rare-seeker-516023-r6`, en la cuenta **matisinicon@gmail.com**.
  - YouTube Data API v3 activada.
  - Google Auth Platform: app «VIRALFORGE AI», usuarios externos, **en producción** (sin verificar; por eso aparece el aviso «app no verificada»).
  - Página principal: https://github.com/matisinicon/qoora-reels
  - Privacidad: https://github.com/matisinicon/qoora-reels/blob/main/viralforge/PRIVACIDAD.md
  - Dominios autorizados: n8n.cloud y github.com.
  - Cliente OAuth «n8n VIRALFORGE» (aplicación web), Client ID `524006988059-gcnr75tj4ti011utpso692qsr6oovena.apps.googleusercontent.com`.
  - URI de redirección: `https://oauth.n8n.cloud/oauth2/callback`.
  - El secreto **solo** está en n8n. Si se pierde, se crea otro en la consola («Add secret»; máximo 2 activos).
- **Credencial en n8n:** «YouTube account», en modo **Custom OAuth2** (no «Managed»: la app gestionada por n8n da `quotaExceeded`).
  - Autorizada con la cuenta del canal: **«Nicolas Molina» (@nc_-nl6bh, id UCyfM6uwgaMHfMov7VsxK1vA)**.
  - Para cambiar de canal: «Sign in with Google» otra vez y elegir el otro.
- **Lógica de VF·09:**
  1. Toma una publicación en estado `preparado` cuya hora llega en menos de 45 min.
  2. Descarga el vídeo y lo sube como **privado con `publishAt`**. Si faltan menos de 10 min, lo sube directamente como público. Categoría 27 (Educación), no hecho para niños, idioma es.
  3. Pone la portada (`thumbnails.set`).
  4. **Comprueba con `videos.list`** que está programado y entonces avisa.
  5. Pasada la hora, comprueba que es **público** y lo confirma.
  6. Si falla, avisa y vuelve a ponerlo en cola, salvo que sea un error de credenciales.
- **Cuota de la API:** 10.000 unidades al día. Una subida cuesta unas 1.600, así que 2 vídeos al día entran de sobra.

---

## 12. Panel del departamento

- **URL:** https://claude.ai/artifact/EFjXRWLqUws2bKczSq1UWf (artefacto de tipo «Data» de Claude).
- **Contenido:**
  - estado del sistema (interruptor, listo, Telegram, totales);
  - tarjetas de los 8 agentes con sus acciones y errores en 24 h;
  - producción del día con el paso de cada vídeo;
  - gráfico de 14 días;
  - cola de YouTube;
  - historial de vídeos y versiones;
  - registro de eventos.
- **Datos:** se leen **en directo** con el conector de Supabase de quien lo abre (consultas SQL de solo lectura).

---

## 13. Credenciales (solo nombres; los secretos están en n8n)

| Credencial n8n | Tipo | Uso |
|---|---|---|
| Supabase account | supabaseApi | Todo el acceso a la base de datos |
| Cohere account | cohereApi | Cerebro de los agentes (VF·00) |
| Header Auth account | httpHeaderAuth | ElevenLabs (`xi-api-key`) |
| GitHub account | githubApi | Subir encargos al repositorio |
| Telegram account | telegramApi | Bot |
| YouTube account | youTubeOAuth2Api (Custom OAuth2) | Publicación |
| Facebook Graph account | facebookGraphApi | No se usa en VIRALFORGE |

**Futuro:** una credencial de Anthropic (Claude) para sustituir a Cohere en VF·00.

---

## 14. Fiabilidad: cómo se cumple cada requisito

| Requisito | Cómo |
|---|---|
| Funciona sin Claude abierto | Todo corre en n8n Cloud, GitHub Actions y Supabase |
| Basado en programador | Cron de turnos, vigilancia horaria, entrega a las 11:00 y publisher cada 20 min |
| Memoria persistente | Supabase |
| Sin duplicados | Un vídeo por slot y ciclo (`abrir_ciclo`), reclamos con bloqueo (`for update skip locked`), una publicación por versión |
| Errores y autorrecuperación | 3 reintentos por paso, turnos de rescate a las 06:00 y 08:00, vigilancia horaria, montajes con tiempo límite de 30 min, subidas atascadas que se recuperan a los 40 min, workflow de errores con aviso por Telegram |
| Vídeo terminado antes de enviar | Solo se entrega un vídeo en estado `listo` (pasado por GUARDIAN y con metadatos) y con `info.json` correcto en la release |
| Publicación verificada | `videos.list` tras subir y otra vez tras la hora de publicación |
| Registro por agente | `ejecuciones_agentes` y `eventos` (visibles en el panel) |
| Parar y reanudar sin perder datos | `sistema_activo`: todo consulta esa marca y nada se borra |
| Historial y versiones | Los vídeos rehechos guardan `reemplaza_a`; los anteriores quedan como `reemplazado` |

---

## 15. Historia de decisiones (por qué está así)

1. **Higgsfield, abandonado:** los trabajos se quedaban en espera indefinidamente. Además, el usuario pidió hacerlo todo con Remotion.
2. **Imágenes con IA, descartadas:** por decisión del usuario se dibuja todo con código (kit de Remotion).
3. **ElevenLabs desde el contenedor de Claude:** no se puede descargar de `elevenlabsusercontent.com` (bloqueado). Por eso los recursos se descargan desde GitHub Actions.
4. **Límite de 180 s de n8n Cloud:** obligó a convertir la producción en una máquina de estados y a que el montaje avise por webhook en lugar de esperar.
5. **App gestionada de YouTube en n8n:** da `quotaExceeded`, así que se creó un proyecto propio de Google Cloud con OAuth propio, en producción para que el token no caduque cada 7 días.
6. **FRAME devolvía 1 sola escena:** la respuesta de Cohere se cortaba y el reparador de JSON se quedaba con la primera escena. Solución: nodo «Comprobar plan» y vuelta automática al paso `frame`.
7. **Ritmo:** el usuario pidió menos pausas, más velocidad, más energía y efectos de sonido. Se añadieron el recorte de pausas, la velocidad 1.12 y una biblioteca de efectos con colocación automática. `aselect` de ffmpeg no recortaba en el runner de GitHub, así que se cambió por `atrim` + `concat`.

---

## 16. Recetas de mantenimiento

- **Ver qué pasa:** el panel, `/estado` en Telegram, la tabla `eventos` o las *Executions* de n8n.
- **Cambiar la voz o su energía:** `update viralforge.configuracion set valor='"<voice_id>"' where clave='elevenlabs_voz';` (y `elevenlabs_velocidad`, `elevenlabs_estabilidad`, `elevenlabs_estilo`).
- **Cambiar la hora de entrega:** el cron de VF·12b y `hora_entrega`.
- **Cambiar los retrasos de publicación:** `retraso_publicacion_horas`.
- **Cambiar el estilo de los guiones:** edita `prompts_agentes` (SCRIPTOR) y la Biblia (`documentos.biblia_resumen`).
- **Cambiar de nicho:**
  1. Reescribe la Biblia y los prompts de SCRIPTOR, FRAME y GUARDIAN.
  2. Si hace falta, amplía el kit (objetos y fondos) y el catálogo que FRAME recibe en «Preparar encargo» (VF·05).
- **Pasar a Claude:** crea la credencial de Anthropic en n8n y, en VF·00, sustituye el nodo «Modelo IA (Cohere)» por un *Chat Model* de Anthropic. Todos los agentes cambian a la vez.
- **Lanzar una producción de prueba con el sistema parado:** `select public.vf_call('abrir_ciclo','{"forzar":true,"fecha":"2026-11-01"}');` y después ejecuta la «Vigilancia cada hora» de VF·10.
- **Reintentar una producción fallida:** `update viralforge.producciones set paso='<paso>', fallos_paso=0, bloqueado_hasta=null where id='<id>';` y ejecuta la vigilancia.
- **Si el bot de Telegram no responde:** revisa el token de «Telegram account» y despublica y vuelve a publicar VF·08b.
- **Si YouTube falla con un error de autenticación:** en «YouTube account», pulsa «Sign in with Google» de nuevo.

---

## 17. Hoja de ruta de mejoras

1. **ElevenLabs de pago** y la voz Manu Arias fija.
2. **Claude como cerebro**, con verificación de hechos (fuente obligatoria y comprobación cruzada en GUARDIAN).
3. **Activar SCOUT, METRICS y STORYLAB:**
   - SCOUT revisa a diario los canales de referencia (YouTube Data API: vídeos con más visitas por hora y *outliers*) y alimenta los temas.
   - METRICS lee las estadísticas de los vídeos publicados (24 h, 72 h y 7 días) y ajusta ganchos, duración y temas.
   - STORYLAB mantiene las plantillas narrativas que mejor funcionan.
4. **Música de fondo** generada (una pista por estado de ánimo, en bucle, a volumen 0,08-0,12).
5. **Mejoras visuales:**
   - subtítulos que esquiven las caras;
   - más objetos en la biblioteca;
   - validar que los SVG de la IA no salgan como cajas vacías;
   - transiciones más dinámicas.
6. **Prueba A/B de títulos y portadas.**
7. **Alertas de cuota** (ElevenLabs, YouTube) en el panel y en Telegram.

---

## 18. Referencias de formato

- Análisis del formato: `Documentos/VIRALFORGE AI/06_outputs/scout/referencias_formato_zingo.md`.
- Documentación de n8n anterior: `Documentos/VIRALFORGE AI/04_herramientas/n8n/SISTEMA_n8n.md`.
- Vídeos de prueba:
  - `06_outputs/videos/VF-0002_remotion.mp4`;
  - releases de GitHub VF-0003, VF-0004-v2, VF-0004-SFX-PRUEBA2 y VF-0003-v3.
