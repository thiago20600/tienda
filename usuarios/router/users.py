from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from database.engine import SessionDep
from sqlmodel import Session, select
from models.users import User, UserCreate, UserPublic, UserUpdate
from models.rol import Rol
from bcrypt import hashpw, gensalt
from auth.auth import require_permission
from utils.mail import send_mail_innactive_account
from models.mail import EmailSchema
from fastapi_pagination import Page, Params
from services.UserService import UserService

router = APIRouter()
user_service = UserService()


@router.get('/users', response_model=Page[UserPublic], dependencies=[Depends(require_permission("usuarios:read:admin"))])
async def get_users(session: SessionDep, q: str | None = None, params: Params = Depends()):
    return user_service.listar_usuarios(session=session, q=q, params=params)


@router.post('/users', response_model=UserPublic)
async def post_user(session: SessionDep, user: UserCreate, background_tasks: BackgroundTasks):
    rol_cliente = session.exec(select(Rol).where(Rol.nombre == 'cliente')).first()

    if not rol_cliente:
        raise HTTPException(status_code=500, detail='Rol cliente no encontrado en la base de datos')

    db_user = User.model_validate(user)
    hash_pw = hashpw(db_user.password.encode('utf-8'), gensalt()).decode('utf-8')
    db_user.password = hash_pw
    db_user.rol = 'cliente'
    db_user.rol_id = rol_cliente.id

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    await send_mail_innactive_account(email=EmailSchema(email=[db_user.email]), background_tasks=background_tasks)
    return db_user


@router.patch('/users/{user_id}', response_model=UserPublic)
async def user_update(session: SessionDep, user_id: int, user: UserUpdate, current_user = Depends(require_permission("usuarios:update:own"))):
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    
    if db_user.email != current_user["email"]:
        raise HTTPException(status_code=403, detail='No autorizado')

    user_data = user.model_dump(exclude_unset=True)

    if "password" in user_data:
        user_data["password"] = hashpw(user_data["password"].encode('utf-8'), gensalt()).decode('utf-8')

    for key, value in user_data.items():
        setattr(db_user, key, value)
    

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.delete('/users/{user_id}', response_model=UserPublic)
async def user_delete(session: SessionDep, user_id: int, current_user = Depends(require_permission("usuarios:delete:own"))):
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')

    if db_user.email != current_user["email"]:
        raise HTTPException(status_code=403, detail='No autorizado')

    session.delete(db_user)
    session.commit()
    return db_user


@router.get('/users/me', response_model=UserPublic)
async def get_me_user(session:SessionDep, current_user = Depends(require_permission("usuarios:read:own"))):
    
    user = session.exec(select(User).where(User.email == current_user["email"])).first()

    return user