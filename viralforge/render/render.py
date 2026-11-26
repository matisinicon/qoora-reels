#!/usr/bin/env python3
"""VIRALFORGE AI · Montaje de Shorts (lo ejecuta GitHub Actions).

Lee un encargo JSON (job.json) con escenas (clips o imágenes), voz en off y
tiempos por palabra, y genera out/video.mp4 (1080x1920, 30 fps, H.264 + AAC)
con subtítulos quemados, más out/portada.jpg.

Formato del encargo:
{
  "id": "VF-0001",
  "escenas": [{"orden": 1, "clip_url": "https://...mp4", "imagen_url": "https://...jpg", "duracion": 5}],
  "voz_url": "https://...mp3",
  "palabras": [["Hola", 0.0, 0.3], ...],
  "musica_url": null,
  "volumen_musica": 0.12,
  "subtitulos": true
}
"""
import json
import os
import subprocess
import sys
import urllib.request

W, H, FPS = 1080, 1920, 30
WORK = "work"
OUT = "out"


def sh(cmd):
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def descargar(url, destino):
    req = urllib.request.Request(url, headers={"User-Agent": "viralforge-render/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r, open(destino, "wb") as f:
        f.write(r.read())
    return destino


def duracion(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out or 0)


def tiempo_ass(t):
    t = max(t, 0)
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def crear_subtitulos(palabras, destino):
    """Agrupa las palabras en bloques cortos (máx. 3 palabras / 20 caracteres)."""
    bloques, actual = [], []
    for w in palabras:
        texto = str(w[0]).strip()
        if not texto:
            continue
        cand = actual + [w]
        largo = len(" ".join(str(x[0]) for x in cand))
        if actual and (len(cand) > 3 or largo > 20):
            bloques.append(actual)
            actual = [w]
        else:
            actual = cand
        if texto[-1:] in ".!?…" and actual:
            bloques.append(actual)
            actual = []
    if actual:
        bloques.append(actual)

    cab = (
        "[Script Info]\nScriptType: v4.00+\nPlayResX: %d\nPlayResY: %d\nWrapStyle: 0\n\n"
        "[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
        "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
        "Alignment, MarginL, MarginR, MarginV, Encoding\n"
        "Style: VF,DejaVu Sans,82,&H00FFFFFF,&H0000E5FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,2,2,80,80,560,1\n\n"
        "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n" % (W, H)
    )
    lineas = []
    for b in bloques:
        ini, fin = float(b[0][1]), float(b[-1][2])
        texto = " ".join(str(x[0]) for x in b).replace("{", "(").replace("}", ")")
        lineas.append(f"Dialogue: 0,{tiempo_ass(ini)},{tiempo_ass(max(fin, ini + 0.35))},VF,,0,0,0,,{texto}")
    with open(destino, "w", encoding="utf-8") as f:
        f.write(cab + "\n".join(lineas) + "\n")


def normalizar_clip(origen, destino, segundos):
    """Escala/recorta a 1080x1920, fija 30 fps y alarga congelando el último fotograma si hace falta."""
    vf = (
        f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},"
        f"tpad=stop_mode=clone:stop_duration={segundos:.2f},setsar=1"
    )
    sh(["ffmpeg", "-y", "-v", "error", "-i", origen, "-an", "-vf", vf, "-t", f"{segundos:.2f}",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", destino])


def imagen_a_clip(origen, destino, segundos, indice):
    """Plano con movimiento suave (zoom lento) a partir de una imagen fija."""
    frames = max(int(segundos * FPS), 1)
    zoom = "min(zoom+0.0009,1.12)" if indice % 2 == 0 else "if(eq(on,1),1.12,max(zoom-0.0009,1.0))"
    vf = (
        f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,crop={W * 2}:{H * 2},"
        f"zoompan=z='{zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},setsar=1"
    )
    sh(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", origen, "-vf", vf, "-t", f"{segundos:.2f}",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", destino])


def main():
    job_path = sys.argv[1]
    with open(job_path, encoding="utf-8") as f:
        job = json.load(f)
    os.makedirs(WORK, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)

    voz = descargar(job["voz_url"], f"{WORK}/voz.mp3")
    dur_voz = duracion(voz)
    escenas = sorted(job["escenas"], key=lambda e: e.get("orden", 0))
    if not escenas:
        raise SystemExit("El encargo no tiene escenas")

    # Reparte la duración total (voz + 0,6 s de cierre) en proporción a lo planificado
    total = dur_voz + 0.6
    plan = [max(float(e.get("duracion") or 4), 1.5) for e in escenas]
    factor = total / sum(plan)
    tramos = [p * factor for p in plan]

    partes = []
    for i, (e, seg) in enumerate(zip(escenas, tramos)):
        destino = f"{WORK}/parte_{i:02d}.mp4"
        if e.get("clip_url"):
            origen = descargar(e["clip_url"], f"{WORK}/clip_{i:02d}.mp4")
            normalizar_clip(origen, destino, seg)
        elif e.get("imagen_url"):
            origen = descargar(e["imagen_url"], f"{WORK}/img_{i:02d}.img")
            imagen_a_clip(origen, destino, seg, i)
        else:
            raise SystemExit(f"La escena {i + 1} no tiene clip ni imagen")
        partes.append(destino)

    with open(f"{WORK}/lista.txt", "w") as f:
        for p in partes:
            f.write(f"file '{os.path.abspath(p)}'\n")
    sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{WORK}/lista.txt", "-c", "copy", f"{WORK}/imagen.mp4"])

    filtros_v = "null"
    if job.get("subtitulos", True) and job.get("palabras"):
        crear_subtitulos(job["palabras"], f"{WORK}/subs.ass")
        filtros_v = f"ass={WORK}/subs.ass"

    entradas = ["-i", f"{WORK}/imagen.mp4", "-i", voz]
    if job.get("musica_url"):
        descargar(job["musica_url"], f"{WORK}/musica.mp3")
        entradas += ["-stream_loop", "-1", "-i", f"{WORK}/musica.mp3"]
        vol = float(job.get("volumen_musica", 0.12))
        audio = f"[2:a]volume={vol}[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]"
    else:
        audio = "[1:a]anull[a]"
    filtro = f"[0:v]{filtros_v}[v];{audio}"
    sh(["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", filtro, "-map", "[v]", "-map", "[a]",
        "-t", f"{total:.2f}", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", f"{OUT}/video.mp4"])
    sh(["ffmpeg", "-y", "-v", "error", "-ss", "1", "-i", f"{OUT}/video.mp4", "-frames:v", "1", "-q:v", "3", f"{OUT}/portada.jpg"])

    info = {"id": job.get("id"), "duracion": round(duracion(f"{OUT}/video.mp4"), 2), "escenas": len(partes),
            "resolucion": f"{W}x{H}"}
    with open(f"{OUT}/info.json", "w") as f:
        json.dump(info, f)
    print(json.dumps(info))


if __name__ == "__main__":
    main()
