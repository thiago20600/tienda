from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

import models.factura  # noqa: F401 registra la tabla factura en SQLModel.metadata
from config import settings
from database.engine import create_db_and_tables
from router.factura import router as facturaRouter
from utils.permisos import permisos


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # Sincroniza los permisos registrados por los routers con el servicio de usuarios
    await permisos.enviar_permisos()
    yield


app = FastAPI(lifespan=lifespan)

add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facturaRouter)


@app.get('/health')
async def health():
    return {'status': 'ok'}
