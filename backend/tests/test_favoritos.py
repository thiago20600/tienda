def test_requiere_sesion(client_sin_auth, seed):
    assert client_sin_auth.get('/favoritos').status_code == 401


def test_agregar_y_listar(client, seed):
    assert client.post(f"/favoritos/{seed['camiseta'].id}").status_code == 201
    assert client.post(f"/favoritos/{seed['pelota'].id}").status_code == 201
    favoritos = client.get('/favoritos').json()
    assert {f['producto']['nombre'] for f in favoritos} == {'Camiseta', 'Pelota'}


def test_duplicado_409(client, seed):
    client.post(f"/favoritos/{seed['camiseta'].id}")
    assert client.post(f"/favoritos/{seed['camiseta'].id}").status_code == 409


def test_producto_inactivo_404(client, seed):
    assert client.post(f"/favoritos/{seed['botines'].id}").status_code == 404


def test_producto_inexistente_404(client):
    assert client.post('/favoritos/9999').status_code == 404


def test_eliminar(client, seed):
    client.post(f"/favoritos/{seed['camiseta'].id}")
    assert client.delete(f"/favoritos/{seed['camiseta'].id}").status_code == 200
    assert client.get('/favoritos').json() == []
    assert client.delete(f"/favoritos/{seed['camiseta'].id}").status_code == 404
