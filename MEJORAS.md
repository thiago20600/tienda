# MEJORAS — Seguimiento

Documento de seguimiento de mejoras y arreglos del proyecto. Leyenda: ✅ hecho · 🟡 parcial / documentado · ⏳ pendiente.

## Críticos

| # | Ítem | Estado | Archivos |
|---|------|--------|----------|
| 1 | `/productos?estado=false` expone inactivos al público | ✅ | `backend/router/producto.py` |
| 2 | MP usa email de test en vez del del usuario | ✅ | `backend/router/mercado_pago.py` |
| 3 | Checkout sin validación de stock / locks | ✅ | `backend/utils/pedido.py`, `backend/router/mercado_pago.py` |
| 4 | Sin webhook de confirmación de MP | ✅ | `backend/router/mercado_pago.py` (`/mp/webhook`) |
| 5 | `AbortController` no estándar en hooks | ✅ | `front/src/hooks/productos/*`, `front/src/utils/abortController.js` |
| 6 | Ruta `/admin/productos/importar` rota | ✅ | `front/src/pages/admin/productos/importar/*` |
| 7 | JWT en localStorage | 🟡 | `front/src/services/auth/*`, servicio `usuarios` |

## Deuda técnica / arquitectura

| # | Ítem | Estado | Archivos |
|---|------|--------|----------|
| 8 | Alembic roto (env.py usa `DATABASE_URL` pero config usa `DB_URL`) | ✅ | `backend/alembic/env.py`, `backend/alembic.ini` |
| 9 | Entrypoint de migraciones / baseline de schema | ✅ | `backend/dockerfile` (`alembic upgrade head`) |
| 10 | Print/console de debug | ✅ | `backend/router/mercado_pago.py`, `backend/utils/upload_image.py`, `backend/utils/permisos.py`, `front/src/pages/checkout/checkout.jsx` |
| 11 | Sentry sin configurar | ✅ | removido de `backend/requirements.txt` |
| 12 | Dependencias sin uso | ✅ | `backend/requirements.txt` |
| 13 | CORS hardcodeado | ✅ | `backend/main.py` (`settings.CORS_ORIGINS`) |
| 14 | `get_session` commitea automáticamente | ✅ | `backend/database/engine.py` |
| 15 | Lint `set-state-in-effect` (useProductos, home) | 🟡 | `front/src/hooks/productos/useProductos.jsx`, `front/src/pages/home/home.jsx` |
| 16 | Formularios duplicados (producto) | ✅ | `front/src/componentes/adminpanel/productos/*` — consolidados en `ProductoForm.styles.jsx` |
| 17 | Manejo de errores de imagen (KeyError `secure_url`) | ✅ | `backend/services/ImagenService.py`, `backend/utils/upload_image.py` |
| 18 | `MetodoPago.efectivo` sin uso | ✅ | `backend/router/mercado_pago.py` (`/crear-orden-efectivo`) |

## Features tienda

| # | Ítem | Estado | Archivos |
|---|------|--------|----------|
| 19 | "Mis pedidos" para cliente | ✅ | `backend/router/pedidos.py`, `front/src/pages/misPedidos/MisPedidos.jsx` |
| 20 | Aplicar config (logo, nombre, colores) en front público | ✅ | `front/src/componentes/Navbar/Navbar.jsx` (logo + `nombre_tienda`) |
| 21 | Ordenar resultados en tienda | ✅ | `front/src/componentes/SelectorOrden/*`, `front/src/pages/home/home.jsx`, `useProductos.jsx` (`ordenar_por` vía querystring) |
| 22 | Estados de checkout claros | ✅ | `front/src/pages/checkout/checkout.jsx` |
| 23 | Recuperar contraseña | ✅ | servicio `usuarios` + `front/src/pages/auth/recuperar`, `restablecer` |
| 24 | Alertas de stock bajo | ✅ | `backend/services/MetricasService.py`, `front/src/pages/admin/inicio/admin.jsx` (sección stock bajo) |
| 25 | Productos relacionados | ✅ | `backend/router/producto.py`, `front/src/componentes/ProductosRelacionados/*` |
| 26 | Wishlist / favoritos | ✅ | `backend/router/favorito.py`, `front/src/services/favoritos/FavoritosContext`, `front/src/pages/favoritos/Favoritos.jsx` |
| 27 | Búsqueda por SKU | ✅ | `backend/services/ProductoService.py` |

## Admin / operaciones

