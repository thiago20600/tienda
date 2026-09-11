"""Initial backend schema with products and categories

Revision ID: 001
Revises: 
Create Date: 2026-08-31 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create categoria table
    op.create_table(
        'categoria',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('estado', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create producto table
    op.create_table(
        'producto',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(), nullable=False),
        sa.Column('sku', sa.Integer(), nullable=True),
        sa.Column('precio', sa.Float(), nullable=False),
        sa.Column('stock', sa.Integer(), nullable=False),
        sa.Column('descripcion', sa.String(length=1200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('user_email', sa.String(), nullable=False),
        sa.Column('imagen_url', sa.JSON(), nullable=True),
        sa.Column('producto_activo', sa.Boolean(), nullable=False),
        sa.Column('eliminado_at', sa.DateTime(), nullable=True),
        sa.Column('precio_descuento', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_producto_nombre'), 'producto', ['nombre'], unique=False)
    op.create_index(op.f('ix_producto_precio'), 'producto', ['precio'], unique=False)
    op.create_index(op.f('ix_producto_precio_descuento'), 'producto', ['precio_descuento'], unique=False)
    op.create_index(op.f('ix_producto_sku'), 'producto', ['sku'], unique=False)

    # Create productos_categoria_link table (many-to-many)
    op.create_table(
        'productos_categoria_link',
        sa.Column('producto_id', sa.Integer(), nullable=False),
        sa.Column('categoria_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['categoria_id'], ['categoria.id'], ),
        sa.ForeignKeyConstraint(['producto_id'], ['producto.id'], ),
        sa.PrimaryKeyConstraint('producto_id', 'categoria_id')
    )


def downgrade() -> None:
    op.drop_table('productos_categoria_link')
    op.drop_index(op.f('ix_producto_sku'), table_name='producto')
    op.drop_index(op.f('ix_producto_precio_descuento'), table_name='producto')
    op.drop_index(op.f('ix_producto_precio'), table_name='producto')
    op.drop_index(op.f('ix_producto_nombre'), table_name='producto')
    op.drop_table('producto')
    op.drop_table('categoria')
