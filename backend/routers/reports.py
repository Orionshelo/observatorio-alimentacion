from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import get_session
from models import NutritionReport, NutritionReportCreate, StatsResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/nutrition", status_code=201)
def create_report(payload: NutritionReportCreate, session: Session = Depends(get_session)):
    report = NutritionReport(**payload.model_dump())
    session.add(report)
    session.commit()
    return {"status": "ok", "id": report.id}


@router.get("/stats", response_model=StatsResponse)
def get_stats(session: Session = Depends(get_session)):
    from models import CommunityMenu
    total_menus    = session.exec(select(func.count(CommunityMenu.id))).one()
    verified_menus = session.exec(
        select(func.count(CommunityMenu.id)).where(CommunityMenu.verified == True)
    ).one()
    total_reports  = session.exec(select(func.count(NutritionReport.id))).one()

    insecurity_count = session.exec(
        select(func.count(NutritionReport.id)).where(NutritionReport.food_insecurity == True)
    ).one()
    pct = (insecurity_count / total_reports * 100) if total_reports else 0.0

    return StatsResponse(
        total_menus=total_menus,
        verified_menus=verified_menus,
        total_reports=total_reports,
        food_insecurity_pct=round(pct, 1),
        top_regions=[],
    )
