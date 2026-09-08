from fastapi import FastAPI
from database.engine import create_db_and_tables
from contextlib import asynccontextmanager
from router.users import router as users
from router.login import router as login
from router.activate_acc import router as activate_account
from router.roles import router as roles
from router.permisos import router as permisos
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.include_router(users)
app.include_router(login)
app.include_router(activate_account)
app.include_router(roles)
app.include_router(permisos)

add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)