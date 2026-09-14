"""Add configuracion general

Revision ID: 69aa9fdac221
Revises: 005
Create Date: 2026-09-14 18:34:03.749973

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69aa9fdac221'
down_revision: Union[str, None] = '005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "configuraciongeneral",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre_tienda", sa.String(), nullable=False),
        sa.Column("logo_url", sa.String(), nullable=True),
        sa.Column("emails_contacto", sa.JSON(), nullable=False),
        sa.Column("numeros_contacto", sa.JSON(), nullable=False),
        sa.Column("color_primario", sa.String(), nullable=False),
        sa.Column("color_secundario", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.execute(
        """
        INSERT INTO configuraciongeneral (
            id,
            nombre_tienda,
            logo_url,
            emails_contacto,
            numeros_contacto,
            color_primario,
            color_secundario
        )
        VALUES (
            1,
            'Mi Tienda',
            NULL,
            '[]',
            '[]',
            '#009ee3',
            '#0081b8'
        )
        """
    )


def downgrade() -> None:
    op.drop_table("configuraciongeneral")
