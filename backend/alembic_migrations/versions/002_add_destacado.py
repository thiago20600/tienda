"""Add destacado boolean to categoria and producto

Revision ID: 002
Revises: 001
Create Date: 2026-09-09 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('categoria', sa.Column('destacado', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('producto', sa.Column('destacado', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column('producto', 'destacado')
    op.drop_column('categoria', 'destacado')