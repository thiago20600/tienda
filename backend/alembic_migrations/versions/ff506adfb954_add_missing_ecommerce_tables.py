"""add missing ecommerce tables

Revision ID: ff506adfb954
Revises: 69aa9fdac221
Create Date: 2026-09-14 18:55:29.238845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = 'ff506adfb954'
down_revision = "69aa9fdac221"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # La tabla vieja ya existe en producción.
    # La renombramos para que coincida con el modelo actual.
    op.rename_table(
        "productos_categoria_link",
        "productoscategorialink",
    )

    # Carrito
    op.create_table(
        "carrito",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_email", sa.String(), nullable=False),
        sa.Column(
            "estado",
            sa.Enum(
                "abierto",
                "confirmado",
                "cancelado",
                name="estadocarrito",
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    # CarritoItem
    op.create_table(
        "carritoitem",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("carrito_id", sa.Integer(), nullable=False),
        sa.Column("producto_id", sa.Integer(), nullable=False),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("precio_unitario", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["carrito_id"], ["carrito.id"]),
        sa.ForeignKeyConstraint(["producto_id"], ["producto.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # Pedido
    op.create_table(
        "pedido",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("numero_pedido", sa.String(), nullable=True),
        sa.Column("carrito_id", sa.Integer(), nullable=False),
        sa.Column(
            "estado",
            sa.Enum(
                "pendiente",
                "pagado",
                "en_proceso",
                "en_camino",
                "entregado",
                "rechazado",
                "cancelado",
                name="estadopedido",
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("canceled_at", sa.DateTime(), nullable=True),
        sa.Column("entregado_at", sa.DateTime(), nullable=True),
        sa.Column("user_email", sa.String(), nullable=False),
        sa.Column("comentarios", sa.String(), nullable=True),
        sa.Column("updated_by_email", sa.String(), nullable=True),
        sa.Column(
            "metodo_pago",
            sa.Enum(
                "tarjeta",
                "efectivo",
                name="metodopago",
            ),
            nullable=False,
        ),
        sa.Column("precio_total", sa.Float(), nullable=False),
        sa.Column("idempotency_key", sa.String(), nullable=False),
        sa.Column("mp_payment_id", sa.String(), nullable=True),
        sa.Column("mp_response_raw", postgresql.JSONB(), nullable=True),
        sa.ForeignKeyConstraint(["carrito_id"], ["carrito.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("numero_pedido"),
    )

    # DetallePedido
    op.create_table(
        "detallepedido",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("pedido_id", sa.Integer(), nullable=False),
        sa.Column("producto_id", sa.Integer(), nullable=False),
        sa.Column("cantidad", sa.Integer(), nullable=False),
        sa.Column("precio_unitario", sa.Float(), nullable=False),
        sa.Column("subtotal", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["pedido_id"], ["pedido.id"]),
        sa.ForeignKeyConstraint(["producto_id"], ["producto.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # El modelo actual tiene index=True en stock.
    op.create_index(
        "ix_producto_stock",
        "producto",
        ["stock"],
        unique=False,
    )

    # El modelo permite NULL en estos campos.
    op.alter_column(
        "configuraciongeneral",
        "emails_contacto",
        existing_type=sa.JSON(),
        nullable=True,
    )

    op.alter_column(
        "configuraciongeneral",
        "numeros_contacto",
        existing_type=sa.JSON(),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "configuraciongeneral",
        "numeros_contacto",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.alter_column(
        "configuraciongeneral",
        "emails_contacto",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.drop_index(
        "ix_producto_stock",
        table_name="producto",
    )

    op.drop_table("detallepedido")
    op.drop_table("pedido")
    op.drop_table("carritoitem")
    op.drop_table("carrito")

    op.rename_table(
        "productoscategorialink",
        "productos_categoria_link",
    )

    op.execute("DROP TYPE IF EXISTS metodopago")
    op.execute("DROP TYPE IF EXISTS estadopedido")
    op.execute("DROP TYPE IF EXISTS estadocarrito")