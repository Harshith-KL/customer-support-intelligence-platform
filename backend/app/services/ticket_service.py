
import csv
from io import StringIO

from fastapi import HTTPException, status
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import TicketCreate, TicketUpdate


class TicketService:

    @staticmethod
    def create_ticket(
        db: Session,
        ticket_data: TicketCreate,
    ):
        existing = TicketRepository.get_by_id(
            db, ticket_data.ticket_id
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ticket ID already exists",
            )

        try:
            return TicketRepository.create(db, ticket_data)
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def get_ticket(db: Session, ticket_id: str):
        ticket = TicketRepository.get_by_id(db, ticket_id)

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found",
            )

        return ticket

    @staticmethod
    def get_tickets(
        db: Session,
        page: int,
        page_size: int,
        search: str | None,
        status_filter: str | None,
        category: str | None,
        priority: str | None,
        sentiment: str | None,
        sort_by: str,
        sort_order: str,
    ):
        items, total = TicketRepository.get_all(
            db=db,
            page=page,
            page_size=page_size,
            search=search,
            status=status_filter,
            category=category,
            priority=priority,
            sentiment=sentiment,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        total_pages = (total + page_size - 1) // page_size

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    @staticmethod
    def update_ticket(
        db: Session,
        ticket_id: str,
        update_data: TicketUpdate,
    ):
        ticket = TicketService.get_ticket(db, ticket_id)

        changes = update_data.model_dump(exclude_unset=True)

        if not changes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one field must be provided",
            )

        try:
            return TicketRepository.update(
                db, ticket, update_data
            )
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def delete_ticket(db: Session, ticket_id: str):
        ticket = TicketService.get_ticket(db, ticket_id)

        try:
            TicketRepository.delete(db, ticket)
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def import_csv(db: Session, content: str):
        expected_columns = {
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
        }

        try:
            reader = csv.DictReader(StringIO(content))

            if not reader.fieldnames:
                raise HTTPException(
                    status_code=400,
                    detail="CSV file is empty or has no header",
                )

            if set(reader.fieldnames) != expected_columns:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": "CSV columns do not match expected schema",
                        "expected": sorted(expected_columns),
                        "received": reader.fieldnames,
                    },
                )

            validated_tickets = []

            for row_number, row in enumerate(reader, start=2):
                try:
                    if None in row or any(
                        value is None for value in row.values()
                    ):
                        raise ValueError("Missing or extra CSV values")

                    validated_tickets.append(
                        TicketCreate.model_validate(row)
                    )

                except (ValidationError, ValueError) as exc:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Invalid CSV data at row {row_number}: {exc}",
                    ) from exc

            if not validated_tickets:
                raise HTTPException(
                    status_code=400,
                    detail="CSV contains no ticket records",
                )

            ticket_ids = [
                ticket.ticket_id for ticket in validated_tickets
            ]

            if len(ticket_ids) != len(set(ticket_ids)):
                raise HTTPException(
                    status_code=422,
                    detail="CSV contains duplicate ticket IDs",
                )

            total_rows = len(validated_tickets)

            imported, updated = TicketRepository.import_csv_rows(
                db, validated_tickets
            )

            return {
                "total_rows": total_rows,
                "imported": imported,
                "updated": updated,
                "message": "CSV import completed successfully",
            }

        except SQLAlchemyError:
            db.rollback()
            raise
