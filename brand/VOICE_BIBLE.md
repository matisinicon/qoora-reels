# QOORA AI · VOICE BIBLE

**Brand DNA v1.0.** La voz es la firma más reconocible de la marca y se usa **siempre la misma**.

## 1. Voz principal: "La voz QOORA"

| Campo | Valor |
| --- | --- |
| Proveedor | **ElevenLabs** (conector conectado en Claude) |
| Herramienta | `creative_generate_speech` |
| Modelo | **eleven_v4** |
| Voz | **Manu Arias - Español Viral** |
| **Voice ID** | **`cfU714yVeokYQrpdyev5`** |
| Idioma | Español |
| Acento | Español peninsular (España), según la ficha de ElevenLabs |
| Género vocal | Masculino |
| Edad percibida | Joven adulto, unos 25–35 años |
| Timbre | Claro y cálido, con presencia |
| Profundidad | Media, sin graves exagerados de "tráiler" |
| Velocidad | **Natural**. Prohibido acelerarla: el ritmo lo ponen la imagen y el sonido |
| Entonación | Viva, con subidas en las preguntas y en las palabras clave |
| Energía | Alta pero creíble: un experto entusiasmado, no un anuncio de teletienda |
| Emoción habitual | Seguridad cercana, curiosidad y una sonrisa en la voz |
| Estilo de narración | Profesional de la IA agéntica que cuenta un caso real a un dueño de negocio |
| Referencia | `voces/QOORA_VOZ_PRINCIPAL_referencia_RASTRO.mp3` (toma aprobada) |

### Configuración de generación
- **Estabilidad, similitud, estilo y speaker boost**: los **valores por defecto** del conector de ElevenLabs. Así se hizo RASTRO (aprobado) y también TURNO. El conector no expone estos ajustes, así que no se tocan (D-03 resuelta: se usan los valores por defecto).
- **Coste orientativo**: unos 480 caracteres por cada 30 s de guion (plan gratuito: 10.000 al mes).
- **Velocidad**: 1.0 (por defecto). No se toca.
- **Una toma por guion completo**, que luego se corta en frases según los silencios. Así la entonación es continua y no suena a frases sueltas.

### Configuración de audio
- Se descarga en MP3 y se convierte a WAV mono a 44,1 kHz para la mezcla.
- Se normaliza al pico y se aplica una saturación suave (`tanh(x·1.1)/tanh(1.1)`).
- Nivel en la mezcla: voz ×0.9 sobre efectos ×0.6 (ver `SOUND_BIBLE.md`).
- Espacio entre frases en el montaje: 0,25 s antes de la primera, 0,30 s entre frases y 0,50 s de cola al final de la escena.

## 2. Voz secundaria
**Ninguna en v1.0.** Si un vídeo necesita diálogo (por ejemplo, un cliente que habla), se propone una voz secundaria, se aprueba y se registra aquí con su Voice ID antes de usarla.

## 3. Forma de leer

- **Énfasis**: la palabra clave de cada frase, la misma que va en naranja en pantalla. Se escribe en el guion en **MAYÚSCULAS** para que la voz la marque.
- **Pausas características**:
  - pausa corta (coma) antes del dato importante: "Perdía… HORAS";
  - silencio de unos 0,45 s justo antes de la revelación del agente (`BRAND_EMOTIONAL_PAUSE`).
- **Preguntas**: con subida clara al final ("¿Quieres uno para tu negocio?").
- **Cifras**: se dicen tal como se leen en pantalla ("cuarenta euros con un céntimo").

## 4. Pronunciación de nombres propios

| Nombre | Cómo se dice | Estado |
| --- | --- | --- |
| RASTRO | "RAS-tro" | Aprobado |
| QOORA | **"Córa"** (en el guion de voz se escribe "Córa"; en pantalla y subtítulos, "QOORA") | ✅ Aprobado (D-02, 26/11/2026) |
| Donat Clasics | "Do-NAT CLÁ-sics" | Usado en RASTRO |
| Land Rover / Defender | Como en España: "Land Róver", "Defénder" | Usado |
| eBay | "i-béi" | Usado |
| IA / AI | "IA" en español ("i-a"); "ei-ai" solo dentro de "QOORA AI" | Regla |

Si ElevenLabs pronuncia mal un nombre, se escribe fonéticamente en el guion de voz (no en los subtítulos) y se anota aquí.

## 5. Reglas de protección de la voz

1. **No se cambia la voz principal sin autorización expresa** del dueño de la marca.
2. Antes de generar, se comprueba que el Voice ID `cfU714yVeokYQrpdyev5` sigue en la lista de voces (`creative_list_voices`).
3. **Si no está disponible**: se para, se avisa al dueño y se proponen 2–3 alternativas parecidas con muestras. No se sustituye en silencio.
4. No se cambia de modelo (eleven_v4) sin probar antes que la voz suena igual con la toma de referencia.
5. Cualquier cambio aprobado sube la versión del Brand DNA (`BRAND_VERSION.md`).
