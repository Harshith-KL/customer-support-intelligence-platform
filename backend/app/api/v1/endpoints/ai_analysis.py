
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.ai_analysis import (
    AcceptAnalysisRequest,
    AIAnalysisListResponse,
    AIAnalysisResponse,
    AcceptAnalysisResponse,
)
from app.services.ai.ai_analysis_service import AIAnalysisService


router = APIRouter()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post(
    "/tickets/{ticket_id}/analyze",
    response_model=AIAnalysisResponse,
    status_code=201,
)
def analyze_ticket(
    ticket_id: str,
    db: DatabaseSession,
):
    return AIAnalysisService.analyze_ticket(db, ticket_id)


@router.get(
    "/tickets/{ticket_id}/analyses",
    response_model=AIAnalysisListResponse,
)
def get_analysis_history(
    ticket_id: str,
    db: DatabaseSession,
):
    return AIAnalysisService.get_history(db, ticket_id)


@router.post(
    "/tickets/{ticket_id}/analyses/{analysis_id}/accept",
    response_model=AcceptAnalysisResponse,
)
def accept_analysis(
    ticket_id: str,
    analysis_id: int,
    db: DatabaseSession,
    recommendations: AcceptAnalysisRequest | None = None,
):
    return AIAnalysisService.accept_recommendation(
        db,
        ticket_id,
        analysis_id,
        recommendations,
    )
