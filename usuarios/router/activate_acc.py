from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import select
from models.users import User
from database.engine import SessionDep
from jose import jwt
from config import settings


router = APIRouter()


@router.get('/activate_account/{token}')
def activate_account(session:SessionDep, token:str):

    decode = jwt.decode(token, key=settings.SECRET_KEY_JWT, algorithms=[settings.ALGORITHM])

    email = decode.get('sub')


    db_user = session.exec(select(User).where(User.email == email)).first()

    if not db_user:
        raise HTTPException(status_code=400, detail={'message': 'usuario no encontrado'})
    
    db_user.active = True

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return JSONResponse(status_code=200, content={'message': 'Cuenta habilitada con exito'})
