"""Catalog regression: only the 183 approved products remain."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
data = (ROOT / "backend/src/seed/data.js").read_text(encoding="utf-8")
start = data.index("export const products = [")
end = data.index("\n];", start)
block = data[start:end]
names = re.findall(r'"name": "([^"]+)"', block)
numbers = [int(n) for n in re.findall(r'"productNumber": (\d+)', block)]
assert len(names) == 183, f"expected 183 products, got {len(names)}"
assert len(set(names)) == 183, "product names must be unique"
assert numbers == list(range(1, 184)), "product numbering must be 1..183"
manifest = json.loads((ROOT / "frontend/public/images/products/generated/manifest.json").read_text())
assert len(manifest) == 183, f"expected 183 image records, got {len(manifest)}"
assert [item["name"] for item in manifest] == names
assert not list((ROOT / "frontend/public/images/products/generated").glob("product-18[4-9]*.webp"))
assert not list((ROOT / "frontend/public/images/products/generated").glob("product-19*.webp"))
assert not list((ROOT / "frontend/public/images/products/generated").glob("product-200*.webp"))
print("PASS: exactly 183 approved products remain")
