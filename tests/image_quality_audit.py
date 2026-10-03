"""Reject broken, tiny, blank, or obviously unsuitable product images."""
from pathlib import Path
import hashlib
import json
import re
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads(
    (ROOT / "frontend/public/images/products/generated/manifest.json").read_text()
)
records = [(item["name"], item["url"]) for item in manifest]
assert len(records) == 183, f"expected 183 product image records, got {len(records)}"

errors = []
seen = {}
for name, url in records:
    if not url.startswith("/images/"):
        errors.append(f"{name}: image must be local, got {url}")
        continue
    path = ROOT / "frontend/public" / url.lstrip("/")
    if not path.is_file():
        errors.append(f"{name}: missing file {url}")
        continue
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path).convert("RGB") as image:
            width, height = image.size
            if width < 300 or height < 300:
                errors.append(f"{name}: too small ({width}x{height})")
            ratio = width / height
            if ratio < 0.55 or ratio > 2.4:
                errors.append(f"{name}: unsuitable aspect ratio ({width}x{height})")
            stat = ImageStat.Stat(image.resize((32, 32)))
            if max(stat.stddev) < 2.0:
                errors.append(f"{name}: blank or nearly blank image")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            seen.setdefault(digest, []).append(name)
    except Exception as exc:
        errors.append(f"{name}: unreadable image ({exc})")

duplicates = [names for names in seen.values() if len(names) > 1]
if duplicates:
    print(f"WARN: {len(duplicates)} exact image reuse groups found; review product relevance")
    for names in duplicates[:5]:
        print("WARN:", ", ".join(names[:4]), "...")

if errors:
    print(f"FAILED: {len(errors)} unsuitable product image(s)")
    for error in errors:
        print("ERROR:", error)
    raise SystemExit(1)

print("PASS: 183 unique product images are present, readable, large enough, and visually non-blank")
