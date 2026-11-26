#!/usr/bin/env bash
# VIRALFORGE · Monta un encargo con Remotion. Uso: viralforge/remotion/montar.sh viralforge/jobs/X.json
# Deja en out/: video.mp4, portada.jpg, hoja.jpg, info.json, voz.mp3 y escena_XX.png
set -euo pipefail
JOB="$(realpath "$1")"
RAIZ="$(pwd)"
mkdir -p "$RAIZ/out"
cd "$(dirname "$0")"
node preparar.mjs "$JOB"
COMPO=$(cat public/job/composicion.txt)
NAV=${REMOTION_BROWSER:+--browser-executable="$REMOTION_BROWSER"}
npx remotion render src/index.ts "$COMPO" "$RAIZ/out/video.mp4" --props=public/job/props.json \
  --codec=h264 --crf=20 --concurrency=100% $NAV
if [ "$COMPO" = "Historia" ]; then
  # Portada: primera escena con el título grande
  python3 -c "import json;p=json.load(open('public/job/props.json'));p['portada']=True;json.dump(p,open('public/job/portada.json','w'))"
  npx remotion still src/index.ts Historia "$RAIZ/out/portada.jpg" --props=public/job/portada.json --frame=40 --image-format=jpeg --jpeg-quality=90 $NAV
fi
cp public/job/voz.mp3 "$RAIZ/out/voz.mp3"
cp public/job/escena_*.png "$RAIZ/out/" 2>/dev/null || true
cd "$RAIZ"
DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 out/video.mp4)
[ -f out/portada.jpg ] || ffmpeg -y -v error -ss 1 -i out/video.mp4 -frames:v 1 -q:v 3 out/portada.jpg
PASO=$(python3 -c "print(max($DUR/8, 0.5))")
ffmpeg -y -v error -i out/video.mp4 -vf "fps=1/$PASO,scale=270:480,tile=4x2:padding=6:margin=6:color=black" -frames:v 1 -q:v 4 out/hoja.jpg
python3 - "$JOB" "$DUR" <<'PY'
import json, sys
job = json.load(open(sys.argv[1]))
json.dump({"id": job.get("id"), "duracion": round(float(sys.argv[2]), 2), "escenas": len(job["escenas"]),
           "resolucion": "1080x1920", "motor": "remotion", "composicion": job.get("composicion", "Short")}, open("out/info.json", "w"))
PY
cat out/info.json
