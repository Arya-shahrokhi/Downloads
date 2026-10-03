"""Keep the persistence layer intentionally limited to MongoDB/Mongoose."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
backend = json.loads((ROOT / "backend/package.json").read_text())
deps = set(backend.get("dependencies", {})) | set(backend.get("devDependencies", {}))

forbidden_packages = {
    "pg", "pg-promise", "mysql", "mysql2", "mariadb", "sqlite3",
    "better-sqlite3", "redis", "ioredis", "firebase-admin",
    "sequelize", "prisma", "@prisma/client", "typeorm", "knex",
}
found_packages = sorted(deps & forbidden_packages)
assert not found_packages, f"non-Mongo database packages found: {found_packages}"
assert "mongoose" in backend["dependencies"], "Mongoose is required"

scan_roots = [ROOT / "backend/src", ROOT / "backend/.env.example", ROOT / "docker-compose.yml"]
forbidden_terms = re.compile(
    r"\b(?:postgres(?:ql)?|mysql|mariadb|sqlite|redis|firebase|supabase|dynamodb)\b",
    re.IGNORECASE,
)
hits = []
for target in scan_roots:
    text = target.read_text(errors="ignore") if target.is_file() else "\n".join(
        p.read_text(errors="ignore") for p in target.rglob("*") if p.is_file()
    )
    if forbidden_terms.search(text):
        hits.append(str(target.relative_to(ROOT)))
assert not hits, f"non-Mongo database configuration found in: {hits}"
print("PASS: MongoDB/Mongoose is the only database stack")
