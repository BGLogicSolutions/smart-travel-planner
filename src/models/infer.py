from __future__ import annotations

from pathlib import Path


def predict(model_file: Path, features_file: Path) -> dict[str, float | str]:
    _ = model_file, features_file
    return {"match_id": "demo", "home_win_probability": 0.55, "away_win_probability": 0.45}
