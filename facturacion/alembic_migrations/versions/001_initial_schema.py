"""Initial schema: tabla factura

Revision ID: 001
Revises:
Create Date: 2026-09-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def _table_exists(table: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return table in inspector.get_table_names()


def upgrade():
    if _table_exists('factura'):
        return

    op.create_table(
        'factura',
        sa.Column('id', sa.Integer(), nullable=False),
        # Correlacion con la tienda (idempotencia fiscal)
        sa.Column('pedido_id', sa.Integer(), nullable=False),
        sa.Column('numero_pedido', sa.String(), nullable=False),
        sa.Column('user_email', sa.String(), nullable=False),
        # Estado del ciclo de vida
        sa.Column('estado', sa.String(), nullable=False),
        sa.Column('intentos', sa.Integer(), nullable=False),
        sa.Column('ultimo_error', sa.String(), nullable=True),
        sa.Column('proximo_intento', sa.DateTime(), nullable=True),
        # Datos asignados por ARCA
        sa.Column('cae', sa.String(), nullable=True),
        sa.Column('vencimiento_cae', sa.Date(), nullable=True),
        sa.Column('numero_comprobante', sa.Integer(), nullable=True),
        sa.Column('punto_de_venta', sa.Integer(), nullable=False),
        sa.Column('tipo_comprobante', sa.Integer(), nullable=False),
        # Datos del receptor
        sa.Column('doc_tipo', sa.Integer(), nullable=False),
        sa.Column('doc_numero', sa.String(), nullable=False),
        sa.Column('razon_social', sa.String(length=200), nullable=False),
        # Montos (Decimal -> NUMERIC(12,2))
        sa.Column('monto_neto', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('monto_iva', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('monto_total', sa.Numeric(precision=12, scale=2), nullable=False),
        # Snapshot de los items
        sa.Column('detalles', postgresql.JSONB().with_variant(sa.JSON(), 'sqlite'), nullable=True),
        # Auditoria
        sa.Column('fecha_emision', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_factura_pedido_id'), 'factura', ['pedido_id'], unique=True)
    op.create_index(op.f('ix_factura_numero_pedido'), 'factura', ['numero_pedido'])
    op.create_index(op.f('ix_factura_user_email'), 'factura', ['user_email'])
    op.create_index(op.f('ix_factura_estado'), 'factura', ['estado'])
    op.create_index(op.f('ix_factura_cae'), 'factura', ['cae'])
    op.create_index(op.f('ix_factura_numero_comprobante'), 'factura', ['numero_comprobante'])


def downgrade():
    op.drop_index(op.f('ix_factura_numero_comprobante'), table_name='factura')
    op.drop_index(op.f('ix_factura_cae'), table_name='factura')
    op.drop_index(op.f('ix_factura_estado'), table_name='factura')
    op.drop_index(op.f('ix_factura_user_email'), table_name='factura')
    op.drop_index(op.f('ix_factura_numero_pedido'), table_name='factura')
    op.drop_index(op.f('ix_factura_pedido_id'), table_name='factura')
    op.drop_table('factura')
