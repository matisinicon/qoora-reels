"""VIRALFORGE · Saca los tiempos de cada palabra de una voz sin marcas de tiempo (p. ej. Gemini TTS).
Uso: python3 tiempos_whisper.py voz.mp3 "narración completa" salida.json
Whisper transcribe con tiempos por palabra y luego se alinean con el texto de la narración, así los
subtítulos salen con la ortografía del guion y no con la de la transcripción."""
import difflib, json, re, subprocess, sys, unicodedata
import numpy as np
from faster_whisper import WhisperModel

audio, narracion, salida = sys.argv[1], sys.argv[2], sys.argv[3]

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ]", "", w)

modelo = WhisperModel("small", device="cpu", compute_type="int8")
# el audio se decodifica con ffmpeg (evita depender de la versión de PyAV)
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
muestras = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
segs, _ = modelo.transcribe(muestras, language="es", word_timestamps=True, vad_filter=False, beam_size=5)
oidas = [(w.word.strip(), w.start, w.end) for s in segs for w in (s.words or []) if w.word.strip()]
texto = [w for w in narracion.split() if norm(w)]
if not texto:
    texto = [w for w, _, _ in oidas]

a = [norm(w) for w in texto]
b = [norm(w) for w, _, _ in oidas]
t = [None] * len(texto)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for k in range(blk.size):
        t[blk.a + k] = (oidas[blk.b + k][1], oidas[blk.b + k][2])
# reparto de los tramos no reconocidos entre las palabras conocidas de alrededor
fin_total = oidas[-1][2] if oidas else 1.0
i = 0
while i < len(t):
    if t[i] is not None:
        i += 1; continue
    j = i
    while j < len(t) and t[j] is None:
        j += 1
    ini = t[i - 1][1] if i > 0 else 0.0
    fin = t[j][0] if j < len(t) else fin_total
    n = j - i
    paso = max(fin - ini, 0.05 * n) / n
    for k in range(n):
        t[i + k] = (ini + k * paso, ini + (k + 1) * paso)
    i = j
pal = [[w, round(s, 3), round(max(e, s + 0.04), 3)] for w, (s, e) in zip(texto, t)]
json.dump(pal, open(salida, "w"), ensure_ascii=False)
reconocidas = sum(1 for x in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks() for _ in range(x.size))
print(f"Whisper: {len(oidas)} palabras oídas, {reconocidas}/{len(texto)} alineadas con la narración, voz de {fin_total:.1f} s")
