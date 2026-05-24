PYTHON ?= python3
CONFIG ?= configs/pipeline.json

.PHONY: ingest build-features train backtest predict pipeline

ingest:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage fetch
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage normalize

build-features:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage feature_store

train:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage train

backtest:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage evaluate

predict:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage serve

pipeline:
	$(PYTHON) src/pipeline.py --config $(CONFIG) --stage all
