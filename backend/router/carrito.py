from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from services.CarritoItemService import CarritoItemService
from services.ProductoService import ProductoService
from exceptions.carrito import CarritoNoEncontradoError, ItemNoEncontradoError, StockInsuficienteError
from services.CarritoService import CarritoService
from sqlmodel import select
from database.engine import SessionDep
from models.carrito import Carrito, CarritoItem, CarritoItemUpdate, CarritoPublic, ConfirmarCarrito, EstadoCarrito
from models.pedido import DetallePedido, MetodoPago, Pedido
from models.productos import Producto
from utils.auth import get_current_user
from utils.pedido import crear_pedido
from exceptions.producto import ProductoNoEncontradoError

router = APIRouter()


@router.get('/mi-carrito/', response_model=CarritoPublic)
async def get_mi_carrito(session: SessionDep, current_user = Depends(get_current_user)):

    service = CarritoService()
    try:
        user_carrito = service.consultar_carrito(session, current_user['email'])
    except CarritoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))

    
    return user_carrito


@router.post('/mi-carrito/{producto_id}', response_model=CarritoPublic)
async def agregar_unidad_producto(session: SessionDep, producto_id: int, current_user = Depends(get_current_user)):
    try:
        producto_service = ProductoService()
        carrito_item_service = CarritoItemService()
        carrito_service = CarritoService(producto_service, carrito_item_service) 
        carrito = carrito_service.agregar_producto(
            session=session,
            usuario_email=current_user['email'],
            producto_id=producto_id,
            cantidad=1
        )
        return CarritoPublic.model_validate(carrito)
    
    except ProductoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except StockInsuficienteError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.patch('/mi-carrito/{product_id}', response_model=CarritoPublic)
async def agregar_desde_detalle_producto(session: SessionDep, carrito_item_update: CarritoItemUpdate, product_id: int, current_user = Depends(get_current_user)
):
    carrito_item_service = CarritoItemService()
    producto_service = ProductoService()
    carrito_service = CarritoService(
        producto_service=producto_service,
        carrito_item_service=carrito_item_service
    )

    try:
        carrito = carrito_service.agregar_producto(session=session, 
                                                usuario_email=current_user['email'],
                                                producto_id=product_id, 
                                                cantidad=carrito_item_update.cantidad)

        return CarritoPublic.model_validate(carrito)
    except ProductoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except StockInsuficienteError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete('/mi-carrito/{producto_id}')
async def delete_item_carrito(session:SessionDep, producto_id:int, current_user=Depends(get_current_user)):


    producto_service = ProductoService()
    carrito_item_service = CarritoItemService(producto_service)
    carrito_service = CarritoService(producto_service, carrito_item_service)

    try:

        carrito = carrito_service.consultar_carrito(session, current_user['email'])
        item = carrito_item_service.consultar_item(session, carrito.id, producto_id)
        carrito_actualizado = carrito_item_service.eliminar_item(item, session)

        session.commit()
        session.refresh(carrito_actualizado)

        return CarritoPublic.model_validate(carrito_actualizado)

    except CarritoNoEncontradoError:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    except ItemNoEncontradoError:
        raise HTTPException(status_code=404, detail="Producto no encontrado en el carrito")
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/mi-carrito/item/{producto_id}', response_model=CarritoPublic)
async def actualizar_cantidad_carritoitem(session: SessionDep, producto_id: int, carrito_item_update: CarritoItemUpdate , current_user=Depends(get_current_user)):
    try:
        producto_service = ProductoService()
        carrito_item_service = CarritoItemService()
        servicio = CarritoService(producto_service, carrito_item_service)
        carrito = servicio.actualizar_cantidad(
            session=session,
            producto_id=producto_id,
            nueva_cantidad=carrito_item_update.cantidad,
            usuario_email=current_user['email']
        )
        return carrito
    except ItemNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except StockInsuficienteError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except CarritoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))




