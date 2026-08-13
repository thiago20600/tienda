from datetime import datetime, timezone
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from models.categorias import Categoria
from sqlmodel import select
from database.engine import SessionDep
from models.productos import ProductCreate, ProductUpdate, Producto, ProductoPublic
from utils.auth import get_current_user, require_admin
from utils.upload_image import upload_image
router = APIRouter()


@router.get('/productos', response_model=list[ProductoPublic])
async def get_all_products(session: SessionDep, q: str |None = None):
    if q:

        productos = session.exec(
            select(Producto).where(
                Producto.nombre.ilike(f'%{q}%'),
                Producto.eliminado_at == None,
                Producto.producto_activo == True
            )
        ).all()

        return productos

    productos = session.exec(select(Producto).where(Producto.eliminado_at == None,
                                                    Producto.producto_activo == True)).all()

    return productos


@router.get('/productos/{product_id}', response_model=ProductoPublic)
async def get_product(session: SessionDep, product_id: int):
    product = session.get(Producto, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product


@router.post('/productos', response_model=ProductoPublic)
async def post_product(session: SessionDep, product: ProductCreate, current_user = Depends(require_admin)):
    
    categorias_db = session.exec(select(Categoria).where(Categoria.id.in_(product.categoria))).all()
    
    db_product = Producto.model_validate(product, update={'user_email': current_user['email'],
                                                          'categoria': categorias_db})

    

    #db_product.user_email = current_user['email']
    session.add(db_product)
    session.commit()
    session.refresh(db_product)

    return db_product


@router.patch('/productos/{product_id}', response_model=ProductoPublic, dependencies=[Depends(require_admin)])
async def patch_product(session: SessionDep, product_id: int, product: ProductUpdate):
    product_db = session.get(Producto, product_id)
    
    if not product_db:
        raise HTTPException(status_code=404, detail='Producto no encontrado')
    
    
    product_data = product.model_dump(exclude_unset=True)

    if 'categoria' in product_data:

        categorias_db = session.exec(
            select(Categoria).where(
                Categoria.id.in_(product_data['categoria'])
            )
        ).all()

        product_db.categoria = categorias_db

        del product_data['categoria']

    for key, value in product_data.items():
        setattr(product_db, key, value)
    
    product_db.updated_at = datetime.now(timezone.utc)

    session.add(product_db)
    session.commit()
    session.refresh(product_db)
   
    return product_db


@router.delete('/productos/{product_id}', dependencies=[Depends(require_admin)])
async def delete_product(session: SessionDep, product_id: int):

    product_db = session.get(Producto, product_id)

    if not product_db:
        raise HTTPException(status_code=404, detail= 'Producto no encontrado')
    
    try:
        session.delete(product_db)
        session.commit()
    except:
        session.rollback()
        product_db.eliminado_at = datetime.now(timezone.utc)
        product_db.producto_activo = False
        session.commit()


    return {'message': 'Producto eliminado'}


@router.post('/productos/{product_id}/imagenes', dependencies=[Depends(require_admin)], response_model=ProductoPublic)
async def agregar_imagen_producto(session: SessionDep, product_id: int, archivos: list[UploadFile] = File(...)):


    product_db = session.get(Producto, product_id)

    if not product_db:
        raise HTTPException(status_code=404, detail= 'Producto no encontrado')
    

    if len(archivos) > 5:
        raise HTTPException(status_code=400, detail='No se pueden cargar mas de 5 imagenes')
    
    imagenes_actuales_url = product_db.imagen_url or [] 

    print(imagenes_actuales_url)

    if len(imagenes_actuales_url) + len(archivos) > 5:
        raise HTTPException(
            status_code=400, 
            detail=f'El producto ya tiene {len(imagenes_actuales_url)} imágenes. No puedes superar un total de 5.'
        )
    
    imagen_nuevas_url = []

    print(imagen_nuevas_url)

    for archivo in archivos:
        try:
            file = archivo.file
            upload_result = upload_image(file)
            imagen_nuevas_url.append(upload_result['secure_url'])

        except Exception as e:
            raise HTTPException(status_code=400, detail=f'no se pudo cargar la imagen, error: {e}')
        
    product_db.imagen_url = imagenes_actuales_url + imagen_nuevas_url

    print(product_db)

    session.add(product_db)
    session.commit()
    session.refresh(product_db)
    return product_db



@router.get('/admin/productos', response_model=list[ProductoPublic], dependencies=[Depends(require_admin)])
async def get_all_products(session: SessionDep, q: str | None = None):
    if q:

        productos = session.exec(
            select(Producto).where(
                Producto.nombre.ilike(f'%{q}%'),
                Producto.eliminado_at == None,
            )
        ).all()

        return productos

    productos = session.exec(select(Producto).where(Producto.eliminado_at == None)).all()

    return productos