# Mapeo de endpoints → permisos (recurso:accion:alcance)

Generado tras decorar todos los endpoints protegidos con `require_permission(...)` /
`permisos.require_permission(...)`. Los endpoints públicos (sin autenticación) no
tienen entrada de permiso.

## backend (servicio api_tienda)

### router/producto.py
```python
@router.get('/productos', response_model=Page[ProductoPublic])
# publico, sin permiso

@router.get('/productos/{producto_id}', response_model=ProductoPublic)
# publico, sin permiso

@router.post('/productos', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:create:admin"))])

@router.patch('/productos/{producto_id}', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:update:admin"))])

@router.delete('/productos/{producto_id}', dependencies=[Depends(permisos.require_permission("productos:delete:admin"))])

@router.post('/productos/{producto_id}/imagenes', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:update:admin"))])

@router.get('/admin/productos', response_model=Page[ProductoPublic], dependencies=[Depends(permisos.require_permission("productos:read:admin"))])
```

### router/categoria.py
```python
@router.get('/categorias/', response_model=list[CategoriaPublic])
# publico, sin permiso

@router.get('/categorias/{categoria_id}', response_model=CategoriaPublic)
# publico, sin permiso

@router.delete('/categorias/{categoria_id}', dependencies=[Depends(permisos.require_permission("categorias:delete:admin"))])

@router.post('/categorias/', response_model=CategoriaPublic, dependencies=[Depends(permisos.require_permission("categorias:create:admin"))])

@router.patch('/categorias/{categoria_id}', response_model=CategoriaPublic, dependencies=[Depends(permisos.require_permission("categorias:update:admin"))])
```

### router/carrito.py
```python
@router.get('/mi-carrito/', response_model=CarritoPublic)
async def get_mi_carrito(session: SessionDep, current_user = Depends(permisos.require_permission("carrito:read:own"))):

@router.post('/mi-carrito/{producto_id}', response_model=CarritoPublic)
async def agregar_unidad_producto(session: SessionDep, producto_id: int, current_user = Depends(permisos.require_permission("carrito:create:own"))):

@router.patch('/mi-carrito/{product_id}', response_model=CarritoPublic)
async def agregar_desde_detalle_producto(session: SessionDep, carrito_item_update: CarritoItemUpdate, product_id: int, current_user = Depends(permisos.require_permission("carrito:update:own"))):

@router.delete('/mi-carrito/{producto_id}')
async def delete_item_carrito(session:SessionDep, producto_id:int, current_user=Depends(permisos.require_permission("carrito:delete:own"))):

@router.patch('/mi-carrito/item/{producto_id}', response_model=CarritoPublic)
async def actualizar_cantidad_carritoitem(session: SessionDep, producto_id: int, carrito_item_update: CarritoItemUpdate, current_user=Depends(permisos.require_permission("carrito:update:own"))):
```

### router/pedidos.py
```python
@router.get('/pedidos/', response_model=Page[PedidoPublic], dependencies=[Depends(permisos.require_permission("pedidos:read:admin"))])

@router.get('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(permisos.require_permission("pedidos:read:admin"))])

@router.patch('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(permisos.require_permission("pedidos:update:admin"))])
```

### router/mercado_pago.py
```python
@router.get('/metodos-pago')
# publico, sin permiso

@router.post('/crear-orden', response_model=PedidoPublic)
async def procesar_pago(session: SessionDep, checkout_data: CheckoutSchema, current_user=Depends(permisos.require_permission("pedidos:create:own"))):
```

## usuarios (servicio api_usuarios)

### router/users.py
```python
@router.get('/users', response_model=Page[UserPublic], dependencies=[Depends(require_permission("usuarios:read:admin"))])
# acepta ademas filtros por query: q (username), rol, tipo

@router.post('/users', response_model=UserPublic)
# publico, sin permiso (registro)

@router.patch('/users/{user_id}', response_model=UserPublic)
async def user_update(session: SessionDep, user_id: int, user: UserUpdate, current_user = Depends(require_permission("usuarios:update:own"))):

@router.delete('/users/{user_id}', response_model=UserPublic)
async def user_delete(session: SessionDep, user_id: int, current_user = Depends(require_permission("usuarios:delete:own"))):

@router.get('/users/me', response_model=UserPublic)
async def get_me_user(session:SessionDep, current_user = Depends(require_permission("usuarios:read:own"))):

@router.patch('/users/{user_id}/roles/{rol_id}', response_model=UserPublic)
async def modificar_rol_usuario(session:SessionDep, user_id: int, rol_id: int, _=Depends(require_permission('usuarios:update:admin'))):

@router.post('/admin/empleados', response_model=EmpleadoPublic)
async def post_empleado(session: SessionDep, empleado: EmpleadoCreate, _=Depends(require_permission("usuarios:create:admin")))
```

### router/login.py
```python
@router.post('/login')
# publico, sin permiso
```

### router/activate_acc.py
```python
@router.get('/activate_account/{token}')
# publico, sin permiso
```

### router/roles.py
```python
@router.get("/roles", response_model=list[RolResponse])
async def get_roles(session: SessionDep, _=Depends(require_permission("roles:read:admin"))):

@router.get("/permisos", response_model=list[PermisoResponse])
async def get_permisos(session: SessionDep, _=Depends(require_permission("permisos:read:admin"))):

@router.post("/roles", response_model=RolResponse)
async def create_rol(rol_data: RolCreate, session: SessionDep, _=Depends(require_permission("roles:create:admin"))):

@router.put("/roles/{rol_id}", response_model=RolResponse)
async def update_rol(rol_id: int, rol_data: RolUpdate, session: SessionDep, _=Depends(require_permission("roles:update:admin"))):

@router.put("/roles/{rol_id}/permisos", response_model=RolResponse)
async def asignar_permisos(rol_id: int, asignacion: PermisosAsignacion, session: SessionDep, _=Depends(require_permission("roles:update:admin"))):

@router.delete("/roles/{rol_id}")
async def delete_rol(rol_id: int, session: SessionDep, _=Depends(require_permission("roles:delete:admin"))):
```

### router/permisos.py
```python
@router.post(path='/', dependencies=[Depends(servicio_interno)])
# no es de usuario, es service-to-service (sync automatico desde backend). No usa recurso:accion:alcance.
```

## Notas
- `require_admin` (usuarios/auth/auth.py y backend/utils/auth.py) quedo sin uso en ningun endpoint. No se borro el codigo, solo se dejo de invocar.
- La tabla `permiso` se llena de forma dinamica: cada `require_permission(...)`/`permisos.require_permission(...)` se auto-registra en memoria (`PERMISOS_REGISTRADOS`) al importarse las rutas, y `usuarios` la vuelca a su propia tabla al arrancar; `backend` la sincroniza via POST `/permisos/` al arrancar (`utils/permisos.py::enviar_permisos`).
- Bootstrap inicial: el rol `admin` no tiene permisos asignados por defecto (no hay hardcodeo). Correr `usuarios/scripts/bootstrap_admin.py` una vez para asignarle todos los permisos existentes.
- El rol `cliente` no tiene ningun permiso asignado todavia — asignarlos manualmente via `PUT /admin/roles/{id}/permisos` con un admin ya bootstrapeado.
