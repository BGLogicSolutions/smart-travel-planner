from __future__ import annotations

from src.models.infer import predict


def serve_prediction(model_path: str, features_path: str) -> dict[str, float | str]:
    from pathlib import Path

    return predict(Path(model_path), Path(features_path))
