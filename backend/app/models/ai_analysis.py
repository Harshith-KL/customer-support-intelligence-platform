from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    ticket_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("tickets.ticket_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    category_recommendation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    priority_recommendation: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    sentiment: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    suggested_response: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    provider: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    model_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    ticket: Mapped["Ticket"] = relationship(
        back_populates="ai_analyses",
    )
