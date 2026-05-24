from __future__ import annotations

from pathlib import Path


def fetch_espn(league: str, season: str, raw_dir: Path) -> Path:
    raw_dir.mkdir(parents=True, exist_ok=True)
    output = raw_dir / f"{league}_{season}_raw.json"
    output.write_text('{"source":"espn","status":"stub"}', encoding="utf-8")
    return output
