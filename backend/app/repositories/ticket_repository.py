
from sqlalchemy import func, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate


class TicketRepository:

    @staticmethod
    def create(db: Session, ticket_data: TicketCreate) -> Ticket:
        ticket = Ticket(**ticket_data.model_dump())
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def get_by_id(db: Session, ticket_id: str) -> Ticket | None:
        return db.get(Ticket, ticket_id)

    @staticmethod
    def get_all(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
        status: str | None = None,
        category: str | None = None,
        priority: str | None = None,
        sentiment: str | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[list[Ticket], int]:

        query = select(Ticket)

        if search:
            search_term = f"%{search.strip()}%"
            query = query.where(
                or_(
                    Ticket.ticket_id.ilike(search_term),
                    Ticket.customer_id.ilike(search_term),
                    Ticket.subject.ilike(search_term),
                    Ticket.description.ilike(search_term),
                )
            )

        if status:
            query = query.where(Ticket.status.ilike(status))

        if category:
            query = query.where(Ticket.category.ilike(category))

        if priority:
            query = query.where(Ticket.priority.ilike(priority))

        if sentiment:
            query = query.where(Ticket.sentiment.ilike(sentiment))

        count_query = select(func.count()).select_from(
            query.order_by(None).subquery()
        )
        total = db.scalar(count_query) or 0

        allowed_sort_fields = {
            "created_at": Ticket.created_at,
            "ticket_id": Ticket.ticket_id,
            "priority": Ticket.priority,
            "status": Ticket.status,
            "category": Ticket.category,
        }

        sort_column = allowed_sort_fields[sort_by]

        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        query = query.offset((page - 1) * page_size).limit(page_size)

        items = list(db.scalars(query).all())

        return items, total

    @staticmethod
    def update(
        db: Session,
        ticket: Ticket,
        update_data: TicketUpdate,
    ) -> Ticket:
        for field, value in update_data.model_dump(
            exclude_unset=True
        ).items():
            setattr(ticket, field, value)

        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def delete(db: Session, ticket: Ticket) -> None:
        db.delete(ticket)
        db.commit()

    @staticmethod
    def import_csv_rows(
        db: Session,
        tickets: list[TicketCreate],
    ) -> tuple[int, int]:

        imported = 0
        updated = 0

        for ticket_data in tickets:
            values = ticket_data.model_dump()

            existing = db.get(Ticket, values["ticket_id"])

            statement = insert(Ticket).values(**values)

            statement = statement.on_conflict_do_update(
                index_elements=[Ticket.ticket_id],
                set_={
                    key: value
                    for key, value in values.items()
                    if key != "ticket_id"
                },
            )

            db.execute(statement)

            if existing:
                updated += 1
            else:
                imported += 1

        db.commit()

        return imported, updated
