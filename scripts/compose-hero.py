"""Compose KINSUROI hero images from the owner's portrait photo.

Desktop (public/images/hero.jpg):  white canvas 1400x1100, photo pasted
right flush (top/right/bottom), left edge feathered into white so the
photo melts into the text side exactly like the owner's mockup.

Mobile  (public/images/hero-mobile.jpg): the raw portrait, lightly
centered-crop to 4:5 so the face + bottle dominate the mobile slot.
"""
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import hashlib

SRC = "/home/z/my-project/upload/WhatsApp Image 2026-09-20 at 01.03.24.jpeg"
OUT_DESKTOP = "/home/z/my-project/public/images/hero.jpg"
OUT_MOBILE = "/home/z/my-project/public/images/hero-mobile.jpg"

src = Image.open(SRC).convert("RGB")
W, H = src.size  # 1024 x 1536

# ---------- DESKTOP BANNER ----------
CW, CH = 1400, 1100
canvas = Image.new("RGB", (CW, CH), (255, 255, 255))

scale = CH / H            # photo fills canvas height exactly
pw = round(W * scale)     # pasted photo width (733)
photo = src.resize((pw, CH), Image.LANCZOS)

px = CW - pw              # photo left edge on canvas (667)
FEATHER = 260             # horizontal blend width

# Alpha mask: photo fully opaque, fading to 0 across its left FEATHER px
mask = Image.new("L", (pw, CH), 255)
mdraw = ImageDraw.Draw(mask)
for i in range(FEATHER):
    x = i
    # smoothstep for a soft professional falloff
    t = i / FEATHER
    val = int(255 * (t * t * (3 - 2 * t)))
    mdraw.line([(x, 0), (x, CH)], fill=val)

canvas.paste(photo, (px, 0), mask)
canvas.save(OUT_DESKTOP, quality=90, progressive=True, optimize=True)
print("desktop:", canvas.size, "->", OUT_DESKTOP)

# ---------- MOBILE PORTRAIT (4:5 crop, face + bottle priority) ----------
# Source 1024x1536; 4:5 of width 1024 = 1280 high > 1536? no: target ratio 0.8
# crop height = 1024/0.8 = 1280 -> cut 256 vertical. Keep top-biased so the
# face and bottle stay, trim the obi/kimono at the bottom (cut 85% from bottom).
mh = round(1024 / 0.8)          # 1280
top = 40                         # small top trim of ceiling area
crop = src.crop((0, top, 1024, top + mh))
crop = ImageOps.autocontrast(crop, cutoff=0)  # no-op safeguard, keeps tones
crop.save(OUT_MOBILE, quality=88, progressive=True, optimize=True)
print("mobile:", crop.size, "->", OUT_MOBILE)

for f in (OUT_DESKTOP, OUT_MOBILE):
    print(f.split('/')[-1], hashlib.md5(open(f, 'rb').read()).hexdigest()[:10],
          round(len(open(f, 'rb').read()) / 1024), "KB")
