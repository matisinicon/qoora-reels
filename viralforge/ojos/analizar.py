#!/usr/bin/env python3
"""VIRALFORGE · Ojos y oídos de SCOUT/STORYLAB.

Para cada vídeo de referencia del encargo:
  1. lo descarga (yt-dlp, máx. 720p),
  2. saca dos hojas de fotogramas: el GANCHO (primeros 3 s, 12 fotogramas) y el RESTO (18 fotogramas repartidos),
  3. mide el RITMO: cortes de plano (detección de escena de ffmpeg), planos y segundos por plano,
  4. lo ESCUCHA: transcripción con Whisper con tiempos por palabra -> palabras por minuto, pausas, primera frase,
  5. guarda todo en resultados.json (las hojas van como archivos de la release).
Uso: analizar.py encargo.json carpeta_salida
"""
import json, os, re, subprocess, sys, statistics

enc = json.load(open(sys.argv[1]))
out = sys.argv[2]
os.makedirs(out, exist_ok=True)
resultados = []

def sh(*a, **k):
    return subprocess.run(a, capture_output=True, text=True, **k)

def duracion(f):
    r = sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f)
    try: return float(r.stdout.strip())
    except: return 0.0

def hoja(f, tiempos, cols, nombre):
    # extrae un fotograma por instante, los escala a 240x427 y los junta en una cuadrícula
    tmp = os.path.join(out, "_f"); os.makedirs(tmp, exist_ok=True)
    for x in os.listdir(tmp): os.remove(os.path.join(tmp, x))
    for i, t in enumerate(tiempos):
        sh("ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}", "-i", f, "-frames:v", "1",
           "-vf", "scale=240:427:force_original_aspect_ratio=decrease,pad=240:427:(ow-iw)/2:(oh-ih)/2,"
                  f"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='{t:.1f}s':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6",
           os.path.join(tmp, f"{i:03d}.jpg"))
    n = len([x for x in os.listdir(tmp) if x.endswith(".jpg")])
    if not n: return None
    filas = (n + cols - 1) // cols
    sh("ffmpeg", "-y", "-v", "error", "-framerate", "1", "-i", os.path.join(tmp, "%03d.jpg"),
       "-vf", f"tile={cols}x{filas}:padding=4:color=white", "-frames:v", "1", "-q:v", "4", os.path.join(out, nombre))
    return nombre if os.path.exists(os.path.join(out, nombre)) else None

modelo = None
def whisper():
    global modelo
    if modelo is None:
        from faster_whisper import WhisperModel
        modelo = WhisperModel("small", device="cpu", compute_type="int8")
    return modelo

for v in enc.get("videos", []):
    vid, cod = v["video_externo_id"], v["codigo"]
    r = {"codigo": cod, "video_externo_id": vid, "ok": False}
    f = os.path.join(out, f"{vid}.mp4")
    d = sh("yt-dlp", "-q", "--no-warnings", "--no-playlist", "-f", "bv*[height<=720]+ba/b[height<=720]/b",
           "--merge-output-format", "mp4", "--retries", "3", "-o", f, f"https://www.youtube.com/shorts/{vid}")
    if not os.path.exists(f):
        r["error"] = "No se pudo descargar: " + (d.stderr or d.stdout)[-300:]
        print(cod, r["error"]); resultados.append(r); continue
    dur = duracion(f)
    r["duracion_seg"] = round(dur, 1)

    # ── OJOS: hojas de fotogramas ──
    gancho = [i * 0.25 for i in range(12) if i * 0.25 < dur]
    resto = [3 + (dur - 3.2) * k / 17 for k in range(18)] if dur > 4 else []
    r["hoja_gancho"] = hoja(f, gancho, 4, f"{vid}_gancho.jpg")
    r["hoja_resto"] = hoja(f, resto, 6, f"{vid}_resto.jpg") if resto else None

    # ── RITMO: cortes de plano ──
    sc = sh("ffmpeg", "-v", "info", "-i", f, "-vf", "select='gt(scene,0.32)',showinfo", "-an", "-f", "null", "-")
    cortes = [round(float(x), 2) for x in re.findall(r"pts_time:([0-9.]+)", sc.stderr)]
    planos = len(cortes) + 1
    r["cortes"] = cortes
    r["planos"] = planos
    r["seg_por_plano"] = round(dur / planos, 2) if planos else None
    r["primer_corte_seg"] = cortes[0] if cortes else None

    # ── OÍDOS: transcripción con tiempos por palabra ──
    try:
        wav = os.path.join(out, f"{vid}.wav")
        sh("ffmpeg", "-y", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", wav)
        segs, info = whisper().transcribe(wav, word_timestamps=True, vad_filter=True)
        palabras = []
        texto = []
        for s in segs:
            texto.append(s.text.strip())
            for w in (s.words or []):
                palabras.append((w.word.strip(), w.start, w.end))
        r["idioma"] = info.language
        r["transcripcion"] = " ".join(texto).strip()
        if palabras:
            habla = palabras[-1][2] - palabras[0][1]
            r["palabras"] = len(palabras)
            r["palabras_por_minuto"] = round(len(palabras) / max(habla, 1) * 60)
            r["empieza_a_hablar_seg"] = round(palabras[0][1], 2)
            huecos = [round(palabras[i + 1][1] - palabras[i][2], 2) for i in range(len(palabras) - 1)]
            largas = [h for h in huecos if h > 0.4]
            r["pausas_largas"] = len(largas)
            r["pausa_media_seg"] = round(statistics.mean(huecos), 2) if huecos else 0
            r["cobertura_voz_pct"] = round(habla / dur * 100) if dur else None
            frase = []
            for w, s, e in palabras:
                frase.append(w)
                if re.search(r"[.?!]$", w) or len(frase) >= 22: break
            r["primera_frase"] = " ".join(frase)
        else:
            r["palabras"] = 0
            r["transcripcion"] = r.get("transcripcion") or ""
        os.remove(wav)
    except Exception as e:
        r["error_audio"] = str(e)[:300]

    # volumen medio: ayuda a saber si hay música/efectos de fondo fuertes
    vol = sh("ffmpeg", "-v", "info", "-i", f, "-af", "volumedetect", "-f", "null", "-")
    m = re.search(r"mean_volume: (-?[0-9.]+) dB", vol.stderr)
    r["volumen_medio_db"] = float(m.group(1)) if m else None

    r["ritmo"] = ("muy rápido" if r["seg_por_plano"] and r["seg_por_plano"] < 1.5 else
                  "rápido" if r["seg_por_plano"] and r["seg_por_plano"] < 3 else "pausado")
    r["ok"] = True
    os.remove(f)
    print(cod, json.dumps({k: r[k] for k in r if k not in ("transcripcion", "cortes")}, ensure_ascii=False))
    resultados.append(r)

json.dump({"id": enc.get("id"), "videos": resultados}, open(os.path.join(out, "resultados.json"), "w"), ensure_ascii=False, indent=1)
print("Vídeos analizados:", sum(1 for r in resultados if r["ok"]), "de", len(resultados))
