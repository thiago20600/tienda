def test_lista_publica_solo_activos(client, seed):
    data = client.get('/productos').json()
    nombres = [p['nombre'] for p in data['items']]
    assert 'Botines' not in nombres
    assert set(nombres) == {'Camiseta', 'Pelota', 'Red'}


def test_filtro_por_nombre(client, seed):
    data = client.get('/productos', params={'q': 'camiseta'}).json()
    assert [p['nombre'] for p in data['items']] == ['Camiseta']


def test_filtro_ofertas(client, seed):
    data = client.get('/productos', params={'ofertas': 'true'}).json()
    assert [p['nombre'] for p in data['items']] == ['Pelota']
    assert data['items'][0]['precio_descuento'] == 40.0


def test_filtro_por_categoria(client, seed):
    data = client.get('/productos', params={'categoria_id': seed['categoria'].id}).json()
    assert data['total'] == 3


def test_detalle_publico(client, seed):
    response = client.get(f"/productos/{seed['pelota'].id}")
    assert response.status_code == 200
    assert response.json()['nombre'] == 'Pelota'


def test_admin_ve_inactivos(client, seed, usuario_actual):
    usuario_actual['email'] = 'admin@test.com'
    usuario_actual['rol'] = 'admin'
    usuario_actual['permisos'] += ['productos:read:admin']
    data = client.get('/admin/productos').json()
    assert data['total'] == 4


def test_admin_sin_permiso_403(client, seed):
    assert client.get('/admin/productos').status_code == 403
