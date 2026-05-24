from __future__ import annotations

from pathlib import Path


def build_feature_store(processed_file: Path, features_dir: Path) -> Path:
    features_dir.mkdir(parents=True, exist_ok=True)
    output = features_dir / processed_file.name.replace("normalized", "features")
    output.write_text(processed_file.read_text(encoding="utf-8"), encoding="utf-8")
    return output
