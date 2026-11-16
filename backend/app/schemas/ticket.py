
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TicketCreate(BaseModel):
    ticket_id: str = Field(min_length=1, max_length=50)
    customer_id: str = Field(min_length=1, max_length=50)
    subject: str = Field(min_length=1, max_length=500)
    description: str
    created_at: datetime
    status: str = Field(min_length=1, max_length=50)
    category: str = Field(min_length=1, max_length=100)
    priority: str = Field(min_length=1, max_length=50)
    sentiment: str = Field(min_length=1, max_length=50)
    resolution: str | None = None

    @field_validator(
        "ticket_id",
        "customer_id",
        "subject",
        "status",
        "category",
        "priority",
        "sentiment",
    )
    @classmethod
    def strip_required_strings(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty")
        return value


class TicketUpdate(BaseModel):
    customer_id: str | None = Field(default=None, max_length=50)
    subject: str | None = Field(default=None, max_length=500)
    description: str | None = None
    status: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=100)
    priority: str | None = Field(default=None, max_length=50)
    sentiment: str | None = Field(default=None, max_length=50)
    resolution: str | None = None

    @field_validator(
        "customer_id",
        "subject",
        "status",
        "category",
        "priority",
        "sentiment",
    )
    @classmethod
    def validate_nonempty_strings(
        cls, value: str | None
    ) -> str | None:
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("This field cannot be empty")
        return value


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str
    customer_id: str
    subject: str
    description: str
    created_at: datetime
    status: str
    category: str
    priority: str
    sentiment: str
    resolution: str | None


class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class CSVImportResponse(BaseModel):
    total_rows: int
    imported: int
    updated: int
    message: str
