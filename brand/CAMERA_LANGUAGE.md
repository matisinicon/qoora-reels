# QOORA AI · CAMERA LANGUAGE

**Brand DNA v1.0.** El código está en `presets/qoora_motion.py`. Los valores salen del vídeo aprobado de RASTRO.

La cámara de QOORA es **viva pero controlada**: cada escena tiene un movimiento principal, entra con un golpe de zoom y sale con un zoom rápido. Nunca hay dos movimientos principales en la misma escena.

## Curvas de la marca
| Nombre | Fórmula | Uso |
| --- | --- | --- |
| QOORA_EASE_OUT | cúbica: `1-(1-x)³` | Entradas y alejamientos |
| QOORA_EASE_IN_OUT | cúbica simétrica | Empujes lentos durante la escena |
| QOORA_EASE_BACK | rebote (s = 1.7) | Apariciones de tarjetas y bocadillos |

## Movimientos principales (uno por escena)

| Preset | Configuración | Sensación | Cuándo |
| --- | --- | --- | --- |
| **QOORA_PUSH_IN_01** | zoom 1 → 1.07 durante toda la escena, ease-in-out, foco en el centro de interés | Tensión que crece | Gancho, problema y explicación con mucha información |
| **QOORA_PULL_OUT_01** | zoom 1.9 → 1 en 0,7 s, ease-out | Revelación: "mira lo que hay" | Presentación del agente y resultados |
| **QOORA_PULL_OUT_02** | zoom 1.5 → 1 en 0,7 s, ease-out | Revelación suave | Cierre y CTA |
| **QOORA_TILT_IN_R / _L** | trapecio del 16 % y 120 px de desplazamiento que se endereza en 0,6 s; después, empuje 1 → 1.05 | Pasar página, avanzar | Pasos del proceso. Se alternan derecha e izquierda entre pasos seguidos |
| QOORA_DRIFT_LAT_01 | desplazamiento lateral de 40 px en toda la escena | Calma | *Propuesta v1.0, aún no usada.* Tarjetas de datos largas |
| QOORA_SLOW_ZOOM_01 | zoom 1 → 1.03 en toda la escena | Contemplación | *Propuesta v1.0, aún no usada.* Pausas emotivas |

## Movimientos de transición (en todas las escenas)
| Preset | Configuración |
| --- | --- |
| **QOORA_PUNCH_IN_01** | entrada: zoom 1.14 → 1 en 0,22 s (ease-out) |
| **QOORA_WHIP_OUT_01** | salida: últimos 0,14 s, zoom 1 → 1.35 (curva cuadrática) con desenfoque de movimiento doble. No se aplica en la última escena |

## Efecto de impacto
| Preset | Configuración |
| --- | --- |
| **QOORA_IMPACT_SHAKE_01** | sacudida de 16 px que decae en 0,28 s (sin 90 / cos 70). **Solo** si suena BOOM, IMPACT, BUZZ o REWARD, sincronizada con ese sonido |

## Parallax y profundidad
- **QOORA_LIVING_BG** (ver `MOTION_PRESETS.md`): formas de fondo que flotan a distintas velocidades (0,28–0,50) y una rejilla de puntos que baja a 18 px/s. Da parallax constante sin mover la cámara.
- La cámara lenta real no forma parte de la marca. Para un momento de pausa se usa QOORA_SLOW_ZOOM_01 y silencio.

## Reglas
1. Un movimiento principal por escena. PUNCH_IN y WHIP_OUT acompañan siempre.
2. No se repite el mismo movimiento principal en más de dos escenas seguidas.
3. El foco del zoom se pone donde está la información (titular, mascota o tarjeta), nunca en el vacío.
4. No hay rotaciones de cámara ni zooms superiores a 1.9.
5. Un preset nuevo se prueba en un vídeo, se aprueba, se añade aquí y sube la versión.

## Secuencia de referencia (RASTRO, 10 escenas)
PUSH → PUSH → PULL_OUT_01 → TILT_R → PULL_OUT (1.7) → PUSH → TILT_L → TILT_R → PUSH → PULL_OUT_02
