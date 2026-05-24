from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass(slots=True)
class Match:
    match_id: str
    league: str
    season: str
    start_time: datetime
    home_team: str
    away_team: str
    home_score: int | None = None
    away_score: int | None = None
    status: str = "scheduled"
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class TeamStats:
    team_id: str
    team_name: str
    season: str
    games_played: int
    wins: int
    losses: int
    points_scored_avg: float
    points_allowed_avg: float
    pace: float | None = None
    offensive_rating: float | None = None
    defensive_rating: float | None = None


@dataclass(slots=True)
class OddsSnapshot:
    match_id: str
    captured_at: datetime
    provider: str
    home_moneyline: float | None = None
    away_moneyline: float | None = None
    spread_home: float | None = None
    spread_away: float | None = None
    total_points_line: float | None = None


@dataclass(slots=True)
class Prediction:
    match_id: str
    model_version: str
    predicted_at: datetime
    home_win_probability: float
    away_win_probability: float
    expected_margin: float | None = None
    confidence: float | None = None
