# QOORA AI · EDITING PRESETS

**Brand DNA v1.0.** Son los bloques de montaje de la marca. Se eligen **según el contenido de cada escena** y no se aplican en bloque. Todos usan los nombres de `CAMERA_LANGUAGE.md`, `SOUND_BIBLE.md` y `MOTION_PRESETS.md`.

Todas las escenas llevan además: QOORA_PUNCH_IN_01 al entrar, QOORA_SFX_WHOOSH en el corte, QOORA_WHIP_OUT_01 al salir (salvo la última), subtítulos QOORA_SUBS_KARAOKE y fondo QOORA_LIVING_BG.

---

### BRAND_HOOK — gancho
| | |
| --- | --- |
| Duración | 2,4–3 s |
| Ritmo | Muy alto; la primera palabra suena antes de 0,1 s |
| Cámara | QOORA_PUSH_IN_01, foco en el titular |
| Animación | Titular en dos golpes: frase normal y después palabra de impacto gigante en naranja (150–200 px) con QOORA_TEXT_SLAM |
| Sonido | QOORA_SFX_OPEN · POP en la palabra de impacto · TICK si hay reloj |
| Transición | Corte con WHIP_OUT |
| Intensidad | 5/5 |
| Cuándo | Siempre, como primera escena. Presenta el dolor del cliente en una idea ("Este taller perdía HORAS") |

### BRAND_PROBLEM_STACK — el problema en capas
| | |
| --- | --- |
| Duración | 4–5 s |
| Ritmo | Alto; un elemento nuevo cada 0,5 s |
| Cámara | QOORA_PUSH_IN_01 |
| Animación | Chips o tarjetas que caen torcidas (QOORA_POP_IN_01, rotación entre -4° y 4°) hasta llenar el plano |
| Sonido | POP por cada elemento; BUZZ si hay un sello BLOQUEADA |
| Transición | WHIP_OUT |
| Intensidad | 4/5 |
| Cuándo | Para enumerar complicaciones: idiomas, aduanas, referencias, precios… |

### BRAND_EMOTIONAL_PAUSE — respiro antes de revelar
| | |
| --- | --- |
| Duración | 0,4–0,6 s (dentro de la escena anterior o al empezar la revelación) |
| Ritmo | Parada: silencio de voz y de efectos |
| Cámara | Quieta o QOORA_SLOW_ZOOM_01 |
| Animación | Ninguna nueva; el plano respira |
| Sonido | Silencio y, después, RISER |
| Transición | Hacia BRAND_REVEAL |
| Intensidad | 1/5 (por contraste) |
| Cuándo | Solo una vez por vídeo, justo antes de presentar el agente |

### BRAND_REVEAL — presentación del agente
| | |
| --- | --- |
| Duración | 2,4–3 s |
| Ritmo | Explosivo y después se asienta |
| Cámara | QOORA_PULL_OUT_01 (1.9 → 1) |
| Animación | Antetítulo "Así nació" · la mascota cae del cielo con QOORA_JUMP_01 y aterriza aplastándose · halo naranja suave · nombre en Poppins Bold gigante · lema en naranja ("No un chatbot. Un agente.") · QOORA_CONFETTI |
| Sonido | QOORA_SFX_REVEAL (riser y boom) + sacudida |
| Transición | WHIP_OUT |
| Intensidad | 5/5 |
| Cuándo | Una vez por vídeo, cuando aparece la solución |

### BRAND_PROCESS_STEP — cómo trabaja el agente
| | |
| --- | --- |
| Duración | 3,4–4,8 s por paso |
| Ritmo | Medio-alto, explicativo |
| Cámara | QOORA_TILT_IN_R y _L alternados entre pasos |
| Animación | Etiqueta "PASO 0X" · titular corto · prueba visual (lupa que busca, tarjetas que se reparten en abanico, desglose de precios con monedas) · la mascota hace un gesto relacionado |
| Sonido | WHOOSH · TYPE en ráfaga mientras busca · DING en cada dato confirmado · CLICK al elegir |
| Transición | WHIP_OUT |
| Intensidad | 3–4/5 |
| Cuándo | De 2 a 4 pasos numerados. Cada paso muestra **una acción concreta** del agente |

### BRAND_FAST_CUT — ráfaga de datos
| | |
| --- | --- |
| Duración | 1,5–2,5 s |
| Ritmo | Muy alto; cambio de elemento cada 0,3 s |
| Cámara | QOORA_PUSH_IN_01 corto |
| Animación | Chips o cifras que aparecen y se sustituyen en el mismo sitio (QOORA_POP_IN_01) |
| Sonido | POP o TICK en cada cambio |
| Transición | WHIP_OUT |
| Intensidad | 4/5 |
| Cuándo | Para listas rápidas (países, tiendas, opciones) que no necesitan leerse una a una |

### BRAND_RESULT — el resultado
| | |
| --- | --- |
| Duración | 4–6 s |
| Ritmo | Alto con remate |
| Cámara | QOORA_PULL_OUT (1.7) o PUSH_IN |
| Animación | Tarjeta de resultado con datos **reales** del caso · comparativa (correcto en verde, descartado con sello) · cierre con QOORA_CONFETTI o destellos |
| Sonido | POP en las tarjetas · DING, DING, BUZZ (descarte), DING · REWARD en el remate · IMPACT si cierra fuerte |
| Transición | WHIP_OUT |
| Intensidad | 4–5/5 |
| Cuándo | Para mostrar qué entrega el agente. Nunca con cifras inventadas |

### BRAND_TRANSITION — corte de la marca
| | |
| --- | --- |
| Duración | 0,14 s de salida + 0,22 s de entrada |
| Cámara | QOORA_WHIP_OUT_01 → QOORA_PUNCH_IN_01 |
| Sonido | QOORA_SFX_WHOOSH en el corte |
| Cuándo | Entre todas las escenas. Es la transición por defecto; no se usan fundidos ni cortinillas |

### BRAND_FINAL_FRAME — cierre e invitación
| | |
| --- | --- |
| Duración | 4–5 s |
| Ritmo | Alto que se asienta y termina con un golpe |
| Cámara | QOORA_PULL_OUT_02 (1.5 → 1), sin WHIP_OUT |
| Animación | Halo y mascota mirando a cámara · "¿Quieres uno para **tu negocio**?" · pastilla CTA "Comenta **AGENTE**" con QOORA_POP_IN_01 |
| Sonido | WHOOSH + BOOM al entrar · POP en la pregunta · QOORA_SFX_IMPACT en el CTA |
| Intensidad | 5/5 |
| Cuándo | Siempre, como última escena |

---

## Plantilla de escaleta (copiar en cada vídeo)
| Escena | Preset | Duración | Cámara | Sonidos clave | Texto en pantalla | Voz |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BRAND_HOOK | | | | | |
| … | | | | | | |
| N | BRAND_FINAL_FRAME | | | | | |
