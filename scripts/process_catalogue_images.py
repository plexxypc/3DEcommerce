"""Crop/resize chosen source photos into 4:5 WebP catalogue images.
Usage: python3 -I scripts/process_catalogue_images.py <source_dir> <out_dir>
Outputs are capped at 1200x1500 (never upscaled) to protect mobile GPU memory.
Source photos stay OUT of the app; only these small WebPs ship.
"""
import os, sys
from PIL import Image, ImageFilter, ImageOps

# slug -> (source file, crop mode). "center" = centered 4:5 crop with optional y bias;
# "blurfill" = extend canvas to 4:5 using a blurred, scaled copy of the photo itself.
JOBS = {
    "patchwork-rework-jacket": ("2026-11-12_17-40-17_DfpnT4okSaQ_10.jpg", ("center", 0.5)),
    "hand-stitched-runners": ("2026-09-20_19-22-40_DdhU5fNkQcF_9.jpg", ("center", 0.35)),
    "gilded-fork-sculpture": ("2026-08-11_18-17-49_Db6NrgSAjaB_1.jpg", ("center", 0.0)),
    "charmed-football-boots": ("2025-06-12_08-45-15_DKy2UBsI7KK_8.jpg", ("center", 0.45)),
    "taxi-patch-cap": ("2026-10-12_17-01-24_DeZuODGghPw_2.jpg", ("center", 0.5)),
    "green-bleach-pin-cap": ("2026-02-11_17-13-54_DUoCe6HArFq_1.jpg", ("blurfill", None)),
    "reworked-graphic-tee": ("2026-05-22_15-10-54_DYpT5kwgqRl_1.jpg", ("center", 0.5)),
    "stained-glass-denim": ("2025-06-17_11-30-03_DLABJYZolSF_1.jpg", ("center", 0.5)),
}
MAX_W, MAX_H, TARGET_KB = 1200, 1500, 150

def to_45(im, mode, bias):
    w, h = im.size
    if mode == "blurfill":
        th = round(w * 5 / 4)  # taller canvas, same width
        bg = ImageOps.fit(im, (w, th), Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
        bg.paste(im, (0, (th - h) // 2))
        return bg
    if w / h > 0.8:  # too wide: trim sides
        nw = round(h * 0.8); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w * 1.25); y = round((h - nh) * bias)  # too tall: trim top/bottom
    return im.crop((0, y, w, y + nh))

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for slug, (fn, (mode, bias)) in JOBS.items():
    with Image.open(os.path.join(src, fn)) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = to_45(im, mode, bias)
        if im.width > MAX_W: im = im.resize((MAX_W, MAX_H), Image.LANCZOS)
        path = os.path.join(out, slug + ".webp")
        # step quality down, then (if still heavy) shrink 12% and repeat; keeps 4:5 exactly
        while True:
            for q in (86, 80, 74, 68, 62, 56):
                im.save(path, "WEBP", quality=q, method=6)
                if os.path.getsize(path) <= TARGET_KB * 1024: break
            if os.path.getsize(path) <= TARGET_KB * 1024 or im.width * 0.88 < 800: break
            nw = round(im.width * 0.88 / 4) * 4; im = im.resize((nw, nw * 5 // 4), Image.LANCZOS)
        print(f"{slug}: {im.width}x{im.height} q{q} {os.path.getsize(path)//1024}KB")
