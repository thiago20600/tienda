from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends, Response
from database.engine import SessionDep
from models.users import User
from models.mail import EmailSchema, RecuperarPasswordRequest, RestablecerPasswordRequest
from bcrypt import checkpw
from auth.auth import create_access_token
from sqlmodel import select
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from exceptions.usuario import TokenResetInvalidoError
from services.UserService import UserService
from utils.mail import send_mail_reset_password

router = APIRouter()
user_service = UserService()


@router.post('/login')
async def login(session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response):
    db_user = session.exec(select(User).where(User.email == form_data.username)).first()

    if not db_user:
        raise HTTPException(status_code=400, detail='Usuario no encontrado')

    if not db_user.active:
        raise HTTPException(status_code=403, detail='Cuenta no activada')

    if not checkpw(password=form_data.password.encode('utf-8'), hashed_password=db_user.password.encode('utf-8')):
        raise HTTPException(status_code=403, detail='Error de autenticacion')

    rol_nombre = db_user.rol_obj.nombre if db_user.rol_obj else db_user.rol
    permisos = []
    if db_user.rol_obj:
        permisos = [p.nombre for p in db_user.rol_obj.permisos]

    token = create_access_token(db_user.email, rol_nombre, permisos)

    response.set_cookie(
        key='access_token',
        value=token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=30 * 60,
        path='/',
    )

    return {'access': token}


@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie(key='access_token', path='/')
    return {'message': 'Sesión cerrada'}


@router.post('/forgot-password')
async def forgot_password(
    session: SessionDep,
    datos: RecuperarPasswordRequest,
    background_tasks: BackgroundTasks,
):
    token = user_service.solicitar_reset_password(session=session, email=datos.email)
    if token:
        await send_mail_reset_password(
            email=EmailSchema(email=[datos.email]),
            token=token,
            background_tasks=background_tasks,
        )
    return {'message': 'Si el email está registrado, vas a recibir un enlace para restablecer la contraseña'}


@router.post('/reset-password')
async def reset_password(session: SessionDep, datos: RestablecerPasswordRequest):
    try:
        user_service.reset_password(session=session, token=datos.token, nueva_password=datos.nueva_password)
    except TokenResetInvalidoError:
        raise HTTPException(status_code=400, detail='El enlace no es válido o expiró')
    return {'message': 'Contraseña actualizada. Ya podés iniciar sesión'}

