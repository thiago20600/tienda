"""Integracion con ARCA (ex AFIP) mediante el SDK `afip.py` (Web Service WSFE).

Todo el contacto con el SDK queda aislado en este modulo para poder mockearlo en los tests
y para que un cambio de libreria no toque la logica de negocio.

IMPORTANTE: el import del SDK es perezoso (dentro de la propiedad `afip`), asi el resto del
servicio y los tests funcionan sin la dependencia instalada.
"""
from dataclasses import dataclass
from datetime import date
from decimal import Decimal

from config import settings


class AfipError(Exception):
    """Error base del cliente de ARCA."""


class AfipErrorTransitorio(AfipError):
    """Fallo temporal (ARCA caido, timeout, error de red): conviene reintentar."""


class AfipErrorDefinitivo(AfipError):
    """Rechazo de ARCA: reintentar no tiene sentido."""


class AfipErrorNumeroInvalido(AfipErrorDefinitivo):
    """ARCA rechazo el numero de comprobante (no coincide con su correlativo).

    No es un rechazo fiscal de los datos: es una carrera sobre el correlativo
    (getLastVoucher+1 no es una reserva). El service lo resuelve re-consultando
    el ultimo numero autorizado y reintentando con el correlativo fresco.
    """


# Codigos de error de WSFE asociados a indisponibilidad del servicio (reintentables)
CODIGOS_TRANSITORIOS = {10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028}

PALABRAS_TRANSITORIAS = (
    'timeout', 'timed out', 'connection', 'conexion', 'conexión', 'unavailable',
    'no disponible', 'temporarily', 'reset by peer', '502', '503', '504',
)

# Codigos/mensajes con los que ARCA avisa que el numero enviado no coincide con su
# correlativo (carrera al asignar). Se chequean ANTES que los transitorios.
CODIGOS_NUMERO_INVALIDO = {10016, 10017, 10019, 10020, 10021}
PALABRAS_NUMERO_INVALIDO = (
    'numero de comprobante no es valido', 'número de comprobante no es válido',
    'cbtedesde', 'no coincide con el ultimo comprobante', 'no coincide con el último comprobante',
)

# Alineas de IVA de WSFE (Id del array `Iva`), por alícuota en %
ALICUOTAS_ARCA = {
    '0': 3,
    '10.5': 4,
    '21': 5,
    '27': 6,
    '5': 8,
    '2.5': 9,
}
IVA_21 = 5  # default historico


def codigo_alicuota_arca(alicuota: Decimal) -> int:
    """Mapea una alícuota de IVA (en %, Decimal) al Id de alicua de WSFE."""
    clave = str(alicuota.normalize())
    if clave in ALICUOTAS_ARCA:
        return ALICUOTAS_ARCA[clave]
    # Decimal('21.00').normalize() == '21' pero Decimal('10.50') -> '10.5'; cubrir
    # variantes con ceros a la derecha comparando como porcentaje numerico.
    for porcentaje, codigo in ALICUOTAS_ARCA.items():
        if Decimal(porcentaje) == alicuota:
            return codigo
    raise AfipErrorDefinitivo(f'No se conoce el codigo ARCA para la alicua de IVA {alicuota}%')


@dataclass
class DatosComprobante:
    """Datos que viajan al Web Service de facturacion electronica."""

    punto_de_venta: int
    tipo_comprobante: int
    doc_tipo: int
    doc_numero: str
    monto_neto: Decimal
    monto_iva: Decimal
    monto_total: Decimal
    concepto: int = 1  # 1 = Productos
    # Desglose fiscal por alicuota: lista de {'alicuota': Decimal, 'base_imponible':
    # Decimal, 'importe': Decimal}. ARCA exige un item de IVA por alícuota aplicada.
    desglose_iva: list | None = None


@dataclass
class ResultadoCae:
    """Respuesta exitosa de ARCA."""

    cae: str
    vencimiento_cae: date
    numero_comprobante: int


