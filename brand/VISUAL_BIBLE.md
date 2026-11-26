# QOORA AI · VISUAL BIBLE

**Brand DNA v1.0.** Referencias visuales en `referencias/` (fotogramas del vídeo aprobado de RASTRO).

## 1. Color

### Paleta principal (vídeo)
| Nombre | RGB | HEX | Uso |
| --- | --- | --- | --- |
| QOORA Crema (fondo) | 250, 247, 242 | `#FAF7F2` | Lienzo de todas las escenas |
| QOORA Tinta | 28, 27, 25 | `#1C1B19` | Titulares y texto principal |
| QOORA Naranja | 240, 125, 26 | `#F07D1A` | Palabra clave, acentos, palabra activa del subtítulo, CTA |
| QOORA Naranja suave | 253, 234, 214 | `#FDEAD6` | Halos, etiquetas "PASO", fondos de realce |
| Gris cálido | 112, 106, 98 | `#706A62` | Texto secundario y firma |
| Línea | 232, 225, 214 | `#E8E1D6` | Separadores |
| Tarjeta | 255, 255, 255 | `#FFFFFF` | Tarjetas y pastillas de subtítulo |

### Paleta secundaria (solo estados)
| Nombre | HEX | Uso |
| --- | --- | --- |
| Verde OK | `#2E9E5B` (fondo `#DEF3E6`) | Confirmado y correcto |
| Rojo error | `#D64545` (fondo `#FAE1E1`) | Sello "BLOQUEADA" y problemas |
| Ámbar | `#CD8C14` (fondo `#FAEED2`) | Avisos |
| Amarillo confeti | `#FFC43D` | Solo en celebraciones |

### Paleta corporativa (web, logo y material oscuro)
Negro `#050505`/`#101010`, naranja `#FF8500`/`#FF9F24` y blanco. En vídeo solo se usa en piezas oscuras aprobadas (ver decisión D-01 en `BRAND_DNA.md`).

**Regla:** el naranja es el único color de acento. Una sola palabra o elemento naranja por bloque de texto. Nada de morados, azules ni degradados de colores.

## 2. Tipografía
Archivos en `tipografias/` (licencia SIL OFL).

| Rol | Fuente | Tamaño (lienzo 1080) | Notas |
| --- | --- | --- | --- |
| Titular grande | Poppins Bold | 78–92 px | Dos líneas como máximo, palabra clave en naranja |
| Titular de impacto | Poppins Bold | 150–200 px | Una sola palabra en mayúsculas ("HORAS") |
| Subtítulo karaoke | Poppins Bold, MAYÚSCULAS | 76 px | Pastilla blanca, ver MOTION_PRESETS |
| Antetítulo | Poppins Bold | 64 px, gris | Por ejemplo, "Así nació" |
| Firma superior | Poppins Bold 34 + Inter Medium 28 | — | "RASTRO · agente de compras con IA" |
| Texto de tarjeta | Inter Regular / Medium / SemiBold | 28–40 px | Datos, listas y precios |
| Bocadillo | Poppins Bold | 44 px | Texto corto con puntos suspensivos |
| Etiqueta PASO | Poppins Bold | 30–34 px | Naranja sobre naranja suave |

- **Peso**: titulares siempre Bold; el texto de lectura en Inter, entre Regular y SemiBold.
- **Espaciado**: el normal de la fuente; interlineado de los titulares en torno a 1,1.
- **Animación de texto**: ver `MOTION_PRESETS.md` (QOORA_TEXT_RISE, QOORA_SUBS_KARAOKE).

## 3. Composición (1080 × 1920)

| Zona | Posición | Contenido |
| --- | --- | --- |
| Firma | x 70, y 112–142 | Marca del agente o proyecto |
| Titular | y 280–560, centrado | Idea de la escena |
| Centro visual | y 600–1300 | Mascota, tarjeta o gag principal (centro de interés en torno a y 860–900) |
| Subtítulos | y 1440–1565, centrados | Siempre aquí, nunca encima de la mascota |
| Zona segura inferior | y > 1600 | Libre de texto (interfaz de TikTok/Reels) |
| Márgenes laterales | 70–80 px | Ningún texto más pegado al borde |

- La mascota va centrada o a un lado (en torno a x 300 o x 780) cuando comparte plano con una tarjeta.
- **Espacio negativo**: al menos un 35 % del lienzo libre. Una idea por plano.
- **Información**: titular arriba, prueba visual en el centro y subtítulo abajo, siempre en ese orden.

## 4. Iluminación
Estilo **ilustración 3D suave de estudio**: luz cálida difusa desde arriba y sombras de contacto suaves. No hay luces duras, contraluces cinematográficos ni ambientes fríos.
- Sombras de contacto: elipse marrón cálido (70, 50, 30) con un 20 % de opacidad y desenfoque de 9 px.
- Sombras de tarjeta: (60, 40, 20) con un 16 % de opacidad, desenfoque de 12 px y 10 px hacia abajo.
- Halo detrás del protagonista: círculo naranja suave de 300–340 px de radio.

## 5. Tratamiento de imagen
| Parámetro | Valor |
| --- | --- |
| Contraste | Medio-alto: tinta oscura sobre crema |
| Saturación | Moderada; solo el naranja va saturado |
| Nitidez | Bordes limpios, sin efecto de enfoque |
| Textura y grano | **Ninguno** |
| Profundidad | Por capas: fondo vivo → formas → tarjetas con sombra → mascota → subtítulo |
| Sombras | Suaves, cálidas y nunca negras |
| Estilo de color | Cálido y limpio, sin etalonaje cinematográfico |

## 6. Personajes
Cada agente tiene **su propia mascota** con el mismo ADN: un cubo redondeado de color crema, con detalles naranjas, ojos simples, mofletes y un render 3D suave. RASTRO es el modelo de referencia (`recursos/RASTRO_*.png`, cuatro vistas: frente, tres cuartos, lado y espalda). Una mascota nueva tiene que parecer de la misma familia.
