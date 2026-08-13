from fastapi import FastAPI
from database.engine import create_db_and_tables
from contextlib import asynccontextmanager
from router.users import router as users
from router.login import router as login
from router.activate_acc import router as activate_account
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(users)
app.include_router(login)
app.include_router(activate_account)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)