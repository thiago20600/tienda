def test_agregar_producto_descuenta_stock(client, seed, session):
    response = client.post(f"/mi-carrito/{seed['camiseta'].id}")
    assert response.status_code == 200
    body = response.json()
    assert body['items'][0]['cantidad'] == 1
    assert body['items'][0]['precio_unitario'] == 100.0
    session.refresh(seed['camiseta'])
    assert seed['camiseta'].stock == 9


def test_agregar_mismo_producto_acumula(client, seed):
    client.post(f"/mi-carrito/{seed['camiseta'].id}")
    body = client.post(f"/mi-carrito/{seed['camiseta'].id}").json()
    assert body['items'][0]['cantidad'] == 2


def test_precio_unitario_con_descuento(client, seed):
    body = client.post(f"/mi-carrito/{seed['pelota'].id}").json()
    assert body['items'][0]['precio_unitario'] == 40.0


def test_stock_insuficiente_400(client, seed, session):
    assert client.post(f"/mi-carrito/{seed['red'].id}").status_code == 200
    response = client.patch(f"/mi-carrito/item/{seed['red'].id}", json={'cantidad': 3})
    assert response.status_code == 400
    session.refresh(seed['red'])
    assert seed['red'].stock == 1


def test_eliminar_item_repone_stock(client, seed, session):
    client.post(f"/mi-carrito/{seed['camiseta'].id}")
    client.post(f"/mi-carrito/{seed['camiseta'].id}")
    response = client.delete(f"/mi-carrito/{seed['camiseta'].id}")
    assert response.status_code == 200
    session.refresh(seed['camiseta'])
    assert seed['camiseta'].stock == 10


def test_producto_inexistente_404(client):
    assert client.post('/mi-carrito/9999').status_code == 404


def test_cantidad_invalida_400(client, seed):
    assert client.patch(f"/mi-carrito/item/{seed['camiseta'].id}", json={'cantidad': 0}).status_code == 422
