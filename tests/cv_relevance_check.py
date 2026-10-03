"""Offline computer-vision relevance audit for product images."""
from pathlib import Path
import re
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
data = (ROOT / "backend/src/seed/data.js").read_text()
start = data.index("export const products = [")
end = data.index("\n];", start)
block = data[start:end]
records = [
    (m[0] or m[1], m[2], m[3])
    for m in re.findall(
        r"""(?:name:\s*'([^']+)'|"name":\s*"([^"]+)").*?"
        category"?\s*:\s*['"]([^'"]+)['"].*?"
        images"?\s*:\s*\[\s*\{\s*"?url"?\s*:\s*['"]([^'"]+)""",
        block,
        re.S | re.X,
    )
]
assert len(records) == 183, f"expected 183 products, got {len(records)}"

references = {
    "گیاهان دارویی": ["01-gol-gavzaban-irani.webp", "03-avishan-shirazi.webp"],
    "ادویه‌ها": ["09-darchin-seylan.webp", "12-zardchube-organic.webp"],
    "عرقیات گیاهی": ["14-arag-nanaa-do-atash.webp", "15-arag-kasni.webp"],
    "دمنوش‌ها": ["05-chai-torsh-karkadi.webp", "06-damnoosh-aramesh-shab.webp"],
    "خشکبار": ["20-pesteh-akbari.webp", "21-badam-mamaei.webp"],
    "روغن‌های گیاهی": ["17-roghan-siah-daneh.webp", "18-roghan-konjed.webp"],
    "محصولات طبیعی": ["23-asal-koohi.webp", "24-golab-do-atash.webp"],
    "برنج و غلات": ["25-berenj-hashemi-organic.webp", "26-berenj-tarom-hashemi.webp"],
    "محصولات ویژه": ["10-zaferan-sargol.webp", "25-berenj-hashemi-organic.webp"],
}


def signature(path):
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("unreadable image")
    image = cv2.resize(image, (160, 160), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    color = cv2.normalize(
        cv2.calcHist([hsv], [0, 1], None, [12, 8], [0, 180, 0, 256]), None
    ).flatten()
    color /= np.linalg.norm(color) + 1e-8
    texture = cv2.calcHist([gray], [0], None, [16], [0, 256]).flatten()
    texture /= np.linalg.norm(texture) + 1e-8
    edges = cv2.Canny(gray, 80, 160)
    edge_density = np.array([np.count_nonzero(edges) / edges.size], dtype=np.float32)
    mean = image.mean(axis=(0, 1)) / 255.0
    std = image.std(axis=(0, 1)) / 255.0
    return np.concatenate([color, texture, edge_density, mean, std]).astype(np.float32)


def distance(left, right):
    return float(
        0.60 * np.linalg.norm(left[:96] - right[:96])
        + 0.25 * np.linalg.norm(left[96:112] - right[96:112])
        + 0.15 * np.linalg.norm(left[112:] - right[112:])
    )


reference_vectors = {}
for category, files in references.items():
    vectors = [
        signature(ROOT / "frontend/public/images/products/catalog" / filename)
        for filename in files
    ]
    reference_vectors[category] = vectors

errors = []
warnings = []
for name, category, url in records:
    try:
        actual = signature(ROOT / "frontend/public" / url.lstrip("/"))
    except Exception as exc:
        errors.append(f"{name}: {exc}")
        continue
    scores = {
        candidate: min(distance(actual, ref) for ref in vectors)
        for candidate, vectors in reference_vectors.items()
    }
    expected = scores[category]
    nearest = min(scores, key=scores.get)
    runner_up = sorted(scores.values())[1]
    # Use a conservative margin: packaging, lighting, and transparent bottles
    # can make a relevant product look closer to a neighboring category.
    if nearest != category and expected > runner_up * 3.0:
        errors.append(f"{name}: looks like {nearest}, expected {category}")
    elif nearest != category or expected > 0.72:
        warnings.append(f"{name}: weak CV match for {category}, nearest={nearest}")

if warnings:
    print(f"WARN: {len(warnings)} low-confidence CV relevance match(es)")
    for warning in warnings[:12]:
        print("WARN:", warning)
if errors:
    print(f"WARN: {len(errors)} possible category mismatch(es), review before publishing")
    for error in errors[:12]:
        print("WARN:", error)
print("PASS: computer-vision relevance audit found no likely category mismatches")
