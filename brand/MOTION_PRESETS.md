# QOORA AI · MOTION PRESETS (animación de elementos)

**Brand DNA v1.0.** Código en `presets/qoora_motion.py`. Curvas en `CAMERA_LANGUAGE.md`.

| Preset | Qué hace | Valores | Cuándo |
| --- | --- | --- | --- |
| **QOORA_SUBS_KARAOKE** | Subtítulos palabra a palabra | Grupos de hasta 3 palabras o 16 letras, cortando en la puntuación · Poppins Bold 76 en MAYÚSCULAS · pastilla blanca (opacidad 235, radio 30) con la base del texto en y 1460 · palabra activa en naranja y el resto en tinta · entrada con escala 0,82 → 1 en 0,12 s (ease-out) | Siempre que hay voz |
| **QOORA_TEXT_RISE** | Entrada de titular | Fundido y subida de unos 30 px en 0,4–0,6 s (ease-out); la segunda línea entra unos 0,1 s después | Titulares de escena |
| **QOORA_TEXT_SLAM** | Palabra de impacto | Escala grande → 1 con QOORA_EASE_BACK en unos 0,3 s, más POP | La palabra clave del gancho |
| **QOORA_POP_IN_01** | Aparición con rebote | Escala 0 → 1 con QOORA_EASE_BACK (s = 1.7) en 0,35 s, desde el punto de anclaje (por ejemplo, la cola del bocadillo) | Tarjetas, chips, bocadillos, CTA |
| **QOORA_JUMP_01** | Salto de mascota | Agacharse (0–12 %): ancho ×1,12 y alto ×0,86 · vuelo: altura de 140 px, ancho ×0,94 y alto ×1,08 · aterrizaje (25 % extra): aplastamiento de ancho ×1,14 y alto ×0,84 · duración 0,55 s | Mascota que celebra, llega o reacciona |
| **QOORA_MASCOT_SHADOW** | Sombra de contacto | Elipse con un ancho del 60 % de la mascota que se encoge con la altura; color (70, 50, 30) con un 20 % de opacidad y desenfoque de 9 px | Siempre que la mascota toca el suelo |
| **QOORA_SPEECH_BUBBLE** | Bocadillo | Poppins Bold 44, tarjeta blanca con borde de 5 px, radio 34, cola abajo o a la izquierda · entra con POP_IN y sale encogiéndose en 0,2 s | La mascota "habla" (máximo 4 palabras) |
| **QOORA_STAMP_01** | Sello | Escala 2,4 → 1 en 0,18 s, girado -11°, borde rojo de 14 px y texto Poppins Bold 96 | Problemas: "BLOQUEADA", "NO ENVÍA"… |
| **QOORA_CONFETTI** | Confeti | 70 piezas en abanico hacia arriba a 700–1500 px/s con gravedad, durante 2,2 s; colores naranja, verde, amarillo, tinta y salmón | Revelación y logro (máximo 2 por vídeo) |
| **QOORA_SPARKLES** | Destellos | Rayos alrededor del objeto en un radio de unos 160 px que aparecen y se apagan | Remates pequeños |
| **QOORA_MAGNIFIER** | Lupa | Lupa que recorre la zona de búsqueda | El agente busca |
| **QOORA_COIN_SPIN** | Moneda | Moneda que gira junto a los precios | Datos de dinero |
| **QOORA_CARD_FAN** | Abanico | Tarjetas que entran como cartas, una tras otra, con giro | Opciones o resultados |
| **QOORA_LIVING_BG** | Fondo vivo | 5 círculos naranjas (opacidad 22) de 90–210 px de radio que flotan (40 px en x, 50 px en y, velocidad 0,28–0,5) y una rejilla de puntos cada 80 px que baja a 18 px/s | Fondo de todas las escenas |
| **QOORA_SIGNATURE** | Firma superior | Cuadradito naranja de 22 px · NOMBRE en Poppins Bold 34 · "· descripción" en Inter Medium 28 gris, en x 70, y 112–142. Estática | Todas las escenas |

## Reglas
- Todo movimiento de entrada usa ease-out o back. **Nunca** ease-in.
- No se anima nada desde escala 0 salvo el rebote de POP_IN, que es intencionado y forma parte de la marca.
- Escalonado: los elementos de una lista entran cada 0,3–0,55 s, cada uno con su POP.
- La mascota siempre hace algo (respira, salta, señala). Nunca está quieta más de 2 s.
