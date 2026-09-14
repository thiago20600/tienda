"""add missing ecommerce tables

Revision ID: 1611982f3937
Revises: REEMPLAZAR
Create Date: 2026-09-14 18:56:27.547933

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1611982f3937'
down_revision: Union[str, None] = 'REEMPLAZAR'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
