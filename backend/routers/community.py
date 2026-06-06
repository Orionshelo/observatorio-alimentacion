import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import CommunityMenu, CommunityMenuCreate, CommunityMenuRead

router = APIRouter(prefix="/api/community", tags=["community"])


@router.post("/menus", response_model=CommunityMenuRead)
def create_menu(payload: CommunityMenuCreate, session: Session = Depends(get_session)):
    menu = CommunityMenu(
        menu_name=payload.menuName,
        description=payload.description,
        foods=json.dumps(payload.foods, ensure_ascii=False),
        region=payload.region,
        sub_region=payload.subRegion,
        population=payload.population,
        contact=payload.contact,
        channel=payload.channel,
    )
    session.add(menu)
    session.commit()
    session.refresh(menu)
    return _to_read(menu)


@router.get("/menus", response_model=List[CommunityMenuRead])
def list_menus(
    region: Optional[str] = None,
    verified: Optional[bool] = None,
    session: Session = Depends(get_session),
):
    query = select(CommunityMenu)
    if region:
        query = query.where(CommunityMenu.region == region)
    if verified is not None:
        query = query.where(CommunityMenu.verified == verified)
    menus = session.exec(query).all()
    return [_to_read(m) for m in menus]


@router.patch("/menus/{menu_id}/verify", response_model=CommunityMenuRead)
def verify_menu(menu_id: int, session: Session = Depends(get_session)):
    menu = session.get(CommunityMenu, menu_id)
    if not menu:
        raise HTTPException(404, "Menú no encontrado")
    menu.verified = True
    session.commit()
    session.refresh(menu)
    return _to_read(menu)


def _to_read(m: CommunityMenu) -> CommunityMenuRead:
    return CommunityMenuRead(
        id=m.id,
        menu_name=m.menu_name,
        description=m.description,
        foods=json.loads(m.foods or "[]"),
        region=m.region,
        sub_region=m.sub_region,
        population=m.population,
        channel=m.channel,
        verified=m.verified,
        submitted_at=m.submitted_at,
    )
