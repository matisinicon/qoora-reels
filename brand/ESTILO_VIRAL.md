# ESTILO VIRAL — QOORA AI (v1.0 · 26-11-2026)

Cómo hacen sus reels las cuentas de referencia del nicho, y cómo lo aplicamos a QOORA.
**Regla de oro:** copiamos la *forma* (ritmo, ganchos, animación), nunca el *fondo*. El fondo es siempre QOORA: agentes de IA, automatización y sistemas para negocios. Sin clientes, cifras ni resultados inventados.

Se usa junto a `BRAND_DNA.md`, `VOICE_BIBLE.md` y `CAMERA_LANGUAGE.md`. Si algo choca, manda el Brand DNA (colores, voz, logo).

---

## 1. Referencias analizadas

| Cuenta | Qué es | Reels top observados |
|---|---|---|
| @carlosai_ | IA & Claude, "qué IA usar para cada cosa" | "Claude tiene 6 niveles de usuario" 189 k · "Instagram deja que Claude te edite los reels" 157 k · 108 k · 78,8 k |
| @lynxstudiosbcn | "La primera oficina de agentes IA" (nicho más cercano a QOORA) | "Ya puedes usar Higgsfield gratis desde Claude" 702 k · 306 k · 219 k · 170 k |
| @oscarboix.ia | IA para negocios | "Construye tu propio J.A.R.V.I.S. en un fin de semana, 9 pasos" 774 k · 117 k · 99,9 k |

Los vídeos que funcionan duran **30-65 s**. Los de menos de 3 k visualizaciones tienen el mismo formato pero un gancho flojo: **el gancho decide**.

## 2. Lo que comparten los tres (la fórmula)

1. **Todo es motion graphics, sin cara.** Fondo negro o casi negro, un solo color de acento (naranja en Carlos, lima en Óscar, blanco frío en Lynx) y voz en off.
2. **Gancho en el primer segundo, con texto ya en pantalla.** Nunca hay intro ni logo al principio.
3. **Estructura de lista numerada.** "6 niveles", "9 pasos", "3 formas". Promete un número y lo cumple.
4. **Cabecera fija de progreso.** Una etiqueta arriba ("DE CERO A EXPERTO", "POR DENTRO", "PASO 6") con un chip "NIVEL 2/6" y puntos de progreso. Quien mira sabe cuánto queda y se queda.
5. **Subtítulos cinéticos palabra a palabra.** Texto grande y centrado, de 1 a 4 palabras por golpe. La palabra clave lleva **caja de color** ("primero", "Mac") o **cursiva serif en el color de acento** ("¿En qué *nivel* estás?").
6. **Cambio visual cada 1,5-3 s.** Iconos de apps que entran con pop, ventanas de app simuladas (chat, terminal tecleando), objetos 3D con brillo (estrella, claqueta, escalones iluminados) y focos de escenario.
7. **Cierre con una sola petición.** "Comenta PALABRA y te mando…" (el más usado, porque genera comentarios), "Guárdatelo" o "Sígueme para más".

## 3. Banco de ganchos (adaptados a QOORA)

| Fórmula | Ejemplo de referencia | Versión QOORA |
|---|---|---|
| Niveles + pregunta | "Claude tiene 6 niveles de usuario. ¿En qué nivel estás?" | "Hay 5 niveles de automatización en un negocio. ¿En cuál está el tuyo?" |
| Construye X en N pasos | "Construye tu propio J.A.R.V.I.S. en un fin de semana. 9 pasos" | "Así se construye un recepcionista con IA. 6 pasos" |
| Noticia + giro | "Ya puedes usar X gratis desde Claude. Y a X no le ha hecho gracia" | Solo con noticias reales y comprobadas el mismo día. Nunca inventadas |
| Por dentro | "POR DENTRO: así funciona…" | "Por dentro: qué hace un agente de IA cuando nadie lo mira" |
| N formas de | "3 formas de usar los modelos de Claude Code" | "3 tareas de tu negocio que un agente ya puede hacer solo" |
| Error común | — | "El error que comete todo el mundo al automatizar con IA" |

Los ganchos se puntúan con `hookscore.py` (skill ig-reel). Si el ganador saca menos de 50, se reescribe.

## 4. Ritmo (plantilla de 40-55 s)

```
0,0-1,5 s   GANCHO     texto grande ya visible + objeto que entra con pop. La voz empieza en el fotograma 0.
1,5-5 s     PROMESA    "N pasos / niveles". Aparece la cabecera fija con los puntos de progreso.
5-45 s      CUERPO     un paso cada 4-7 s. Cada paso: chip "PASO n/N", título de 1-3 palabras y una
                       demo visual (chat, terminal, flujo de nodos, agenda). Cambio visual cada 1,5-3 s.
últimos 5 s CIERRE     resultado + "Comenta AGENTE y te lo explico" + firma QOORA (sin logo al inicio).
```

## 5. Cómo se traduce a nuestro motor (Remotion)

- **Línea:** la oscura (`presentacion/kit.tsx`) es la más parecida a las referencias. Fondo #050505, acento #FF8500, Poppins.
- **Nuevo en el motor** (por construir en `engine/`):
  - `HeaderProgress`: etiqueta fija arriba, chip "PASO n/N" y puntos de progreso.
  - `KineticCaption`: subtítulo palabra a palabra con caja naranja o cursiva serif para la palabra clave. La palabra anterior queda gris.
  - `AppWindow`: ventana simulada (chat, terminal tecleando, panel de n8n).
  - `GlowObject`: objeto con brillo y halo (engranaje, robot, rayo) que entra con pop.
  - `Stage`: focos de escenario de fondo para los momentos de "nivel".
  - Tipo de escena `step` (lista numerada) y plantilla `levels` / `steps` en el ReelSpec.
- **Voz:** la de siempre (Manu Arias, ElevenLabs). Ritmo rápido, frases cortas, sin muletillas.
- **CTA:** "Comenta AGENTE" (palabra clave de QOORA). Una sola petición por vídeo.

## 6. Prohibido

- Copiar textos, guiones, diseños concretos o música de las referencias.
- Noticias o datos que no se hayan comprobado ese mismo día.
- Clientes, cifras o resultados inventados (regla del Brand DNA).
- Intro con logo, saludos, "en este vídeo…".
