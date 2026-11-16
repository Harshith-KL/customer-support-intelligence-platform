from datetime import datetime

from sqlalchemy import DateTime, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
    )

    customer_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    subject: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    sentiment: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    resolution: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_analyses: Mapped[list["AIAnalysis"]] = relationship(
        back_populates="ticket",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_tickets_status_priority", "status", "priority"),
    )

    def __repr__(self) -> str:
        return f"<Ticket(ticket_id={self.ticket_id!r})>"
