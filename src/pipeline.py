from __future__ import annotations

import argparse
import hashlib
import json
import logging
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def configure_logger() -> logging.Logger:
    logger = logging.getLogger("travel-planner-ml")
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()

    class JsonFormatter(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            payload = {
                "ts": datetime.now(tz=UTC).isoformat(),
                "level": record.levelname,
                "message": record.getMessage(),
                "logger": record.name,
            }
            if hasattr(record, "extra") and isinstance(record.extra, dict):
                payload.update(record.extra)
            return json.dumps(payload, ensure_ascii=False)

    handler.setFormatter(JsonFormatter())
    logger.addHandler(handler)
    return logger


@dataclass(slots=True)
class ArtifactVersion:
    stage: str
    config_hash: str
    run_date: str

    @property
    def tag(self) -> str:
        return f"{self.run_date}-{self.config_hash[:8]}"


def load_config(config_path: Path) -> dict[str, Any]:
    suffix = config_path.suffix.lower()
    raw = config_path.read_text(encoding="utf-8")
    if suffix == ".json":
        return json.loads(raw)
    if suffix in {".yml", ".yaml"}:
        try:
            import yaml
        except ImportError as exc:  # pragma: no cover
            raise RuntimeError("PyYAML no está instalado; usa JSON o instala pyyaml") from exc
        return yaml.safe_load(raw)
    raise ValueError(f"Formato no soportado: {suffix}")


def config_hash(config: dict[str, Any]) -> str:
    canonical = json.dumps(config, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def version_for(stage: str, cfg_hash: str) -> ArtifactVersion:
    return ArtifactVersion(
        stage=stage,
        config_hash=cfg_hash,
        run_date=datetime.now(tz=UTC).strftime("%Y%m%d"),
    )


def run_stage(stage: str, config: dict[str, Any], logger: logging.Logger) -> ArtifactVersion:
    cfg_hash = config_hash(config)
    version = version_for(stage, cfg_hash)
    logger.info(
        f"Ejecutando etapa {stage}",
        extra={"extra": {"stage": stage, "artifact_version": version.tag, "config_hash": cfg_hash}},
    )
    return version


def run_pipeline(config_path: Path) -> list[ArtifactVersion]:
    logger = configure_logger()
    config = load_config(config_path)
    stages = ["fetch", "normalize", "feature_store", "train", "evaluate", "serve"]
    return [run_stage(stage, config, logger) for stage in stages]


def main() -> None:
    parser = argparse.ArgumentParser(description="Pipeline reproducible por etapas")
    parser.add_argument("--config", default="configs/pipeline.json", type=Path)
    parser.add_argument("--stage", default="all", choices=["all", "fetch", "normalize", "feature_store", "train", "evaluate", "serve"])
    args = parser.parse_args()

    logger = configure_logger()
    config = load_config(args.config)

    if args.stage == "all":
        for stage in ["fetch", "normalize", "feature_store", "train", "evaluate", "serve"]:
            run_stage(stage, config, logger)
        return

    run_stage(args.stage, config, logger)


if __name__ == "__main__":
    main()
