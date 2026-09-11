from config import settings
from typing import Annotated
from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine

engine = create_engine(settings.DB_URL)


def get_session():
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise


SessionDep = Annotated[Session, Depends(get_session)]