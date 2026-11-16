
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.ticket import (
    CSVImportResponse,
    TicketCreate,
    TicketListResponse,
    TicketResponse,
    TicketUpdate,
)
from app.services.ticket_service import TicketService


router = APIRouter()

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post(
    "/",
    response_model=TicketResponse,
    status_code=201,
)
def create_ticket(
    ticket_data: TicketCreate,
    db: DatabaseSession,
):
    return TicketService.create_ticket(db, ticket_data)


@router.get("/", response_model=TicketListResponse)
def list_tickets(
    db: DatabaseSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    category: str | None = None,
    priority: str | None = None,
    sentiment: str | None = None,
    sort_by: Literal[
        "created_at", "ticket_id", "priority", "status", "category"
    ] = "created_at",
    sort_order: Literal["asc", "desc"] = "desc",
):
    return TicketService.get_tickets(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        status_filter=status_filter,
        category=category,
        priority=priority,
        sentiment=sentiment,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: str,
    db: DatabaseSession,
):
    return TicketService.get_ticket(db, ticket_id)


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: str,
    update_data: TicketUpdate,
    db: DatabaseSession,
):
    return TicketService.update_ticket(
        db, ticket_id, update_data
    )


@router.delete("/{ticket_id}", status_code=204)
def delete_ticket(
    ticket_id: str,
    db: DatabaseSession,
):
    TicketService.delete_ticket(db, ticket_id)
    return None


@router.post("/import", response_model=CSVImportResponse)
async def import_tickets(
    db: DatabaseSession,
    file: UploadFile = File(...),
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded CSV file is empty",
        )

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="CSV file must not exceed 10 MB",
        )

    try:
        csv_content = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=400,
            detail="CSV must use UTF-8 encoding",
        ) from exc

    return TicketService.import_csv(db, csv_content)
