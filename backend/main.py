from contextlib import asynccontextmanager

from fastapi import FastAPI
from database.engine import create_db_and_tables
from router.producto import router as productoRouter
from router.categoria import router as categoriaRouter
from router.pedidos import router as pedidoRouter
from router.carrito import router as carritoRouter
from models.categorias import Categoria
from models.productos import Producto
from fastapi.middleware.cors import CORSMiddleware
from router.mercado_pago import router as mercadopagoRouter

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productoRouter)
app.include_router(pedidoRouter)
app.include_router(categoriaRouter)
app.include_router(carritoRouter)
app.include_router(mercadopagoRouter)