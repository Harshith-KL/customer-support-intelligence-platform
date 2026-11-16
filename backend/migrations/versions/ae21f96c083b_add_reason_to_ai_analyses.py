"""add reason to ai analyses

Revision ID: ae21f96c083b
Revises: bd2642a4c7af
Create Date: 2026-11-17 01:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "ae21f96c083b"
down_revision: Union[str, Sequence[str], None] = "bd2642a4c7af"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "ai_analyses",
        sa.Column("reason", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("ai_analyses", "reason")
