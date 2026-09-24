# api_facturacion — Microservicio de Facturación (ARCA/AFIP)

Servicio **100% autónomo** que emite comprobantes electrónicos con CAE ante ARCA
(ex AFIP). No consulta a la API de la tienda: recibe un evento "pedido pagado"
con el snapshot contable y asume la responsabilidad de facturar. Un fallo de
facturación (o de ARCA) **nunca** afecta a la tienda.

## Tecnologías

- Python 3.11 + FastAPI + Uvicorn
- SQLModel / SQLAlchemy + PostgreSQL
- Alembic (migraciones) + pydantic-settings (configuración)
- [afip.py](https://github.com/afipsdk/afip.py) — Web Services de ARCA (WSFE)
- pytest + fastapi.testclient (tests con sqlite en memoria y ARCA mockeado)

## Cómo correrlo

```bash
cp .env.example .env   # completar credenciales
docker compose up api_facturacion
```

Queda en `http://localhost:8002` (docs en `/docs`). Las migraciones corren solas
al arrancar (`alembic upgrade head`).

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_URL` | `postgresql+psycopg://usuario:password@db_facturacion:5432/base` |
| `POSTGRES_USER` / `POSTGRES_DB` / `POSTGRES_PASSWORD` | Credenciales de la DB (las usa `db_facturacion`) |
| `SECRET_KEY_JWT` / `ALGORITHM` | **Las mismas** que `backend` y `usuarios` (validación JWT local) |
| `API_USUARIOS_URL` | URL del servicio de usuarios (sync de permisos en el lifespan) |
| `TOKEN_SERVICIO_INTERNO_API` | Token service-to-service (mismo valor en todos los servicios) |
| `AFIP_CUIT` | CUIT del emisor |
| `AFIP_CERT_PATH` / `AFIP_KEY_PATH` | Certificado y clave privada de homologación/producción |
| `AFIP_PUNTO_VENTA` | Punto de venta habilitado para WSFE |
| `AFIP_AMBIENTE` | `homologacion` o `produccion` |
| `AFIP_TIPO_COMPROBANTE_DEFAULT` | 1 = Factura A, 6 = Factura B, 11 = Factura C |
| `AFIP_DOC_TIPO_DEFAULT` / `AFIP_RAZON_SOCIAL_DEFAULT` | Receptor por defecto (99 = Consumidor Final) |
| `AFIP_ALICUOTA_IVA` | Alícuota usada para discriminar el IVA del total (21.00) |
| `FACTURACION_MAX_INTENTOS` | Reintentos máximos ante errores transitorios de ARCA |
| `FACTURACION_BACKOFF_BASE_SEGUNDOS` | Base del backoff exponencial (acotado a 1 hora) |
| `CORS_ORIGINS` | Origen del front |

## ARCA (ex AFIP)

- **Homologación**: certificado y clave se generan en
  <https://auth.homologacion.afip.gob.ar/contribuyente_/login> (con WSAA de
  homologación habilitado). Todo se prueba sin efectos fiscales reales.
- **Producción**: adherirse al WSFE en
  <https://auth.afip.gob.ar/contribuyente_/login>, generar el certificado y el
  punto de venta (tipo 1/6/11, responsable inscripto o monotributista), y cambiar
  `AFIP_AMBIENTE=produccion`.
- El SDK (`afip.py`) resuelve la autenticación SOAP/TA; el servicio solo pide
  el último comprobante +1 y solicita el CAE.

## Flujo

```
Pedido pagado (tienda)
  → POST /facturas/ (evento con snapshot, X-Internal-Key)
  → factura en estado 'pendiente' (idempotencia: UNIQUE pedido_id)
  → claim ATOMICO: 'procesando' (solo un worker por factura, multi-instancia)
  → reconciliacion con ARCA si el numero ya estaba asignado (nunca duplica comprobante)
  → emision CAE en background (reintentos con backoff + jitter si ARCA falla)
  → factura 'aprobada' (cae, vencimiento_cae, numero_comprobante; datos congelados)
  → o 'rechazada' (error fiscal definitivo de ARCA, no se reintenta)
  → o 'error' (error tecnico: se agotaron los intentos; un admin puede reintentar)
```

> Si el proceso muere a mitad de emision, la factura queda en `procesando` y otra
> instancia la recupera cuando vence el timeout (`FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS`).
> La barrida de pendientes/huerfanas se hace con `POST /facturas/procesar-pendientes`
> (o programandola), que reclama atomicamente antes de encolar.

## Endpoints y permisos

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/health` | público (healthcheck) |
| POST | `/facturas/` | service-to-service (`X-Internal-Key`) |
| GET | `/facturas/` | `facturas:read:admin` |
| GET | `/facturas/pedido/{pedido_id}` | `facturas:read:admin` |
| GET | `/facturas/{factura_id}` | `facturas:read:admin` |
| GET | `/mis-facturas` | `facturas:read:own` (solo las del JWT) |
| POST | `/facturas/procesar-pendientes` | `facturas:update:admin` |
| POST | `/facturas/{factura_id}/reintentar` | `facturas:update:admin` |

> Los permisos se auto-registran y se sincronizan con `usuarios` al arrancar.
> Asignarlos al rol `admin` re-corriendo `usuarios/scripts/bootstrap_admin.py`
> o via `PUT /admin/roles/{id}/permisos`.

## Tests

```bash
python -m pytest tests -q
```

Corren con sqlite en memoria y el cliente de ARCA reemplazado por un doble de
prueba: idempotencia (incluida la carrera de registro), máquina de estados,
claims concurrentes, reconciliación con ARCA, reintentos y permisos.