def extraer_codigo(mensaje: str) -> int | None:
    """Extrae el codigo de un mensaje de error del SDK, con formato "(10016) mensaje"."""
    if not mensaje.startswith('('):
        return None
    cierre = mensaje.find(')')
    if cierre == -1:
        return None
    try:
        return int(mensaje[1:cierre].strip())
    except ValueError:
        return None


def es_error_numero_invalido(mensaje: str, codigo: int | None) -> bool:
    """Detecta el rechazo por carrera sobre el correlativo de ARCA."""
    normalizado = mensaje.lower()
    if codigo is not None and codigo in CODIGOS_NUMERO_INVALIDO:
        return True
    return any(palabra in normalizado for palabra in PALABRAS_NUMERO_INVALIDO)


def clasificar_error(error: Exception) -> AfipError:
    """Traduce una excepcion del SDK a error transitorio o definitivo."""
    mensaje = str(error)

    codigo = extraer_codigo(mensaje)
    if es_error_numero_invalido(mensaje, codigo):
        return AfipErrorNumeroInvalido(mensaje)

    if codigo is not None and codigo in CODIGOS_TRANSITORIOS:
        return AfipErrorTransitorio(mensaje)

    if isinstance(error, (ConnectionError, TimeoutError, OSError)):
        return AfipErrorTransitorio(mensaje)

    if any(palabra in mensaje.lower() for palabra in PALABRAS_TRANSITORIAS):
        return AfipErrorTransitorio(mensaje)

    return AfipErrorDefinitivo(mensaje)


