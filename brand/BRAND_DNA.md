# QOORA AI · BRAND DNA (biblia audiovisual)

**Versión vigente: v1.1** (26/11/2026). Historial en `BRAND_VERSION.md`.
**Origen:** el vídeo de RASTRO aprobado por el dueño de la marca ("PERFECTO, ME ENCANTA"). Todo lo que hay aquí sale de ese vídeo, no de suposiciones.

> **Principio:** cada vídeo es distinto en su historia y reconocible en su marca. La creatividad cambia; la identidad se mantiene.

Este documento es **obligatorio**: se consulta antes de diseñar cualquier vídeo de QOORA AI. Ningún vídeo inventa una identidad visual nueva.

---

## Mapa de la biblia

| Archivo | Qué define |
| --- | --- |
| `BRAND_DNA.md` | Personalidad, tono, reglas maestras y checklist de continuidad (este archivo) |
| `VOICE_BIBLE.md` | Voz permanente: proveedor, Voice ID, estilo de locución y pronunciación |
| `VISUAL_BIBLE.md` | Color, tipografía, composición, iluminación y tratamiento de imagen |
| `CAMERA_LANGUAGE.md` | Movimientos de cámara aprobados y su configuración |
| `SOUND_BIBLE.md` | Identidad sonora y biblioteca de efectos con nombre |
| `EDITING_PRESETS.md` | Bloques de montaje de la marca (gancho, revelación, cierre…) |
| `MOTION_PRESETS.md` | Animaciones recurrentes de elementos: texto, mascota, tarjetas |
| `BRAND_ASSETS.md` | Inventario de recursos reutilizables y dónde están |
| `BRAND_VERSION.md` | Versiones y registro de cambios |
| `presets/qoora_motion.py` | Los presets en código, listos para usar |

---

## 1. Personalidad de la marca

QOORA AI habla como un **ingeniero de IA agéntica que explica cosas complejas con claridad y buen humor**.
- **Experta, no pedante**: demuestra que sabe con casos reales, no con jerga.
- **Cercana y con energía**: habla a dueños de negocio, no a técnicos.
- **Honesta**: no promete magia. Los agentes trabajan y las personas aprueban.
- **Con chispa**: la mascota y los gags visuales hacen que se vea entero, pero la información manda.

**En tres palabras:** clara · enérgica · fiable.

## 2. Tono narrativo

- Contamos **casos reales** como una mini historia: problema → agente → resultado → invitación.
- Frases cortas que se entienden a la primera escucha. Una idea por frase.
- Se tutea al espectador.
- Se evitan el humo ("revolucionario", "magia de la IA"), los datos inventados y las promesas de resultados.
- Fórmula de cierre fija: **"¿Tu negocio también necesita un agente personalizado? Comenta AGENTE."**

## 3. Estilo de comunicación

- **Se muestra, no solo se cuenta**: cada frase tiene algo en pantalla que la ilustra (tarjeta, icono, gag de la mascota).
- **Siempre hay subtítulos**, palabra a palabra (ver `MOTION_PRESETS.md`, QOORA_SUBS_KARAOKE).
- Ritmo alto y **voz a velocidad natural**: el dinamismo lo ponen la imagen y el sonido, nunca una voz acelerada.

## 4. Formato base

| Parámetro | Valor |
| --- | --- |
| Formato | Vertical 9:16, 1080×1920 |
| Fotogramas | 30 fps |
| Duración | 30–60 s (RASTRO: 47 s) |
| Escenas | 8–10, de 2,4 a 6,8 s cada una |
| Códec de entrega | H.264 (libx264, CRF 18), audio AAC estéreo a 44,1 kHz |
| Plataformas | TikTok, Instagram Reels, YouTube Shorts |

## 5. Estructura narrativa tipo

1. **Gancho** (≤3 s): el dolor del cliente en grande → `BRAND_HOOK`
2. **Problema**: lista visual de complicaciones → `BRAND_PROBLEM_STACK`
3. **Revelación del agente**: aparece la mascota o el sistema → `BRAND_REVEAL`
4. **Cómo funciona** (2–4 pasos numerados "PASO 0X") → `BRAND_PROCESS_STEP`
5. **Resultado**: dato real del caso, sin inventar → `BRAND_RESULT`
6. **Cierre e invitación** → `BRAND_FINAL_FRAME`

## 6. Elementos visuales distintivos

