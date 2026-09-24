"""Permisos y alcance de los endpoints de facturacion (recurso:accion:alcance)."""
EMAIL_CLIENTE = 'cliente@test.com'
EMAIL_ADMIN = 'admin@test.com'


def test_sin_token_da_401(client_sin_auth):
    assert client_sin_auth.get('/facturas/').status_code == 401
    assert client_sin_auth.get('/facturas/1').status_code == 401
    assert client_sin_auth.get('/mis-facturas').status_code == 401


def test_post_factura_sin_header_interno_da_403(client_sin_auth, payload_pedido):
    assert client_sin_auth.post('/facturas/', json=payload_pedido()).status_code == 403


def test_cliente_sin_permiso_admin_da_403(client, factura_pendiente):
    assert client.get('/facturas/').status_code == 403
    assert client.get(f'/facturas/{factura_pendiente.id}').status_code == 403
    assert client.get('/facturas/pedido/99').status_code == 403


def test_cliente_no_puede_reintentar(client, factura_pendiente):
    assert client.post(f'/facturas/{factura_pendiente.id}/reintentar').status_code == 403


def test_admin_lista_y_filtra_facturas(client_admin, factura_pendiente):
    listado = client_admin.get('/facturas/')

    assert listado.status_code == 200
    assert listado.json()['total'] == 1

    pendientes = client_admin.get('/facturas/', params={'estado': 'pendiente'})
    aprobadas = client_admin.get('/facturas/', params={'estado': 'aprobada'})

    assert pendientes.json()['total'] == 1
    assert aprobadas.json()['total'] == 0


def test_admin_busca_la_factura_del_pedido(client_admin, factura_pendiente):
    respuesta = client_admin.get('/facturas/pedido/99')

    assert respuesta.status_code == 200
    assert respuesta.json()['pedido_id'] == 99


def test_factura_inexistente_da_404(client_admin):
    assert client_admin.get('/facturas/12345').status_code == 404
    assert client_admin.get('/facturas/pedido/12345').status_code == 404


def test_mis_facturas_solo_devuelve_las_propias(client, crear_factura):
    crear_factura(pedido_id=31, user_email=EMAIL_CLIENTE)
    crear_factura(pedido_id=32, user_email='otro@test.com')

    respuesta = client.get('/mis-facturas')

    assert respuesta.status_code == 200
    items = respuesta.json()['items']
    assert len(items) == 1
    assert items[0]['user_email'] == EMAIL_CLIENTE
    assert items[0]['pedido_id'] == 31


def test_mis_facturas_no_expone_facturas_de_otros(client, crear_factura):
    crear_factura(pedido_id=33, user_email='otro@test.com')

    respuesta = client.get('/mis-facturas')

    assert respuesta.status_code == 200
    assert respuesta.json()['total'] == 0
