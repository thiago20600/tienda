def _cargar_carrito(client, seed):
    client.post(f"/mi-carrito/{seed['camiseta'].id}")
    client.post(f"/mi-carrito/{seed['camiseta'].id}")
    client.post(f"/mi-carrito/{seed['pelota'].id}")


def test_crear_orden_efectivo(client, seed):
    _cargar_carrito(client, seed)
    response = client.post('/crear-orden-efectivo')
    assert response.status_code == 200
    pedido = response.json()
    assert pedido['estado'] == 'pendiente'
    assert pedido['metodo_pago'] == 'efectivo'
    assert pedido['precio_total'] == 240.0
    assert pedido['numero_pedido'].startswith('PED-')
    assert len(pedido['detalles']) == 2


def test_carrito_inexistente_404(client, seed):
    assert client.post('/crear-orden-efectivo').status_code == 404


def test_orden_confirmada_no_repite(client, seed):
    _cargar_carrito(client, seed)
    assert client.post('/crear-orden-efectivo').status_code == 200
    assert client.post('/crear-orden-efectivo').status_code == 404


def test_stock_no_doble_descuento(client, seed, session):
    _cargar_carrito(client, seed)
    client.post('/crear-orden-efectivo')
    session.refresh(seed['camiseta'])
    session.refresh(seed['pelota'])
    assert seed['camiseta'].stock == 8
    assert seed['pelota'].stock == 4


def test_admin_marca_pagado(client, seed, usuario_actual):
    _cargar_carrito(client, seed)
    pedido = client.post('/crear-orden-efectivo').json()
    usuario_actual['email'] = 'admin@test.com'
    usuario_actual['rol'] = 'admin'
    usuario_actual['permisos'] += ['pedidos:update:admin']
    response = client.patch(f"/pedidos/{pedido['id']}", json={'estado': 'pagado'})
    assert response.status_code == 200
    assert response.json()['estado'] == 'pagado'


def test_mis_pedidos_solo_propios(client, seed, usuario_actual):
    _cargar_carrito(client, seed)
    client.post('/crear-orden-efectivo')
    assert client.get('/mis-pedidos').json()['total'] == 1

    usuario_actual['email'] = 'otro@test.com'
    assert client.get('/mis-pedidos').json()['total'] == 0


def test_pedido_valida_activo_y_stock(client, seed, session):
    from sqlmodel import select

    from models.productos import Producto

    client.post(f"/mi-carrito/{seed['red'].id}")
    producto = session.exec(select(Producto).where(Producto.nombre == 'Red')).first()
    producto.producto_activo = False
    session.commit()

    response = client.post('/crear-orden-efectivo')
    assert response.status_code == 404
