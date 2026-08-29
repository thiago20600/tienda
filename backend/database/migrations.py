from sqlalchemy import text
from sqlalchemy.engine import Engine


def migrate_schema(engine: Engine) -> None:
    """Apply idempotent schema changes required by the current application."""
    with engine.begin() as connection:
        connection.execute(text(
            "ALTER TABLE producto "
            "ADD COLUMN IF NOT EXISTS precio_descuento DOUBLE PRECISION"
        ))
        connection.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_producto_precio_descuento "
            "ON producto (precio_descuento)"
        ))
