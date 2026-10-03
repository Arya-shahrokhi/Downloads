"""Computer-vision relevance audit for product images.

This is intentionally offline and deterministic. It builds a visual signature
from HSV color histograms, grayscale texture, edge density, and image layout,
then checks each product against category reference images. It is a guardrail,
not a substitute for a human merchandising review.
"""
from pathlib import Path
import re
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DATA = (ROOT / "backend/src/seed/data.js").read_text()
START = DATA.index("export const products = [")
END = DATA.index("\n];", START)
BLOCK = DATA[START:END]

records = re.findall(
    r"""(?:name:\s*'([^']+)'|"name":\s*"([^"]+)").*?"
    category"?\s*:\s*['"]([^'"]+)['"].*?"
    images"?\s*:\s*\[\s*\{\s*"?url"?\s*:\s*['"]([^'"]+)""",
    BLOCK,
    re.S | re.X,
)
assert len(records) == 183, f"expected 183 products, got {len(records)}"

REFERENCES = {
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
        cv2.calcHist([hsv], [0, 1], None, [12, 8], [0, 180, 0, 256]),
        None,
    ).flatten()
    color /= np.linalg.norm(color) + 1e-8
    texture = cv2.calcHist([gray], [0], None, [16], [0, 256]).flatten()
    texture /= np.linalg.norm(texture) + 1e-8
    edges = cv2.Canny(gray, 80, 160)
    edge_density = np.array([float(np.count_nonzero(edges)) / edges.size], dtype=np.float32)
    mean = image.mean(axis=(0, 1)) / 255.0
    std = image.std(axis=(0, 1)) / 255.0
    return np.concatenate([color, texture, edge_density, mean, std]).astype(np.float32)


def distance(a, b):
    # Color and texture dominate, while layout/edge features catch screenshots
    # and unrelated crops without overfitting to exact filenames.
    n = len(a)
    color = np.linalg.norm(a[:96] - b[:96])
    texture = np.linalg.norm(a[96:112] - b[96:112])
    rest = np.linalg.norm(a[112:n] - b[112:n])
    return float(0.60 * color + 0.25 * texture + 0.15 * rest)


reference_vectors = {}
for category, files in REFERENCES.items():
    vectors = []
    for filename in files:
        path = ROOT / "frontend/public/images/products/catalog" / filename
        if path.is_file():
            vectors.append(signature(path))
    assert vectors, f"no CV references available for {category}"
    reference_vectors[category] = vectors

errors = []
warnings = []
for first, second, category, url in records:
    name = first or second
    path = ROOT / "frontend/public" / url.lstrip("/")
    try:
        actual = signature(path)
    except Exception as exc:
        errors.append(f"{name}: {exc}")
        continue
    scores = {
        candidate: min(distance(actual, ref) for ref in vectors)
        for candidate, vectors in reference_vectors.items()
    }
    expected = scores[category]
    nearest = min(scores, key=scores.get)
    # A large margin means the image is visually closer to another category.
    runner_up = sorted(scores.values())[1]
    if nearest != category and expected > runner_up * 1.12:
        errors.append(
            f"{name}: image looks like {nearest}, expected {category} "
            f"(expected={expected:.3f}, nearest={scores[nearest]:.3f})"
        )
    elif nearest != category or expected > 0.72:
        warnings.append(
            f"{name}: weak CV match for {category}, nearest={nearest}, score={expected:.3f}"
        )

if warnings:
    print(f"WARN: {len(warnings)} low-confidence CV relevance match(es)")
    for warning in warnings[:12]:
        print("WARN:", warning)
if errors:
    print(f"FAILED: {len(errors)} likely irrelevant product image(s)")
    for error in errors:
        print("ERROR:", error)
    raise SystemExit(1)

print("PASS: computer-vision relevance audit found no likely category mismatches")
