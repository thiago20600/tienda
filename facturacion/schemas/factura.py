from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer, field_validator

from models.factura import EstadoFactura


def _rechazar_float(valor):
    """Los montos viajan como string/entero (Decimal seguro). Un float de JS/JSON
    introduce error binario: se rechaza en la frontera del API, nunca se convierte."""
    if isinstance(valor, bool) or isinstance(valor, float):
        raise ValueError('los montos se envian como string o entero, nunca como float')
    return valor


class DetalleFacturaCreate(BaseModel):
    """Item del pedido dentro del snapshot contable que envia la tienda."""

    producto_id: int | None = None
    descripcion: str | None = None
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal | None = None
    # Alicuota de IVA del item (21.00 por defecto). Permite facturas con IVA mixto:
    # el service agrupa por alicuota para armar el desglose fiscal que exige ARCA.
    alicuota_iva: Decimal = Decimal('21.00')

    @field_validator('precio_unitario', 'subtotal', 'alicuota_iva', mode='before')
    @classmethod
    def montos_sin_float(cls, valor):
        return _rechazar_float(valor)


class FacturaCreate(BaseModel):
    """Payload del evento "pedido pagado" que dispara api_tienda."""

    pedido_id: int
    numero_pedido: str
    user_email: str
    metodo_pago: str | None = None
    precio_total: Decimal
    detalles: list[DetalleFacturaCreate] = []

    # Datos del receptor (por defecto Consumidor Final)
    doc_tipo: int = 99          # 80 = CUIT, 96 = DNI, 99 = Sin identificar
    doc_numero: str = '0'
    razon_social: str = 'Consumidor Final'

    # Permite forzar el tipo de comprobante/punto de venta; si no viene, se usan los de config
    tipo_comprobante: int | None = None
    punto_de_venta: int | None = None

    @field_validator('precio_total', mode='before')
    @classmethod
    def montos_sin_float(cls, valor):
        return _rechazar_float(valor)


class AlicuotaIvaPublic(BaseModel):
    """Desglose fiscal por alicuota (base imponible + IVA del grupo)."""

    alicuota: Decimal
    base_imponible: Decimal
    importe: Decimal

    @field_serializer('alicuota', 'base_imponible', 'importe', when_used='json')
    def serializar_montos(self, valor: Decimal) -> float:
        return float(valor)


class FacturaPublic(BaseModel):
    """Representacion de salida de una factura (Decimal -> float solo al serializar)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    pedido_id: int
    numero_pedido: str
    user_email: str

    estado: EstadoFactura
    intentos: int
    ultimo_error: str | None = None
    proximo_intento: datetime | None = None

    cae: str | None = None
    vencimiento_cae: date | None = None
    numero_comprobante: int | None = None
    punto_de_venta: int
    tipo_comprobante: int

    doc_tipo: int
    doc_numero: str
    razon_social: str

    monto_neto: Decimal
    monto_iva: Decimal
    monto_total: Decimal
    desglose_iva: list[AlicuotaIvaPublic] | None = None

    # created_at = llegada del evento al microservicio;
    # fecha_emision = autorizacion fiscal de ARCA (None hasta obtener el CAE).
    fecha_emision: datetime | None = None
    created_at: datetime
    updated_at: datetime

    @field_serializer('monto_neto', 'monto_iva', 'monto_total', when_used='json')
    def serializar_montos(self, valor: Decimal) -> float:
        return float(valor)


class DetalleFacturaPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    descripcion: str | None = None
    cantidad: int = 0
    precio_unitario: Decimal = Decimal('0')

    @field_serializer('precio_unitario', when_used='json')
    def serializar_precio(self, valor: Decimal) -> float:
        return float(valor)
