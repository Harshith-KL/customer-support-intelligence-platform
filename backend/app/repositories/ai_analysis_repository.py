
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import AIAnalysis, Ticket
from app.schemas.ai_analysis import AIAnalysisResult


class AIAnalysisRepository:

    @staticmethod
    def create(
        db: Session,
        ticket: Ticket,
        result: AIAnalysisResult,
        model_name: str,
    ) -> AIAnalysis:
        analysis = AIAnalysis(
            ticket_id=ticket.ticket_id,
            category_recommendation=result.category,
            priority_recommendation=result.priority,
            sentiment=None,
            summary=result.summary,
            reason=result.reason,
            suggested_response=None,
            confidence_score=None,
            provider="OpenRouter",
            model_name=model_name,
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return analysis

    @staticmethod
    def get_history(
        db: Session,
        ticket_id: str,
    ) -> tuple[list[AIAnalysis], int]:
        query = (
            select(AIAnalysis)
            .where(AIAnalysis.ticket_id == ticket_id)
            .order_by(AIAnalysis.created_at.desc())
        )

        total = db.scalar(
            select(func.count())
            .select_from(AIAnalysis)
            .where(AIAnalysis.ticket_id == ticket_id)
        ) or 0

        items = list(db.scalars(query).all())

        return items, total

    @staticmethod
    def get_by_id(
        db: Session,
        ticket_id: str,
        analysis_id: int,
    ) -> AIAnalysis | None:
        return db.scalar(
            select(AIAnalysis).where(
                AIAnalysis.id == analysis_id,
                AIAnalysis.ticket_id == ticket_id,
            )
        )
