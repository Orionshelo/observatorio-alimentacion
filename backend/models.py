from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


# ─── Tablas SQLite ────────────────────────────────────────────────────────────

class CommunityMenu(SQLModel, table=True):
    id:          Optional[int] = Field(default=None, primary_key=True)
    menu_name:   str
    description: Optional[str] = None
    foods:       str            # JSON serializado: lista de IDs
    region:      str
    sub_region:  Optional[str] = None
    population:  str
    contact:     Optional[str] = None
    channel:     str = "web"   # web | whatsapp | telegram
    verified:    bool = False
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class NutritionReport(SQLModel, table=True):
    """Reporte de estado nutricional – capturado vía bot o web."""
    id:             Optional[int] = Field(default=None, primary_key=True)
    reporter_id:    Optional[str] = None  # ID anónimo o número de teléfono hash
    channel:        str = "web"
    region:         str
    sub_region:     Optional[str] = None
    population:     str                   # gestantes | lactantes | ninos_0_6 | etc.
    eats_3_meals:   Optional[bool] = None
    has_protein:    Optional[bool] = None
    has_fruits_veg: Optional[bool] = None
    has_dairy:      Optional[bool] = None
    food_insecurity: Optional[bool] = None
    notes:          Optional[str] = None
    reported_at:    datetime = Field(default_factory=datetime.utcnow)


# ─── Schemas Pydantic (request / response) ───────────────────────────────────

class CommunityMenuCreate(BaseModel):
    menuName:    str
    description: Optional[str] = None
    foods:       List[str] = []
    region:      str
    subRegion:   Optional[str] = None
    population:  str
    contact:     Optional[str] = None
    channel:     str = "web"


class CommunityMenuRead(BaseModel):
    id:          int
    menu_name:   str
    description: Optional[str]
    foods:       List[str]
    region:      str
    sub_region:  Optional[str]
    population:  str
    channel:     str
    verified:    bool
    submitted_at: datetime

    class Config:
        from_attributes = True


class NutritionReportCreate(BaseModel):
    channel:         str = "web"
    region:          str
    sub_region:      Optional[str] = None
    population:      str
    eats_3_meals:    Optional[bool] = None
    has_protein:     Optional[bool] = None
    has_fruits_veg:  Optional[bool] = None
    has_dairy:       Optional[bool] = None
    food_insecurity: Optional[bool] = None
    notes:           Optional[str] = None


class StatsResponse(BaseModel):
    total_menus:         int
    verified_menus:      int
    total_reports:       int
    food_insecurity_pct: float
    top_regions:         List[dict]