| # | Ítem | Estado | Archivos |
|---|------|--------|----------|
| 28 | Importar productos CSV | ✅ | `backend/services/ProductoService.py`, `front/src/pages/admin/productos/importar/ImportarProductos.jsx` |
| 29 | Métricas en dashboard | ✅ | `backend/services/MetricasService.py`, `backend/router/metricas.py`, `front/src/hooks/metricas/useMetricas.jsx`, `front/src/pages/admin/inicio/admin.jsx` |
| 30 | Stock rápido desde admin | ✅ | `front/src/componentes/adminpanel/productos/productosTabla/*`, `front/src/hooks/productos/useActualizarStockProducto.jsx` |
| 31 | Auditoría de pedidos (updated_by) | ✅ | `backend/models/pedido.py`, `backend/alembic/versions/004_*` |
| 32 | Filtros precio/stock/sku en admin | ✅ | `front/src/componentes/adminpanel/productos/FiltrosProductosAdmin.jsx`, `useProductosAdmin.jsx` |
| 33 | Orden de banners | ✅ | `backend/models/banner.py` (`orden`), `backend/alembic/versions/004_*` |
| 34 | Sidebar/permisos por rol | ✅ | `front/src/componentes/adminpanel/sidebar/SideBar.jsx` |

## QA / infra

| # | Ítem | Estado | Archivos |
|---|------|--------|----------|
| 35 | Tests de backend | ✅ | `backend/tests/` (productos, carrito, favoritos, pedidos) |
| 36 | CI (GitHub Actions) | ✅ | `.github/workflows/ci.yml` |
| 37 | Revisión de `.gitignore` / secretos | ✅ | `.gitignore` nuevo (`.env` ignorado; solo `front/.env` quedaba trackeado) |
| 38 | Versionado de esquema | ✅ | alembic arreglado + migraciones 001–005 |
| 39 | Dashboard admin: imágenes + top productos | ✅ | `backend/models/metricas.py` (`imagen_url` en `StockBajoItem`/`ProductoTop`), `backend/services/MetricasService.py` (popula `imagen_url`), `front/src/pages/admin/inicio/admin.jsx` (layout lista + fallback de imagen + sección Top productos), `front/src/pages/admin/inicio/admin.styles.jsx` (`DashboardList`/`DashboardListItem`/`DashboardImg`/`DashboardImgPlaceholder`) |
| 40 | Unificar containers home + ProductList | ✅ | `front/src/hooks/productos/useProductos.jsx` (param `destacados` unifica `/productos/destacados`), `front/src/pages/home/home.jsx` (un solo hook + un solo `ProductsList` para `ver=ofertas`/`ver=destacados`/`categoria_id`), `front/src/componentes/ProductsList/ProductsListStyles.jsx` (max-width + gap reducido), `front/src/componentes/ProductCard/ProductCardStyles.jsx` (hover + `width:100%`, elimina margin duplicado — favorito ya en card) |

---

## Notas de implementación

- **Favoritos (26):** tabla `favorito` con unique `(user_email, producto_id)`, migración 005. Endpoints `GET/POST/DELETE /favoritos[/{producto_id}]` con permisos `favoritos:*:own`. Front: `FavoritosProvider` en `BaseLayout` + página `/favoritos` + link en Navbar.
- **Efectivo (18):** `POST /crear-orden-efectivo` crea pedido `pendiente` a partir del carrito abierto, reutiliza `crear_pedido` (valida stock con lock) y confirma el carrito.
- **Stock rápido (30):** input numérico en la tabla de productos admin; guarda en blur/Enter vía `PATCH /productos/{id}` con `{stock}`.
- **Config pública (20):** Navbar consume `GET /configuracion` (público) y muestra `logo_url` + `nombre_tienda`.
- **CI (36):** workflow con dos jobs: backend (compileall + pytest con sqlite) y frontend (eslint + build). Vite build ~3s, backend tests pasan con `DB_URL=sqlite:///:memory:`.
- **Pendientes menores:** 7 (JWT en cookie httpOnly), 15 (refactor setState en effect).

### Fix banner.orden 500 (ítem 33)

La DB en producción tenía la tabla `banner` sin la columna `orden` (creada vía `create_all` antes de agregar el campo al modelo; sin tabla `alembic_version`). El modelo nuevo lee `banner.orden` y la query falla con `UndefinedColumn → 500`.

**Solución en dos capas:**
1. **Migración 004 idempotente:** usa `inspector.get_columns('banner')` para verificar si `orden` existe antes de `ADD COLUMN`.
2. **`ensure_schema()` en el lifespan (`backend/main.py`):** al iniciar, intenta `upgrade head`. Si no hay `alembic_version` (DB legacy), hace `stamp` a `003` y luego reaplica el upgrade. Así 004 y 005 aplican sobre DBs preexistentes.

Validado con test sqlite que simula el escenario legacy: después de `ensure_schema()`, la columna existe y `/banners` responde 200.