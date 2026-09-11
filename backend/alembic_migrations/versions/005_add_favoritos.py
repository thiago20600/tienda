"""Add favoritos table

Revision ID: 005
Revises: 004
Create Date: 2026-09-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def _table_exists(table: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return table in inspector.get_table_names()


def upgrade():
    if not _table_exists("favorito"):
        op.create_table(
            'favorito',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('user_email', sa.String(), nullable=False),
            sa.Column('producto_id', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['producto_id'], ['producto.id']),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('user_email', 'producto_id', name='uq_favorito_usuario_producto'),
        )
        op.create_index(op.f('ix_favorito_user_email'), 'favorito', ['user_email'])
        op.create_index(op.f('ix_favorito_producto_id'), 'favorito', ['producto_id'])


def downgrade():
    op.drop_index(op.f('ix_favorito_producto_id'), table_name='favorito')
    op.drop_index(op.f('ix_favorito_user_email'), table_name='favorito')
    op.drop_table('favorito')
