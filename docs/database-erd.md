# Database entity relationship diagram

This diagram reflects the SQLAlchemy models and migrations in `backend/app/models/` and `backend/migrations/versions/`. It shows application tables only; Alembic's version bookkeeping is migration metadata, not a domain entity.

```mermaid
erDiagram
    tickets ||--o{ ai_analyses : "has analysis history"

    tickets {
        varchar_50 ticket_id PK
        varchar_50 customer_id
        varchar_500 subject
        text description
        datetime created_at
        varchar_50 status
        varchar_100 category
        varchar_50 priority
        varchar_50 sentiment
        text resolution "nullable"
    }

    ai_analyses {
        integer id PK
        varchar_50 ticket_id FK
        varchar_100 category_recommendation "nullable"
        varchar_50 priority_recommendation "nullable"
        varchar_50 sentiment "nullable"
        text summary "nullable"
        text reason "nullable"
        text suggested_response "nullable"
        float confidence_score "nullable"
        varchar_100 provider "nullable"
        varchar_150 model_name "nullable"
        datetime_tz created_at
    }
```

## Relationship and schema notes

- `tickets.ticket_id` is the ticket primary key.
- `ai_analyses.id` is an auto-incrementing primary key.
- `ai_analyses.ticket_id` is a non-null foreign key to `tickets.ticket_id`, with database `ON DELETE CASCADE` and an ORM `all, delete-orphan` relationship.
- A ticket may have zero or more analysis records; each analysis belongs to one ticket.
- `ai_analyses.reason` was added by a follow-up Alembic migration and is nullable to preserve existing rows.
- The ticket model indexes `customer_id`, `created_at`, `status`, `category`, and `priority`, and defines a composite `(status, priority)` index. `ai_analyses.ticket_id` is indexed.
- Recommendation history is stored in `ai_analyses`; there is no AI summary column on `tickets`.
- Category, priority, and status columns are strings, not database enums or check constraints. Application choices/AI response validation are described in the [technical note](technical-note.md).

