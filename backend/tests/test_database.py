from datetime import datetime
from uuid import uuid4

from sqlalchemy import text

from app.db.database import SessionLocal, engine
from app.models import AIAnalysis, Ticket


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

    assert result == "customer_support_db"


def test_ticket_and_ai_analysis_relationship():
    db = SessionLocal()

    try:
        ticket = Ticket(
            ticket_id=f"TEST-{uuid4().hex[:12]}",
            customer_id="TEST-CUSTOMER",
            subject="Database integration test",
            description="Testing ticket and AI analysis relationship.",
            created_at=datetime.now(),
            status="Open",
            category="Technical",
            priority="Medium",
            sentiment="Neutral",
            resolution=None,
        )

        analysis = AIAnalysis(
            category_recommendation="Technical",
            priority_recommendation="High",
            sentiment="Negative",
            summary="Test analysis summary",
            suggested_response="Thank you for contacting support.",
            confidence_score=0.92,
            provider="test",
            model_name="test-model",
        )

        ticket.ai_analyses.append(analysis)

        db.add(ticket)
        db.flush()

        assert analysis.ticket_id == ticket.ticket_id
        assert analysis.ticket is ticket
        assert len(ticket.ai_analyses) == 1

    finally:
        db.rollback()
        db.close()
