from fastapi import APIRouter, HTTPException, Depends
from database.engine import SessionDep
from models.users import User, Rol
from bcrypt import checkpw
from auth.auth import create_access_token
from sqlmodel import select
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

router = APIRouter()


@router.post('/login')
async def login(session:SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    
    db_user = session.exec(select(User).where(User.email == form_data.username)).first()

    if not db_user:
        raise HTTPException(status_code=400, detail='Usuario no encontrado')

    if not db_user.active:
        raise HTTPException(status_code=403, detail='Cuenta no activada')

    if checkpw(password=form_data.password.encode('utf-8') ,hashed_password=db_user.password.encode('utf-8')):
        rol_nombre = db_user.rol_obj.nombre if db_user.rol_obj else db_user.rol
        
        # Get permissions for the user's role
        permisos = []
        if db_user.rol_obj:
            permisos = [p.nombre for p in db_user.rol_obj.permisos]
        
        return {'access': create_access_token(db_user.email, rol_nombre, permisos)}
    else:
        raise HTTPException(status_code=403, detail='Error de autenticacion')
