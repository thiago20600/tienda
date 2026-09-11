from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

from config import settings
from utils.permisos import permisos

from router.producto import router as productoRouter
from router.categoria import router as categoriaRouter
from router.pedidos import router as pedidoRouter
from router.carrito import router as carritoRouter
from router.mercado_pago import router as mercadopagoRouter
from router.banner import router as bannerRouter
from router.configuracion import router as configuracionRouter
from router.favorito import router as favoritoRouter
from router.metricas import router as metricasRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    await permisos.enviar_permisos()
    yield


app = FastAPI(lifespan=lifespan)

add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productoRouter)
app.include_router(categoriaRouter)
app.include_router(pedidoRouter)
app.include_router(carritoRouter)
app.include_router(mercadopagoRouter)
app.include_router(bannerRouter)
app.include_router(configuracionRouter)
app.include_router(favoritoRouter)
app.include_router(metricasRouter)