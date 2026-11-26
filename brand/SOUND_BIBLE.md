# QOORA AI · SOUND BIBLE

**Brand DNA v1.0.** Los archivos están en `sfx/` (WAV estéreo, 44,1 kHz, 16 bits, con pico en -1 dBFS).

## 1. Estilo sonoro
- **Sin música de fondo.** Es una decisión del dueño de la marca: la voz y los efectos llevan todo el ritmo.
- Los efectos son **sintéticos, limpios y cortos**, con un carácter "digital amable": nada metálico, agresivo ni de terror.
- **Graves**: solo en los impactos (BOOM e IMPACT), con un barrido corto de 90 a 38 Hz, sin retumbar debajo de la voz.
- **Reverberación y espacialidad**: ninguna. Mezcla seca, cercana y mono duplicada a estéreo, para que se oiga igual en el móvil.
- **Intensidad**: los efectos acompañan y nunca tapan la voz.

### Si algún día vuelve la música
Solo con aprobación y subiendo la versión. El estilo guardado como opción es electrónica rítmica ligera (bombo, palmas, hi-hat y bajo corto), con ducking del 50 % bajo la voz y un silencio de 0,45 s antes de la revelación. La primera versión del vídeo de RASTRO la tiene y está en la carpeta del proyecto.

## 2. Biblioteca de efectos

| Nombre | Archivo | Función | Volumen en la mezcla |
| --- | --- | --- | --- |
| **QOORA_SFX_OPEN** | `QOORA_SFX_OPEN.wav` | **Firma de apertura**: whoosh y, a los 0,35 s, boom. Primera escena | 0.8 |
| **QOORA_SFX_WHOOSH** | `QOORA_SFX_WHOOSH.wav` | **Transición**: al inicio de cada escena (0,32 s) | 0.55 |
| **QOORA_SFX_POP** | `QOORA_SFX_POP.wav` | Aparición de tarjetas, chips o iconos (una por elemento) | 0.5 |
| **QOORA_SFX_TICK** | `QOORA_SFX_TICK.wav` | Reloj o tiempo que pasa | 0.5 |
| **QOORA_SFX_TYPE** | `QOORA_SFX_TYPE.wav` | Tecleo o búsqueda en curso (ráfagas cada 0,09 s) | 0.55 |
| **QOORA_SFX_CLICK** | `QOORA_SFX_CLICK.wav` | Botón, selección o elección | 0.7 |
| **QOORA_SFX_DING** | `QOORA_SFX_DING.wav` | Acierto: dato confirmado o check | 0.5 |
| **QOORA_SFX_BUZZ** | `QOORA_SFX_BUZZ.wav` | Error, descarte o "BLOQUEADA" | 0.6 |
| **QOORA_SFX_BOOM** | `QOORA_SFX_BOOM.wav` | **Impacto** grave: momento clave | 0.8 |
| **QOORA_SFX_RISER** | `QOORA_SFX_RISER.wav` | Subida de tensión antes de revelar (1 s) | 0.6 |
| **QOORA_SFX_REVEAL** | `QOORA_SFX_REVEAL.wav` | **Revelación**: riser y boom encadenados. Aparición del agente | 0.8 |
| **QOORA_SFX_REWARD** | `QOORA_SFX_REWARD.wav` | Logro o premio: doble ding con brillo | 0.6 |
| **QOORA_SFX_IMPACT** | `QOORA_SFX_IMPACT.wav` | **Firma de cierre**: boom y whoosh corto en el CTA final | 0.8 |

Las recetas exactas están en `presets/qoora_sfx.py` (`python3 qoora_sfx.py` regenera la biblioteca idéntica).

## 3. Reglas de uso
1. **Reutilizar siempre**: si un efecto de la tabla cumple la función, se usa ese. Un sonido nuevo solo entra si cumple una función que no existe; entonces se le pone nombre `QOORA_SFX_*`, se documenta aquí y sube la versión.
2. Cada efecto va sincronizado con **lo que pasa en pantalla**, al fotograma.
3. BOOM, IMPACT, BUZZ y REWARD disparan siempre QOORA_IMPACT_SHAKE_01.
4. Como máximo un impacto grave cada 3 segundos.
5. Las POP de una lista van con la misma cadencia que las apariciones (unos 0,3–0,55 s).

## 4. Mezcla final
```
voz    = normalizada · tanh(x·1.1)/tanh(1.1)
efectos = normalizados
mezcla = voz·0.9 + efectos·0.6  →  tanh(x·1.1)/tanh(1.1)  →  pico 0.97
salida = AAC estéreo, 44,1 kHz
```
