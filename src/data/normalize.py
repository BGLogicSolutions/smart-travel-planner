from __future__ import annotations

from pathlib import Path


def normalize_raw(raw_file: Path, processed_dir: Path) -> Path:
    processed_dir.mkdir(parents=True, exist_ok=True)
    output = processed_dir / raw_file.name.replace("_raw", "_normalized")
    output.write_text(raw_file.read_text(encoding="utf-8"), encoding="utf-8")
    return output
