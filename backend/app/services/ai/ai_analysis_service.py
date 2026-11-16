
import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.repositories.ai_analysis_repository import (
    AIAnalysisRepository,
)
from app.schemas.ai_analysis import AcceptAnalysisRequest
from app.services.ai.openrouter_service import (
    OpenRouterAnalysisError,
    OpenRouterAnalysisService,
)
from app.services.ticket_service import TicketService

logger = logging.getLogger(__name__)


class AIAnalysisService:

    @staticmethod
    def analyze_ticket(db: Session, ticket_id: str):
        try:
            logger.info(
                "Ticket analysis request started",
                extra={"ticket_id": ticket_id},
            )
            ticket = TicketService.get_ticket(db, ticket_id)
            result = OpenRouterAnalysisService.analyze_ticket(ticket)

            analysis = AIAnalysisRepository.create(
                db=db,
                ticket=ticket,
                result=result,
                model_name=settings.openrouter_model,
            )
            logger.info(
                "Ticket analysis successfully completed",
                extra={
                    "ticket_id": ticket_id,
                    "llm_provider": "OpenRouter",
                    "model_name": settings.openrouter_model,
                },
            )
            return analysis
        except HTTPException:
            raise
        except OpenRouterAnalysisError as exc:
            logger.error(
                "Ticket analysis failed",
                extra={
                    "ticket_id": ticket_id,
                    "error_code": exc.error_code,
                },
            )
            raise HTTPException(
                status_code=exc.http_status,
                detail=exc.user_message,
                headers=exc.response_headers,
            ) from exc
        except SQLAlchemyError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to save the AI analysis.",
            ) from exc
        except Exception as exc:
            logger.exception(
                "Unexpected ticket analysis failure",
                extra={
                    "ticket_id": ticket_id,
                    "error_code": "INTERNAL_ERROR",
                },
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while analysing this ticket.",
            ) from exc

    @staticmethod
    def get_history(db: Session, ticket_id: str):
        TicketService.get_ticket(db, ticket_id)

        items, total = AIAnalysisRepository.get_history(
            db,
            ticket_id,
        )

        return {
            "items": items,
            "total": total,
        }

    @staticmethod
    def accept_recommendation(
        db: Session,
        ticket_id: str,
        analysis_id: int,
        recommendations: AcceptAnalysisRequest | None = None,
    ):
        ticket = TicketService.get_ticket(db, ticket_id)

        analysis = AIAnalysisRepository.get_by_id(
            db,
            ticket_id,
            analysis_id,
        )

        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI analysis not found for this ticket.",
            )

        category = (
            recommendations.category
            if recommendations
            else analysis.category_recommendation
        )
        priority = (
            recommendations.priority
            if recommendations
            else analysis.priority_recommendation
        )

        if category is None or priority is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="This analysis has incomplete recommendations.",
            )

        ticket.category = category
        ticket.priority = priority

        try:
            db.commit()
            db.refresh(ticket)
        except SQLAlchemyError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to apply AI recommendations.",
            ) from exc

        return {
            "ticket_id": ticket.ticket_id,
            "category": ticket.category,
            "priority": ticket.priority,
            "message": "AI recommendations applied successfully.",
        }
