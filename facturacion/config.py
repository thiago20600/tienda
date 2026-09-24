from decimal import Decimal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # Base de datos propia del microservicio de facturacion
    DB_URL: str
    POSTGRES_USER: str
    POSTGRES_DB: str
    POSTGRES_PASSWORD: str

    # Autenticacion JWT (misma clave y algoritmo que api_tienda / api_usuarios)
    SECRET_KEY_JWT: str
    ALGORITHM: str

    # Servicio de usuarios (sincronizacion de permisos) y auth service-to-service
    API_USUARIOS_URL: str
    TOKEN_SERVICIO_INTERNO_API: str

    # ARCA (ex AFIP)
    AFIP_CUIT: int
    AFIP_CERT_PATH: str
    AFIP_KEY_PATH: str
    AFIP_PUNTO_VENTA: int = 1
    AFIP_AMBIENTE: str = 'homologacion'
    AFIP_ACCESS_TOKEN: str | None = None

    # Parametros de emision
    AFIP_TIPO_COMPROBANTE_DEFAULT: int = 6        # 1 = Factura A, 6 = Factura B, 11 = Factura C
    AFIP_DOC_TIPO_DEFAULT: int = 99               # 80 = CUIT, 96 = DNI, 99 = Sin identificar
    AFIP_RAZON_SOCIAL_DEFAULT: str = 'Consumidor Final'
    AFIP_ALICUOTA_IVA: Decimal = Decimal('21.00')

    # Datos del emisor que se imprimen en el PDF del comprobante
    AFIP_RAZON_SOCIAL_EMISOR: str = ''
    AFIP_DOMICILIO_EMISOR: str = ''
    AFIP_INGRESOS_BRUTOS: str = ''
    AFIP_INICIO_ACTIVIDADES: str = ''
    # Base del QR de la RG 4290 (AFIP/ARCA): se le agrega `?p=<payload base64url>`
    AFIP_QR_URL_BASE: str = 'https://www.afip.gob.ar/fe/qr/'

    # Reintentos de emision del CAE
    FACTURACION_MAX_INTENTOS: int = 10
    FACTURACION_BACKOFF_BASE_SEGUNDOS: int = 60
    # Jitter aleatorio (0..N seg) sumado al backoff: evita el "retry storm" cuando
    # varios workers procesan facturas vencidas al mismo tiempo.
    FACTURACION_JITTER_SEGUNDOS: int = 30
    # Tamano maximo del lote por barrida: acota los trabajos concurrentes hacia ARCA.
    FACTURACION_LOTE_TAMANIO: int = 5
    # Un claim en `procesando` mas viejo que esto se considera huérfano (proceso muerto)
    # y puede ser recuperado por otra instancia.
    FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS: int = 300
    # Re-consultas de correlativo cuando ARCA rechaza por numero invalido (carrera).
    FACTURACION_MAX_REINTENTOS_NUMERO: int = 3

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def afip_produccion(self) -> bool:
        """True cuando el servicio apunta a los servidores productivos de ARCA."""
        return self.AFIP_AMBIENTE.strip().lower() == 'produccion'

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
