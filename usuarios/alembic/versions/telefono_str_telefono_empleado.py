"""telefono empleado: int -> str

Revision ID: telefono_str
Revises: 8161fe5a867c
Create Date: 2026-09-10

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'telefono_str'
down_revision: Union[str, Sequence[str], None] = '8161fe5a867c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Cambia empleado.telefono de INTEGER a VARCHAR(20)."""
    op.alter_column(
        'empleado', 'telefono',
        existing_type=sa.Integer(),
        type_=sa.String(length=20),
        postgresql_using='telefono::varchar',
        existing_nullable=False,
    )


def downgrade() -> None:
    """Revierte empleado.telefono de VARCHAR a INTEGER."""
    op.execute(
        "UPDATE empleado SET telefono = '0' WHERE telefono !~ '^[0-9]+$'"
    )
    op.alter_column(
        'empleado', 'telefono',
        existing_type=sa.String(length=20),
        type_=sa.Integer(),
        postgresql_using='telefono::integer',
        existing_nullable=False,
    )
