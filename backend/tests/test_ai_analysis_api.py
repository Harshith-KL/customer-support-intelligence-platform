from datetime import datetime
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.database import get_db
from app.main import app
from app.models import AIAnalysis, Ticket
from app.schemas.ai_analysis import AIAnalysisResult
from app.services.ai.openrouter_service import (
    OpenRouterAnalysisError,
    OpenRouterAnalysisService,
)


@pytest.fixture
def api_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    test_session_factory = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )
    previous_overrides = app.dependency_overrides.copy()

    def override_get_db():
        db = test_session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client, test_session_factory

    app.dependency_overrides.clear()
    app.dependency_overrides.update(previous_overrides)
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


def create_test_ticket(session_factory):
    ticket_id = f"AI-{uuid4().hex[:12]}"
    with session_factory() as db:
        db.add(
            Ticket(
                ticket_id=ticket_id,
                customer_id="AI-TEST-CUSTOMER",
                subject="Payment charged twice",
                description="I was charged twice for my subscription.",
                created_at=datetime.now(),
                status="Open",
                category="Billing",
                priority="Medium",
                sentiment="Negative",
                resolution=None,
            )
        )
        db.commit()
    return ticket_id


def create_test_analysis(session_factory, ticket_id):
    with session_factory() as db:
        analysis = AIAnalysis(
            ticket_id=ticket_id,
            category_recommendation="Technical",
            priority_recommendation="Critical",
            sentiment="Negative",
            summary="The service is unavailable.",
            reason="The customer cannot access the service.",
            suggested_response="We are investigating the outage.",
            confidence_score=0.96,
            provider="OpenRouter",
            model_name="test-model",
        )
        db.add(analysis)
        db.commit()
        return analysis.id


def test_analyze_ticket_saves_valid_result_and_history(
    api_client,
    monkeypatch,
):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)
    fake_result = AIAnalysisResult(
        category="Billing",
        priority="High",
        summary="Customer reports a duplicate subscription charge.",
        reason="The customer describes being charged twice.",
    )
    monkeypatch.setattr(
        OpenRouterAnalysisService,
        "analyze_ticket",
        staticmethod(lambda ticket: fake_result),
    )

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyze"
    )

    assert response.status_code == 201
    analysis = response.json()
    assert analysis["ticket_id"] == ticket_id
    assert analysis["category"] == "Billing"
    assert analysis["priority"] == "High"
    assert analysis["category_recommendation"] == "Billing"
    assert analysis["priority_recommendation"] == "High"
    assert analysis["summary"]
    assert analysis["reason"]
    assert analysis["provider"] == "OpenRouter"

    history_response = client.get(
        f"/api/v1/tickets/{ticket_id}/analyses"
    )
    assert history_response.status_code == 200
    assert history_response.json()["total"] == 1


def test_failed_analysis_does_not_save_or_modify_ticket(
    api_client,
    monkeypatch,
):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)

    def fail_analysis(ticket):
        raise OpenRouterAnalysisError(
            error_code="OPENROUTER_UNAVAILABLE",
            user_message="The AI analysis service is temporarily unavailable. Please try again later.",
            http_status=503,
        )

    monkeypatch.setattr(
        OpenRouterAnalysisService,
        "analyze_ticket",
        staticmethod(fail_analysis),
    )

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyze"
    )

    assert response.status_code == 503
    assert response.json()["detail"] == (
        "The AI analysis service is temporarily unavailable. Please try again later."
    )

    with session_factory() as db:
        ticket = db.get(Ticket, ticket_id)
        analysis_count = db.scalar(
            select(func.count())
            .select_from(AIAnalysis)
            .where(AIAnalysis.ticket_id == ticket_id)
        )
        assert ticket.category == "Billing"
        assert ticket.priority == "Medium"
        assert analysis_count == 0


