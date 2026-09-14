"""Add banner and pedido updated_by_email

Revision ID: 004
Revises: 003
Create Date: 2026-09-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def _table_exists(table: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return table in inspector.get_table_names()


def _column_exists(table: str, column: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return column in [c["name"] for c in inspector.get_columns(table)]


def upgrade():
    if not _table_exists("banner"):
        op.create_table(
            "banner",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("imagen", sa.String(length=500), nullable=False),
            sa.Column("enlace", sa.String(length=500), nullable=False),
            sa.Column("activo", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("titulo", sa.String(length=100), nullable=False),
            sa.Column(
                "titulo_boton",
                sa.String(length=50),
                nullable=False,
                server_default="Ver más",
            ),
            sa.Column(
                "boton_color",
                sa.String(length=20),
                nullable=False,
                server_default="#2563eb",
            ),
            sa.Column(
                "orden",
                sa.Integer(),
                nullable=False,
                server_default="0",
            ),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=True,
            ),
            sa.PrimaryKeyConstraint("id"),
        )

        op.create_index(
            op.f("ix_banner_orden"),
            "banner",
            ["orden"],
            unique=False,
        )

    if _table_exists("pedido") and not _column_exists("pedido", "updated_by_email"):
        op.add_column(
            "pedido",
            sa.Column("updated_by_email", sa.String(), nullable=True),
        )


def downgrade():
    if _table_exists("pedido") and _column_exists("pedido", "updated_by_email"):
        op.drop_column("pedido", "updated_by_email")

    if _table_exists("banner"):
        op.drop_index(op.f("ix_banner_orden"), table_name="banner")
        op.drop_table("banner")
