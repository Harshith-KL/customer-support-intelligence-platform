
import csv
from io import StringIO
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def make_ticket_payload():
    ticket_id = f"API-{uuid4().hex[:12]}"

    return {
        "ticket_id": ticket_id,
        "customer_id": "CUST-TEST",
        "subject": "API integration test",
        "description": "Testing ticket creation and management.",
        "created_at": "2026-11-16T10:00:00",
        "status": "Open",
        "category": "Technical",
        "priority": "Medium",
        "sentiment": "Neutral",
        "resolution": None,
    }


def test_ticket_crud_flow():
    payload = make_ticket_payload()
    ticket_id = payload["ticket_id"]

    # Create
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 201
    assert response.json()["ticket_id"] == ticket_id

    # Get by ID
    response = client.get(f"/api/v1/tickets/{ticket_id}")
    assert response.status_code == 200
    assert response.json()["subject"] == payload["subject"]

    # Search
    response = client.get(
        "/api/v1/tickets/",
        params={"search": ticket_id},
    )
    assert response.status_code == 200
    assert response.json()["total"] >= 1

    title_search = client.get(
        "/api/v1/tickets/",
        params={"search": "API integration test"},
    )
    assert title_search.status_code == 200
    assert any(
        item["ticket_id"] == ticket_id
        for item in title_search.json()["items"]
    )

    description_search = client.get(
        "/api/v1/tickets/",
        params={"search": "creation and management"},
    )
    assert description_search.status_code == 200
    assert any(
        item["ticket_id"] == ticket_id
        for item in description_search.json()["items"]
    )

    # Update
    response = client.put(
        f"/api/v1/tickets/{ticket_id}",
        json={"status": "In Progress", "priority": "High"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "In Progress"
    assert response.json()["priority"] == "High"

    persisted_update = client.get(
        f"/api/v1/tickets/{ticket_id}"
    )
    assert persisted_update.status_code == 200
    assert persisted_update.json()["status"] == "In Progress"
    assert persisted_update.json()["priority"] == "High"

    # Duplicate creation
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 409

    # Delete
    response = client.delete(f"/api/v1/tickets/{ticket_id}")
    assert response.status_code == 204

    # Verify deletion
    response = client.get(f"/api/v1/tickets/{ticket_id}")
    assert response.status_code == 404


def test_ticket_pagination_and_filters():
    response = client.get(
        "/api/v1/tickets/",
        params={
            "page": 1,
            "page_size": 5,
            "sort_by": "created_at",
            "sort_order": "desc",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) <= 5
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert data["total"] >= 0


def test_csv_import_and_repeat_import():
    csv_data = StringIO()
    writer = csv.DictWriter(
        csv_data,
        fieldnames=[
            "ticket_id",
            "customer_id",
            "subject",
            "description",
            "created_at",
            "status",
            "category",
            "priority",
            "sentiment",
            "resolution",
        ],
    )

    writer.writeheader()

    ticket_id = f"CSV-{uuid4().hex[:12]}"

    writer.writerow({
        "ticket_id": ticket_id,
        "customer_id": "CUST-CSV",
        "subject": "CSV import test",
        "description": "Testing CSV import.",
        "created_at": "2026-11-16 10:00:00",
        "status": "Open",
        "category": "Technical",
        "priority": "Medium",
        "sentiment": "Neutral",
        "resolution": "",
    })

    file_content = csv_data.getvalue()

    first_response = client.post(
        "/api/v1/tickets/import",
        files={
            "file": (
                "test.csv",
                file_content,
                "text/csv",
            )
        },
    )

    assert first_response.status_code == 200
    assert first_response.json()["imported"] == 1
    assert first_response.json()["updated"] == 0

    second_response = client.post(
        "/api/v1/tickets/import",
        files={
            "file": (
                "test.csv",
                file_content,
                "text/csv",
            )
        },
    )

    assert second_response.status_code == 200
    assert second_response.json()["imported"] == 0
    assert second_response.json()["updated"] == 1

    client.delete(f"/api/v1/tickets/{ticket_id}")


def test_ticket_not_found():
    response = client.get(
        "/api/v1/tickets/NONEXISTENT-TICKET"
    )

    assert response.status_code == 404


def test_ticket_filters_by_category_priority_and_status():
    marker = f"FILTER-{uuid4().hex[:8]}"
    cases = [
        ("Billing", "High", "In Progress"),
        ("Account", "High", "In Progress"),
        ("Billing", "Medium", "In Progress"),
        ("Billing", "High", "Open"),
    ]
    created_ids = []

    try:
        for category, priority, status in cases:
            payload = make_ticket_payload()
            payload["subject"] = f"{marker} filter test"
            payload["description"] = f"{marker} description"
            payload["category"] = category
            payload["priority"] = priority
            payload["status"] = status

            response = client.post(
                "/api/v1/tickets/",
                json=payload,
            )
            assert response.status_code == 201
            created_ids.append(payload["ticket_id"])

        response = client.get(
            "/api/v1/tickets/",
            params={
                "search": marker,
                "category": "Billing",
                "priority": "High",
                "status": "In Progress",
            },
        )

        assert response.status_code == 200
        assert [
            item["ticket_id"] for item in response.json()["items"]
        ] == [created_ids[0]]
    finally:
        for ticket_id in created_ids:
            client.delete(f"/api/v1/tickets/{ticket_id}")


def test_invalid_ticket_payload():
    response = client.post(
        "/api/v1/tickets/",
        json={"ticket_id": ""},
    )

    assert response.status_code == 422