def test_rate_limit_error_returns_429_and_retry_after(
    api_client,
    monkeypatch,
):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)

    def fail_with_rate_limit(ticket):
        raise OpenRouterAnalysisError(
            error_code="OPENROUTER_RATE_LIMITED",
            user_message="OpenRouter is receiving too many requests. Please try again shortly.",
            http_status=429,
            response_headers={"Retry-After": "5"},
        )

    monkeypatch.setattr(
        OpenRouterAnalysisService,
        "analyze_ticket",
        staticmethod(fail_with_rate_limit),
    )

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyze"
    )

    assert response.status_code == 429
    assert response.headers["retry-after"] == "5"


def test_accept_ai_recommendation(api_client):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)
    analysis_id = create_test_analysis(session_factory, ticket_id)

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyses/{analysis_id}/accept"
    )

    assert response.status_code == 200
    assert response.json()["category"] == "Technical"
    assert response.json()["priority"] == "Critical"

    with session_factory() as db:
        ticket = db.get(Ticket, ticket_id)
        assert ticket.category == "Technical"
        assert ticket.priority == "Critical"


def test_accept_user_edited_recommendations_and_preserve_original_history(
    api_client,
):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)
    analysis_id = create_test_analysis(session_factory, ticket_id)

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyses/{analysis_id}/accept",
        json={"category": "Account", "priority": "Low"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "ticket_id": ticket_id,
        "category": "Account",
        "priority": "Low",
        "message": "AI recommendations applied successfully.",
    }

    with session_factory() as db:
        ticket = db.get(Ticket, ticket_id)
        analysis = db.get(AIAnalysis, analysis_id)
        assert ticket.category == "Account"
        assert ticket.priority == "Low"
        assert analysis.category_recommendation == "Technical"
        assert analysis.priority_recommendation == "Critical"

    history = client.get(
        f"/api/v1/tickets/{ticket_id}/analyses"
    )
    assert history.status_code == 200
    saved_analysis = history.json()["items"][0]
    assert saved_analysis["id"] == analysis_id
    assert saved_analysis["category_recommendation"] == "Technical"
    assert saved_analysis["priority_recommendation"] == "Critical"


def test_analysis_cannot_be_accepted_for_a_different_ticket(api_client):
    client, session_factory = api_client
    source_ticket_id = create_test_ticket(session_factory)
    target_ticket_id = create_test_ticket(session_factory)
    analysis_id = create_test_analysis(session_factory, source_ticket_id)

    response = client.post(
        f"/api/v1/tickets/{target_ticket_id}/analyses/{analysis_id}/accept",
        json={"category": "Account", "priority": "Low"},
    )

    assert response.status_code == 404

    with session_factory() as db:
        source_ticket = db.get(Ticket, source_ticket_id)
        target_ticket = db.get(Ticket, target_ticket_id)
        analysis = db.get(AIAnalysis, analysis_id)
        assert source_ticket.category == "Billing"
        assert source_ticket.priority == "Medium"
        assert target_ticket.category == "Billing"
        assert target_ticket.priority == "Medium"
        assert analysis.ticket_id == source_ticket_id


@pytest.mark.parametrize(
    "recommendations",
    [
        {"category": "Payment", "priority": "Low"},
        {"category": "Account", "priority": "Urgent"},
    ],
)
def test_accept_rejects_unsupported_user_recommendations(
    api_client,
    recommendations,
):
    client, session_factory = api_client
    ticket_id = create_test_ticket(session_factory)
    analysis_id = create_test_analysis(session_factory, ticket_id)

    response = client.post(
        f"/api/v1/tickets/{ticket_id}/analyses/{analysis_id}/accept",
        json=recommendations,
    )

    assert response.status_code == 422

    with session_factory() as db:
        ticket = db.get(Ticket, ticket_id)
        assert ticket.category == "Billing"
        assert ticket.priority == "Medium"


def test_analysis_for_missing_ticket_returns_404(api_client):
    client, _ = api_client

    response = client.post(
        "/api/v1/tickets/UNKNOWN-AI-TICKET/analyze"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Ticket not found"
