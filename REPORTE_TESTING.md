# Reporte de testing — 2026-09-01

## Resumen
- **`backend` (api_tienda)**: arranca OK, `Application startup complete`. Sin cambios detectados, no probado a fondo funcionalmente, solo boot.
- **`usuarios` (api_usuarios)**: **NO ARRANCA**. Crashea en el import de módulos antes de levantar el servidor.

## Error que tira `usuarios` al arrancar

```
File "/code/models/users.py", line 5
    from usuarios.models.rol import Rol
ModuleNotFoundError: No module named 'usuarios'
```

Causa: dentro del contenedor el paquete raíz es `/code` (se importa como `models.rol`, `database.engine`, etc.), no existe un paquete llamado `usuarios`. Ese import está mal.

## Problemas encontrados (por archivo, leyendo el código, sin ejecutarlos todos porque el primer error corta el arranque)

### `usuarios/models/users.py`
- Línea 5: `from usuarios.models.rol import Rol` → debería ser `from models.rol import Rol`. **Esta es la causa del crash actual.**

### `usuarios/models/rol.py`
- Importa `from models.users import User` → esto, sumado al punto anterior, arma un **import circular**: `models.users` → `models.rol` → `models.users`. Aun arreglando el path de arriba, muy probablemente siga rompiendo por esto.
- `RolResponse` usa `PermisoResponse` y `RolPermisoLink` (en el método `from_rol` y en la relación `Rol.permisos`) pero **ninguno de los dos está importado** en este archivo. Van a tirar `NameError`.
- `RolResponse.from_rol(cls, rol: Rol)` usa el tipo `Rol` en la firma, pero la clase `Rol` está definida **más abajo en el mismo archivo** (después de `RolResponse`). Sin `from __future__ import annotations`, Python evalúa la anotación al definir la función → `NameError: name 'Rol' is not defined`.
- Imports duplicados de `SQLModel` y `Optional` (líneas 1-4). No rompe nada, pero está de más.

### `usuarios/models/permisos.py`
- `from models.users import Rol` → `Rol` ya no vive en `models.users`, vive en `models.rol`. Import roto.

### `usuarios/database/engine.py`
- Línea 8: `from models.users import Rol, Permiso, RolPermisoLink` → ninguno de los tres sigue estando en `models.users` (se movieron a `models.rol`, `models.permisos` y `models.links` respectivamente). Import roto.

### `usuarios/services/RolService.py`
- Mismo problema: `from models.users import Rol, Permiso, RolPermisoLink`. Import roto.

### `usuarios/router/roles.py`
- `from models.rol import RolCreate, RolUpdate, PermisosAsignacion, PermisoResponse, RolResponse` → `PermisosAsignacion` y `PermisoResponse` en realidad están definidos en `models.permisos`, no en `models.rol`. Import roto.

### `usuarios/router/login.py`
- `from models.users import User, Rol` → `Rol` ya no está ahí. Import roto.

### `usuarios/router/users.py`
- `from models.users import User, Rol, UserCreate, UserPublic, UserUpdate` → mismo problema con `Rol`.

### `usuarios/router/permisos.py` (archivo nuevo)
- `router = APIRouter(tags=['Permisos'], prefix='permisos')` → FastAPI exige que el prefix arranque con `/`. Con `prefix='permisos'` (sin barra) esto tira `AssertionError` en cuanto algo importe este router.
- **Este router no está incluido en `main.py`** (no hay `app.include_router(...)` para él), así que aunque se arregle todo lo anterior, el endpoint `POST /permisos/` no es alcanzable todavía.

### `usuarios/alembic/env.py`
- Sigue existiendo de la integración de Alembic que se revirtió hace unos días (ya no se usa, `engine.py` no llama a Alembic). No rompe nada porque no se ejecuta, pero es código muerto/confuso que quedó dando vueltas.

## Sobre `backend` (no rompe, pero queda incompleto)

### `backend/utils/permisos.py`
- La clase `Permisos.require_permission` valida así:
  ```python
  permisos_usuario = {p.nombre for p in current_user.rol_obj.permisos}
  ```
  Pero `get_current_user` (en `backend/utils/auth.py`) devuelve un **diccionario** armado a partir del JWT (`{"email":..., "rol":..., "permisos":[...]}`), no un objeto ORM con `.rol_obj`. Si en algún momento se usa `permisos.require_permission(...)` en algún router, esto va a tirar `AttributeError: 'dict' object has no attribute 'rol_obj'`.
  - **Hoy no rompe nada** porque ningún router de `backend` usa todavía `permisos.require_permission(...)` (grep no encontró usos).

- El mecanismo de sync sí está armado y enganchado en `main.py` (`lifespan` llama a `await permisos.enviar_permisos()`), pero como `PERMISOS_REGISTRADOS` se llena únicamente cuando se llama a `require_permission(...)` en alguna ruta, y eso todavía no pasa en ningún lado, el set queda vacío y `enviar_permisos()` no manda nada (corta temprano con `if not PERMISOS_REGISTRADOS: return`). No es un error, pero la sincronización automática que se charló no está conectada a ninguna ruta real todavía.

- `backend/.env` tiene `API_USUARIOS_URL=http://localhost:8001`. Dentro de la red de Docker Compose, un contenedor no puede llegar a otro contenedor usando `localhost` — eso apunta al propio contenedor de `backend`, no al de `usuarios`. Cuando se dispare `enviar_permisos()` de verdad (con el set no vacío), el POST a `usuarios` va a fallar (queda atajado por el `try/except` que solo imprime el error, así que no tira el arranque abajo, pero la sincronización nunca va a llegar a destino). Tendría que apuntar al nombre del servicio en `docker-compose.yml` (`api_usuarios`) y al puerto interno (80), no al puerto mapeado al host (8001).

## Confirmado por variables de entorno
- `usuarios/.env` tiene `TOKEN_SERVICIO_INTERNO_API` seteado ✔️
- `backend/.env` tiene `TOKEN_SERVICIO_INTERNO_API` y `API_USUARIOS_URL` seteados ✔️ (el valor de `API_USUARIOS_URL` es el problema mencionado arriba)

## No toqué nada de código
Este archivo es solo diagnóstico. Ningún archivo `.py` fue modificado durante este testing.
