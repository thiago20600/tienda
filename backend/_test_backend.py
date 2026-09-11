import io
from sqlmodel import Session, SQLModel, create_engine
import models.carrito  # noqa: F401 registra CarritoItem antes de configurar el mapper
import main  # noqa: F401 valida que la app importa con todos los cambios
from models.categorias import Categoria
from models.carrito import Carrito, CarritoItem, EstadoCarrito
from models.links import ProductosCategoriaLink
from models.pedido import MetodoPago
from models.productos import Producto
from services.CategoriaService import CategoriaService
from services.ProductoService import ProductoService
from fastapi_pagination import Params


engine = create_engine('sqlite:///:memory:')
SQLModel.metadata.create_all(
    engine,
    tables=[Categoria.__table__, Producto.__table__, ProductosCategoriaLink.__table__,
            Carrito.__table__, CarritoItem.__table__],
)

prod_svc = ProductoService()
cat_svc = CategoriaService()

with Session(engine) as s:
    c1 = Categoria(nombre='Ropa', estado=True, destacado=True)
    c2 = Categoria(nombre='Calzado', estado=True, destacado=False)
    s.add_all([c1, c2])
    s.commit()
    for c in (c1, c2):
        s.refresh(c)

    p_sku = Producto(nombre='Buzo azul', precio=5000, stock=8, sku=99901, user_email='a@a.com')
    p_otro = Producto(nombre='Zapatilla', precio=8000, stock=3, sku=99902, user_email='a@a.com')
    p_rel = Producto(nombre='Buzo rojo', precio=5200, stock=4, user_email='a@a.com')
    p_inactivo = Producto(nombre='Buzo negro', precio=5100, stock=2, user_email='a@a.com', producto_activo=False)
    s.add_all([p_sku, p_otro, p_rel, p_inactivo])
    s.commit()
    for p in (p_sku, p_otro, p_rel, p_inactivo):
        s.refresh(p)

    s.add_all([
        ProductosCategoriaLink(producto_id=p_sku.id, categoria_id=c1.id),
        ProductosCategoriaLink(producto_id=p_rel.id, categoria_id=c1.id),
        ProductosCategoriaLink(producto_id=p_inactivo.id, categoria_id=c1.id),
        ProductosCategoriaLink(producto_id=p_otro.id, categoria_id=c2.id),
    ])
    s.commit()

    # búsqueda por sku (item 27)
    page = prod_svc.listar_productos(s, q='99901', solo_activos=True, incluir_eliminados=False, params=Params(size=12))
    assert page.total == 1 and page.items[0].id == p_sku.id, page.total
    print('busqueda por sku OK')

    # relacionados (item 25): excluye el propio, inactivos y otras categorias
    rel = prod_svc.listar_relacionados(s, p_sku.id, limite=4)
    nombres = [p.nombre for p in rel]
    assert nombres == ['Buzo rojo'], nombres
    print('relacionados OK:', nombres)

    # import csv (item 28)
    csv_datos = (
        "nombre,precio,stock,sku,precio_descuento,descripcion,categorias\n"
        "Remera,l,..\n"
        "Pantalon,none,,nobody\n"
    )
    csv_ok = (
        "nombre,precio,stock,sku,precio_descuento,descripcion,categorias\n"
        "Remera,1500,10,555,1200,Algodon,Ropa\n"
        "Campera,3000,2,,,Abrigada,Ropa\n"
    )
    resultado = prod_svc.importar_productos_csv(s, io.BytesIO(csv_datos.encode('utf-8')), {'email': 'a@a.com'})
    assert len(resultado['errores']) == 2, resultado
    print('import csv con errores OK:', resultado['errores'])
    resultado2 = prod_svc.importar_productos_csv(s, io.BytesIO(csv_ok.encode('utf-8')), {'email': 'a@a.com'})
    assert resultado2['errores'] == [] and len(resultado2['creados']) == 2, resultado2
    print('import csv OK:', resultado2['creados'])

    # crear_pedido valida stock (item 3)
    from utils.pedido import crear_pedido
    from exceptions.producto import StockInsuficienteError

    carrito = Carrito(user_email='a@a.com', estado=EstadoCarrito.abierto)
    s.add(carrito)
    s.flush()
    s.add(CarritoItem(carrito_id=carrito.id, producto_id=p_otro.id, cantidad=99, precio_unitario=8000))
    s.commit()

    try:
        crear_pedido(s, carrito, MetodoPago.tarjeta, 'a@a.com')
        raise AssertionError('deberia haber fallado por stock')
    except StockInsuficienteError as e:
        print('stock insuficiente OK:', str(e)[:50])

print('ALL OK')