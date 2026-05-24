from __future__ import annotations


def calibrate(probability: float, factor: float = 1.0) -> float:
    return max(0.0, min(1.0, probability * factor))