- **Lienzo crema cálido** con formas naranjas que flotan suavemente y una rejilla de puntos que se desplaza (`QOORA_LIVING_BG`).
- **Firma arriba a la izquierda**: cuadradito naranja + NOMBRE en negrita + "· descripción" en gris (por ejemplo, "RASTRO · agente de compras con IA").
- **Titulares en Poppins Bold** con la palabra clave en naranja.
- **Subtítulos tipo karaoke** dentro de una pastilla blanca, con la palabra activa en naranja.
- **Etiqueta "PASO 0X"** en naranja sobre fondo naranja suave.
- **Mascota 3D por agente**, con personalidad: salta, se aplasta y estira, habla con bocadillos.
- **Tarjetas blancas** redondeadas con sombra cálida suave.
- **Gags recurrentes**: sello "BLOQUEADA" para los problemas, lupa para buscar, monedas para dinero y confeti para los logros.

## 7. Introducciones y cierres

- **Intro**: no hay cabecera de logo. El vídeo empieza directamente con el gancho (QOORA_PUNCH_IN_01 + QOORA_SFX_OPEN). La firma superior identifica el vídeo desde el primer fotograma.
- **Cierre**: halo naranja con la mascota, "¿Quieres uno para **tu negocio**?" y la pastilla CTA "Comenta **AGENTE**", acompañados de QOORA_SFX_IMPACT.

---

## 8. Reglas maestras

1. **Antes de diseñar**, leer esta biblia completa y `BRAND_VERSION.md`.
2. **La voz principal no se cambia** sin autorización expresa. Si deja de estar disponible, avisar y esperar respuesta (ver `VOICE_BIBLE.md`).
3. **Sin música de fondo** en v1.0: solo voz y efectos de la biblioteca.
4. **Reutilizar antes que crear.** Si ya hay un efecto, preset o recurso que cumple la función, se usa ese.
5. Los presets **se eligen según el contenido**; no se aplican en bloque a todas las escenas.
6. Cualquier desviación de la biblia se **justifica por escrito** en la entrega.
7. Todo cambio de identidad **sube la versión** y queda registrado. Nada cambia en silencio.
8. Nada inventado: ni clientes, ni cifras, ni testimonios.

## 9. Checklist de continuidad (en cada vídeo, antes de entregar)

| # | Comprobación | ✔ / desviación justificada |
| --- | --- | --- |
| 1 | ¿Usa la voz principal correcta (Voice ID de `VOICE_BIBLE.md`)? | |
| 2 | ¿Mantiene el estilo de narración (cercano, experto, velocidad natural)? | |
| 3 | ¿Respeta la paleta visual (`VISUAL_BIBLE.md`)? | |
| 4 | ¿Usa solo las tipografías aprobadas (Poppins y Inter)? | |
| 5 | ¿La cámara usa presets de `CAMERA_LANGUAGE.md`? | |
| 6 | ¿El sonido sale de la biblioteca QOORA_SFX y va sin música? | |
| 7 | ¿Las escenas usan presets de `EDITING_PRESETS.md` elegidos con criterio? | |
| 8 | ¿Mantiene la personalidad narrativa y el cierre "Comenta AGENTE"? | |
| 9 | Si se quita el logo, ¿se reconoce como QOORA AI? | |
| 10 | ¿Hay alguna desviación? Indicar cuál y por qué. | |

Esta tabla, rellenada, acompaña cada entrega.

---

## 10. Decisiones abiertas (requieren al dueño de la marca)

- **D-01 · Lienzo claro u oscuro → RESUELTA en v1.1, con dos líneas:**
  - **Línea de casos** (agentes como RASTRO o TURNO, demos de producto): lienzo crema, mascotas y gags.
  - **Línea corporativa oscura** (presentación de QOORA AI, vídeos institucionales, mensajes de marca): fondo negro `#050505` con cuadrícula de 72 px, círculos concéntricos, núcleo hexagonal con el símbolo, líneas finas que se dibujan, nodos que pulsan, datos que recorren las conexiones y luz naranja `#FF8500` localizada. Las etiquetas van en español y en mayúsculas espaciadas (Inter Bold). Los subtítulos van en una pastilla oscura con la palabra activa en naranja, a y = 1300, dentro de la zona segura de Instagram. Código en `VIDEOS/remotion-qoora/src/presentacion/kit.tsx`.
  - Voz, sonido, cámara, curvas y tipografías son **las mismas** en las dos líneas.
- **D-02 · Pronunciación de "QOORA" → RESUELTA:** se dice **"Córa"** (ver `VOICE_BIBLE.md`).
- **D-03 · Parámetros finos de la voz → RESUELTA:** se usan los valores por defecto del conector.