class AfipCliente:
    """Fachada minima sobre `afip.Afip.ElectronicBilling` (WSFE)."""

    def __init__(self, cuit: int, cert: str, key: str, produccion: bool, access_token: str | None = None):
        self.cuit = cuit
        self.cert = cert
        self.key = key
        self.produccion = produccion
        self.access_token = access_token
        self._afip = None

    @property
    def afip(self):
        if self._afip is None:
            from afip import Afip

            # El SDK 1.2.0 espera el CONTENIDO del certificado y de la clave (viajan en
            # el body hacia el proxy de AFIP SDK, que firma el TA); no rutas de archivo.
            cert = self._leer_archivo(self.cert, 'certificado')
            key = self._leer_archivo(self.key, 'clave privada')

            self._afip = Afip({
                'CUIT': self.cuit,
                'cert': cert,
                'key': key,
                'production': self.produccion,
                'access_token': self.access_token,
            })
        return self._afip

    @staticmethod
    def _leer_archivo(ruta: str, descripcion: str) -> str:
        """Lee el contenido de un archivo de credenciales con error claro si falta."""
        try:
            with open(ruta, 'r', encoding='utf-8') as archivo:
                contenido = archivo.read().strip()
        except OSError as error:
            raise AfipErrorDefinitivo(
                f'No se pudo leer el {descripcion} de ARCA en "{ruta}": {error}. '
                'Colocá el archivo en facturacion/certs/ y revisá AFIP_CERT_PATH/AFIP_KEY_PATH.'
            ) from error
        if not contenido:
            raise AfipErrorDefinitivo(f'El {descripcion} en "{ruta}" esta vacio')
        return contenido

    def obtener_ultimo_comprobante(self, punto_de_venta: int, tipo_comprobante: int) -> int:
        """Ultimo comprobante autorizado (el siguiente numero a emitir es este + 1)."""
        try:
            ultimo = self.afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_comprobante)
        except Exception as error:
            raise clasificar_error(error) from error

        return int(ultimo or 0)

    def _armar_iva(self, datos: DatosComprobante) -> list[dict]:
        """Arma el array `Iva` de WSFE: un item por alícuota aplicada.

        float() SOLO aqui, en la frontera SOAP: ARCA exige numeros en el XML. Ningun
        calculo monetario del service usa float (Decimal de punta a punta).
        """
        if datos.tipo_comprobante == 11:  # Las facturas C no discriminan IVA
            return []

        if datos.desglose_iva:
            return [
                {
                    'Id': codigo_alicuota_arca(Decimal(str(item['alicuota']))),
                    'BaseImp': float(Decimal(str(item['base_imponible']))),
                    'Importe': float(Decimal(str(item['importe']))),
                }
                for item in datos.desglose_iva
                if Decimal(str(item['importe'])) > 0
            ]

        # Retrocompatibilidad: sin desglose, una sola alicua del 21% sobre el neto
        if datos.monto_iva > 0:
            return [{
                'Id': IVA_21,
                'BaseImp': float(datos.monto_neto),
                'Importe': float(datos.monto_iva),
            }]
        return []

    def solicitar_cae(self, datos: DatosComprobante, numero_comprobante: int) -> ResultadoCae:
        """Solicita el CAE para el comprobante indicado."""
        payload = {
            'CantReg': 1,
            'PtoVta': datos.punto_de_venta,
            'CbteTipo': datos.tipo_comprobante,
            'Concepto': datos.concepto,
            'DocTipo': datos.doc_tipo,
            'DocNro': int(datos.doc_numero) if str(datos.doc_numero).isdigit() else 0,
            'CbteDesde': numero_comprobante,
            'CbteHasta': numero_comprobante,
            'CbteFch': date.today().strftime('%Y%m%d'),
            'ImpTotal': float(datos.monto_total),
            'ImpTotConc': 0,
            'ImpNeto': float(datos.monto_neto),
            'ImpOpEx': 0,
            'ImpIVA': float(datos.monto_iva),
            'ImpTrib': 0,
            'MonId': 'PES',
            'MonCotiz': 1,
        }

        desglose = self._armar_iva(datos)
        if desglose:
            payload['Iva'] = desglose

        try:
            resultado = self.afip.ElectronicBilling.createVoucher(payload)
        except Exception as error:
            raise clasificar_error(error) from error

        cae = str(resultado.get('CAE') or '')
        vencimiento = resultado.get('CAEFchVto')

        if not cae or not vencimiento:
            raise AfipErrorDefinitivo(f'ARCA no devolvio CAE ni vencimiento. Respuesta: {resultado}')

        return ResultadoCae(
            cae=cae,
            vencimiento_cae=date.fromisoformat(str(vencimiento)),
            numero_comprobante=numero_comprobante,
        )

    def consultar_comprobante(self, punto_de_venta: int, tipo_comprobante: int, numero_comprobante: int) -> ResultadoCae | None:
        """Reconciliacion: consulta en ARCA si un numero ya fue autorizado.

        Devuelve el ResultadoCae si ARCA tiene ese comprobante autorizado (con CAE),
        None si todavia no existe/no esta autorizado. Es la pieza que resuelve el caso
        "ARCA acepto pero el proceso murio antes de guardar": nunca se emite un segundo
        comprobante sin antes verificar este.
        """
        try:
            info = self.afip.ElectronicBilling.getVoucherInfo(numero_comprobante, punto_de_venta, tipo_comprobante)
        except Exception as error:
            raise clasificar_error(error) from error

        if not info:
            return None

        cae = str(info.get('CAE') or '')
        vencimiento = info.get('CAEFchVto')
        if not cae or not vencimiento:
            return None

        return ResultadoCae(
            cae=cae,
            vencimiento_cae=date.fromisoformat(str(vencimiento)),
            numero_comprobante=numero_comprobante,
        )


def obtener_cliente_afip() -> AfipCliente:
    """Factory del cliente de ARCA a partir de la configuracion del servicio."""
    return AfipCliente(
        cuit=settings.AFIP_CUIT,
        cert=settings.AFIP_CERT_PATH,
        key=settings.AFIP_KEY_PATH,
        produccion=settings.afip_produccion,
        access_token=settings.AFIP_ACCESS_TOKEN,
    )
