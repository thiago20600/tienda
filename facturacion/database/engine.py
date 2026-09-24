from typing import Annotated

from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine

from config import settings

engine = create_engine(settings.DB_URL)


def get_session():
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise


SessionDep = Annotated[Session, Depends(get_session)]


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
