"""Add banner orden and pedido updated_by_email

Revision ID: 004
Revises: 003
Create Date: 2026-09-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def _column_exists(table: str, column: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return column in [c["name"] for c in inspector.get_columns(table)]


def upgrade():
    if not _column_exists("banner", "orden"):
        op.add_column("banner", sa.Column("orden", sa.Integer(), nullable=False, server_default="0"))
    if not _column_exists("pedido", "updated_by_email"):
        op.add_column("pedido", sa.Column("updated_by_email", sa.String(), nullable=True))


def downgrade():
    op.drop_column("pedido", "updated_by_email")
    op.drop_column("banner", "orden")