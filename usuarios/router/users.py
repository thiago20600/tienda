from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from database.engine import SessionDep
from sqlmodel import Session, select
from models.users import User, UserCreate, UserPublic, UserUpdate
from bcrypt import hashpw, gensalt
from auth.auth import get_current_user
from utils.mail import send_mail_innactive_account
from models.mail import EmailSchema

router = APIRouter()


@router.get('/users', response_model=list[UserPublic], dependencies=[Depends(get_current_user)])
async def get_users(session: SessionDep):
    users = session.exec(select(User)).all()
    return users


@router.post('/users', response_model=UserPublic)
async def post_user(session: SessionDep, user: UserCreate, background_tasks: BackgroundTasks):
    db_user = User.model_validate(user)
    hash_pw = hashpw(db_user.password.encode('utf-8'), gensalt()).decode('utf-8')
    db_user.password = hash_pw
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    await send_mail_innactive_account(email=EmailSchema(email=[db_user.email]), background_tasks=background_tasks)
    return db_user


@router.patch('/users/{user_id}', response_model=UserPublic)
async def user_update(session: SessionDep, user_id: int, user: UserUpdate, current_user = Depends(get_current_user)):
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
async def user_delete(session: SessionDep, user_id: int, current_user = Depends(get_current_user)):
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')

    if db_user.email != current_user["email"]:
        raise HTTPException(status_code=403, detail='No autorizado')

    session.delete(db_user)
    session.commit()
    return db_user


@router.get('/users/me', response_model=UserPublic)
async def get_me_user(session:SessionDep, current_user = Depends(get_current_user)):
    
    user = session.exec(select(User).where(User.email == current_user["email"])).first()

    return user