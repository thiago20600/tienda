# -*- coding: utf-8 -*-
from config import settings
from typing import Annotated
from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine


engine = create_engine(settings.DB_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise


SessionDep = Annotated[Session, Depends(get_session)]