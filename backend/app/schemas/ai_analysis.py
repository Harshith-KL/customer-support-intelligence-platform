
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


TicketCategory = Literal[
    "Account",
    "Billing",
    "Delivery",
    "Other",
    "Product",
    "Technical",
]

TicketPriority = Literal[
    "Low",
    "Medium",
    "High",
    "Critical",
]

TicketSentiment = Literal[
    "Positive",
    "Neutral",
    "Negative",
]


class AIAnalysisResult(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    category: TicketCategory
    priority: TicketPriority
    summary: str = Field(min_length=1, max_length=2000)
    reason: str = Field(min_length=1, max_length=2000)


class AcceptAnalysisRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    category: TicketCategory
    priority: TicketPriority


class AIAnalysisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: str
    category: str | None = Field(
        validation_alias="category_recommendation"
    )
    priority: str | None = Field(
        validation_alias="priority_recommendation"
    )
    category_recommendation: str | None
    priority_recommendation: str | None
    sentiment: str | None
    summary: str | None
    reason: str | None
    suggested_response: str | None
    confidence_score: float | None
    provider: str | None
    model_name: str | None
    created_at: datetime


class AIAnalysisListResponse(BaseModel):
    items: list[AIAnalysisResponse]
    total: int


class AcceptAnalysisResponse(BaseModel):
    ticket_id: str
    category: str
    priority: str
    message: str
