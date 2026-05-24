from __future__ import annotations

from pathlib import Path


def train_model(features_file: Path, models_dir: Path, model_version: str) -> Path:
    models_dir.mkdir(parents=True, exist_ok=True)
    artifact = models_dir / f"model_{model_version}.bin"
    artifact.write_bytes(b"stub-model")
    return artifact
