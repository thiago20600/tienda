"""002: campo procesando, desglose_iva, fecha_emision anulable

Revision ID: 002
Revises: 001
Create Date: 2026-09-21 00:00:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def _columnas_existentes() -> set[str]:
    inspector = sa.inspect(op.get_bind())
    return {col['name'] for col in inspector.get_columns('factura')}


def upgrade():
    columnas = _columnas_existentes()

    # Desglose fiscal por alicua (JSONB en postgres / JSON en sqlite)
    if 'desglose_iva' not in columnas:
        op.add_column(
            'factura',
            sa.Column('desglose_iva', sa.JSON().with_variant(postgresql_json(), 'postgresql'), nullable=True),
        )

    # fecha_emision pasa a ser anulable: es la fecha de AUTORIZACION de ARCA, no la
    # de registro del evento (created_at). En facturas pendientes todavia no existe.
    op.alter_column('factura', 'fecha_emision', existing_type=sa.DateTime(), nullable=True)

    # Migracion de datos: las facturas ya aprobadas conservan su fecha de emision.
    # Las pendientes/error/rechazadas quedan con fecha_emision en NULL (real: ARCA
    # todavia no las autorizo).

    # Indice parcial para la barrida de reintentos: solo filas pendientes de emision.
    # (Los indices create se intentan con IF NOT EXISTS para ser re-ejecutables.)
    op.create_index(
        'ix_factura_pendientes',
        'factura',
        ['estado', 'proximo_intento'],
        unique=False,
        postgresql_where=sa.text("estado in ('pendiente', 'procesando', 'error')"),
    )


def postgresql_json():
    from sqlalchemy.dialects.postgresql import JSONB

    return JSONB()


def downgrade():
    op.drop_index('ix_factura_pendientes', table_name='factura')
    op.alter_column('factura', 'fecha_emision', existing_type=sa.DateTime(), nullable=False)
    op.drop_column('factura', 'desglose_iva')