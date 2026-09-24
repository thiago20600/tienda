import logging
import random
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import or_, update
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from config import settings
from database.engine import engine as db_engine
from exceptions.factura import (
    FacturaNoEncontradaError,
    FacturaNoReintentableError,
    FacturaYaEmitidaError,
)
from models.factura import EstadoFactura, Factura, TipoComprobante
from schemas.factura import FacturaCreate
from services.afip_client import (
    AfipErrorDefinitivo,
    AfipErrorNumeroInvalido,
    AfipErrorTransitorio,
    DatosComprobante,
    ResultadoCae,
    obtener_cliente_afip,
)

logger = logging.getLogger(__name__)

CENTAVOS = Decimal('0.01')
ESTADOS_REINTENTABLES = (EstadoFactura.pendiente, EstadoFactura.error)
# El `error` (reintentos tecnicos agotados) requiere intervencion manual: no entra en
# la barrida automatica; se reclama solo via `reintentar`, que lo resetea a `pendiente`.
ESTADOS_RECLAMABLES = (EstadoFactura.pendiente,)


class FacturacionService:
    """Comandos fiscales: registro del evento, emision del CAE y reintentos.

    Concurrencia y consistencia (diseno multi-instancia):
    - El claim de una factura es un UPDATE con guardas (atomico en Postgres y SQLite):
      si dos workers la reclaman a la vez, solo uno obtiene rowcount=1.
    - `numero_comprobante` se PERSISTE antes de hablar con ARCA: es la clave para
      reconciliar si el proceso muere entre la respuesta de ARCA y el commit.
    - Ninguna sesion queda abierta durante la llamada SOAP: claim/commit -> ARCA ->
      commit del resultado, cada paso en su propia transaccion corta.
    - El correlativo nunca se trata como contador local: getLastVoucher+1 es solo un
      candidato; si ARCA lo rechaza por carrera, se re-consulta y se reintenta.
    """

    def __init__(self, engine=None, cliente_factory=None):
        # `engine` y `cliente_factory` son inyectables para poder testear sin ARCA
        self.engine = engine or db_engine
        self.cliente_factory = cliente_factory or obtener_cliente_afip

    # ------------------------------------------------------------------ #
    # Montos (Decimal de punta a punta: nunca float)
    # ------------------------------------------------------------------ #
    @staticmethod
    def a_decimal(valor) -> Decimal:
        """Convierte a Decimal rechazando float: Decimal(float) hereda su error binario."""
        if isinstance(valor, bool) or isinstance(valor, float):
            raise TypeError('los montos monetarios nunca pueden ser float')
        if isinstance(valor, Decimal):
            return valor
        return Decimal(str(valor))

    @classmethod
    def calcular_montos(cls, precio_total: Decimal, tipo_comprobante: int) -> tuple[Decimal, Decimal, Decimal]:
        """Desglosa el total en neto e IVA con la alicua global configurada.

        Se asume que `precio_total` es el precio final al publico con IVA incluido (es el
        precio que maneja la tienda), por lo que el neto se obtiene extrayendo el IVA.
        Las facturas C no discriminan IVA. Para items con alicuotas mezcladas usar
        `calcular_montos_desglosado`.
        """
        total = cls.a_decimal(precio_total).quantize(CENTAVOS, rounding=ROUND_HALF_UP)

        if int(tipo_comprobante) == TipoComprobante.factura_c.value:
            return total, Decimal('0.00'), total

        divisor = Decimal('1') + (settings.AFIP_ALICUOTA_IVA / Decimal('100'))
        neto = (total / divisor).quantize(CENTAVOS, rounding=ROUND_HALF_UP)
        iva = (total - neto).quantize(CENTAVOS, rounding=ROUND_HALF_UP)
        return neto, iva, total

    @classmethod
    def calcular_montos_desglosado(cls, datos: FacturaCreate, tipo_comprobante: int) -> tuple[Decimal, Decimal, Decimal, list[dict]]:
        """Desglose fiscal por alicua (base imponible + IVA de cada grupo).

        Agrupa los items por su `alicuota_iva` y calcula base/importe de cada grupo, que
        es lo que ARCA exige en el array `Iva` de WSFE. Devuelve (neto, iva, total,
        desglose) con el desglose como lista de dicts de Decimals.
        """
        total = cls.a_decimal(datos.precio_total).quantize(CENTAVOS, rounding=ROUND_HALF_UP)

        if int(tipo_comprobante) == TipoComprobante.factura_c.value:
            return total, Decimal('0.00'), total, []

        grupos: dict[Decimal, Decimal] = {}
        for detalle in datos.detalles:
            alicuota = cls.a_decimal(detalle.alicuota_iva).quantize(CENTAVOS, rounding=ROUND_HALF_UP)
            bruto = cls.a_decimal(detalle.subtotal if detalle.subtotal is not None else detalle.cantidad * detalle.precio_unitario)
            grupos[alicuota] = grupos.get(alicuota, Decimal('0')) + bruto

        if not grupos:
            # Sin items en el snapshot: alicua global configurada (comportamiento historico)
            neto, iva, _ = cls.calcular_montos(total, tipo_comprobante)
            desglose = [{
                'alicuota': settings.AFIP_ALICUOTA_IVA.quantize(CENTAVOS),
                'base_imponible': neto,
                'importe': iva,
            }]
            return neto, iva, total, desglose

        neto = Decimal('0.00')
        iva = Decimal('0.00')
        desglose: list[dict] = []
        for alicuota in sorted(grupos):
            bruto = grupos[alicuota].quantize(CENTAVOS, rounding=ROUND_HALF_UP)
            base = (bruto / (Decimal('1') + alicuota / Decimal('100'))).quantize(CENTAVOS, rounding=ROUND_HALF_UP)
            importe = (bruto - base).quantize(CENTAVOS, rounding=ROUND_HALF_UP)
            neto += base
            iva += importe
            desglose.append({'alicuota': alicuota, 'base_imponible': base, 'importe': importe})

        if neto + iva != total:
            logger.warning(
                'Pedido %s: la suma de items (%s) no coincide con el precio_total (%s); '
                'ARCA podria rechazar el comprobante por inconsistencia de importes',
                datos.pedido_id, neto + iva, total,
            )

        return neto.quantize(CENTAVOS), iva.quantize(CENTAVOS), total, desglose

    @staticmethod
    def _serializar_desglose(desglose: list[dict] | None) -> list[dict] | None:
        """Decimals -> str para persistir en JSON (JSON no soporta Decimal)."""
        if not desglose:
            return None
        return [
            {
                'alicuota': str(item['alicuota']),
                'base_imponible': str(item['base_imponible']),
                'importe': str(item['importe']),
            }
            for item in desglose
        ]

    # ------------------------------------------------------------------ #
    # Reintentos (backoff + jitter anti retry-storm)
    # ------------------------------------------------------------------ #
    @staticmethod
    def calcular_backoff(intentos: int) -> int:
        """Backoff exponencial (60s, 120s, 240s...) limitado a 1 hora."""
        return min(settings.FACTURACION_BACKOFF_BASE_SEGUNDOS * (2 ** max(intentos - 1, 0)), 3600)

    @classmethod
    def calcular_proximo_intento(cls, intentos: int, desde: datetime | None = None) -> datetime:
        """Momento del proximo intento: backoff + jitter aleatorio.

        El jitter desincroniza a los workers: si ARCA se cae, no todos los procesos
        reintentan todas las facturas en el mismo instante (evita el retry storm).
        """
        base = desde or datetime.now(timezone.utc)
        jitter = random.randint(0, settings.FACTURACION_JITTER_SEGUNDOS)
        return base + timedelta(seconds=cls.calcular_backoff(intentos) + jitter)

    # ------------------------------------------------------------------ #
    # Registro del evento
    # ------------------------------------------------------------------ #
    def registrar_pedido_pagado(self, session: Session, datos: FacturaCreate) -> Factura:
        """Registra la "foto" contable del pedido pagado.

        Idempotente por dos caminos: primero consulta si ya existe la factura del
        pedido y, si dos workers la registran a la vez, el UNIQUE sobre `pedido_id`
        resuelve la carrera y ambos terminan devolviendo la misma fila. Una factura
        aprobada jamas se modifica (datos fiscales congelados).
        """
        existente = session.exec(select(Factura).where(Factura.pedido_id == datos.pedido_id)).first()
        if existente is not None:
            logger.info(
                'El pedido %s ya tiene la factura %s (estado %s): se ignora el evento duplicado',
                datos.pedido_id, existente.id, existente.estado.value,
            )
            return existente

        tipo_comprobante = datos.tipo_comprobante or settings.AFIP_TIPO_COMPROBANTE_DEFAULT
        punto_de_venta = datos.punto_de_venta or settings.AFIP_PUNTO_VENTA
        neto, iva, total, desglose = self.calcular_montos_desglosado(datos, tipo_comprobante)

        factura = Factura(
            pedido_id=datos.pedido_id,
            numero_pedido=datos.numero_pedido,
            user_email=datos.user_email,
            estado=EstadoFactura.pendiente,
            punto_de_venta=punto_de_venta,
            tipo_comprobante=tipo_comprobante,
            doc_tipo=datos.doc_tipo,
            doc_numero=datos.doc_numero,
            razon_social=datos.razon_social or settings.AFIP_RAZON_SOCIAL_DEFAULT,
            monto_neto=neto,
            monto_iva=iva,
            monto_total=total,
            desglose_iva=self._serializar_desglose(desglose),
            detalles=[detalle.model_dump(mode='json') for detalle in datos.detalles] or None,
        )
        session.add(factura)
        try:
            session.commit()  # atomico: reserva la idempotencia fiscal (UNIQUE pedido_id)
        except IntegrityError:
            # Carrera: otro worker registro el mismo pedido entre el SELECT y el COMMIT
            session.rollback()
            existente = session.exec(select(Factura).where(Factura.pedido_id == datos.pedido_id)).first()
            if existente is None:
                raise
            logger.info('Carrera de registro resuelta por el UNIQUE: pedido %s -> factura %s', datos.pedido_id, existente.id)
            return existente

        session.refresh(factura)
        return factura

    # ------------------------------------------------------------------ #
    # Claims atomicos (un worker por factura, multiples instancias)
    # ------------------------------------------------------------------ #
    def _reclamar_en(self, session: Session, factura_id: int, ahora: datetime, corte: datetime) -> bool:
        """Reclama (claim) la factura con un UPDATE atomico y con guardas.

        Reclamable si esta `pendiente` con el proximo intento vencido, o si esta
        `procesando` pero su reclamo vencio (proceso muerto: `updated_at` mas viejo que
        el timeout). Devuelve True solo para el worker que obtuvo rowcount=1.
        """
        sentencia = (
            update(Factura)
            .where(
                Factura.id == factura_id,
                or_(
                    Factura.estado.in_(list(ESTADOS_RECLAMABLES))
                    & or_(Factura.proximo_intento.is_(None), Factura.proximo_intento <= ahora),
                    (Factura.estado == EstadoFactura.procesando) & (Factura.updated_at <= corte),
                ),
            )
            .values(estado=EstadoFactura.procesando, updated_at=ahora)
            .execution_options(synchronize_session=False)
        )
        resultado = session.exec(sentencia)
        session.commit()
        return bool(resultado.rowcount)

    def reintentar_pendientes(self, session: Session, limite: int | None = None) -> list[int]:
        """Barrida de facturas vencidas: las reclama ATOMICAMENTE y devuelve las propias.

        No "consulta y devuelve ids": el claim es parte de la operacion. Si dos workers
        barren simultaneamente, cada fila la gana un solo worker (al segundo UPDATE le da
        rowcount=0). El lote queda acotado por `limite` para no enviar un diluvio de
        trabajos a ARCA de golpe.
        """
        ahora = datetime.now(timezone.utc)
        corte = ahora - timedelta(seconds=settings.FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS)
        limite = limite or settings.FACTURACION_LOTE_TAMANIO

        candidatas = session.exec(
            select(Factura)
            .where(
                Factura.estado.in_(list(ESTADOS_RECLAMABLES)),
                or_(Factura.proximo_intento.is_(None), Factura.proximo_intento <= ahora),
            )
            .order_by(Factura.created_at)
            .limit(limite)
        ).all()

        return [
            factura.id for factura in candidatas
            if self._reclamar_en(session, factura.id, ahora=ahora, corte=corte)
        ]

    def reclamar_procesando_vencidas(self, session: Session, limite: int | None = None) -> list[int]:
        """Recupera facturas `procesando` huerfanas (el proceso murio a mitad de emision).

        Reclama las que superaron el timeout de procesamiento y devuelve sus ids. El
        llamador debe correr `emitir_cae()` sobre ellas, que ANTES de reemitir va a
        reconciliar contra ARCA usando el numero ya persistido (nunca duplica comprobante).
        """
        ahora = datetime.now(timezone.utc)
        corte = ahora - timedelta(seconds=settings.FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS)
        limite = limite or settings.FACTURACION_LOTE_TAMANIO

        candidatas = session.exec(
            select(Factura)
            .where(Factura.estado == EstadoFactura.procesando, Factura.updated_at <= corte)
            .order_by(Factura.updated_at)
            .limit(limite)
        ).all()

        return [
            factura.id for factura in candidatas
            if self._reclamar_en(session, factura.id, ahora=ahora, corte=corte)
        ]

    # ------------------------------------------------------------------ #
    # Emision del CAE (pipeline multi-instancia con reconciliacion)
    # ------------------------------------------------------------------ #
    def emitir_cae(self, factura_id: int) -> None:
        """Pipeline completo de emision, con sesiones propias y cortas.

        1. Claim atomico -> `procesando` (transaccion breve, se cierra ANTES de ARCA).
        2. Lectura del snapshot y del numero ya persistido (si lo hay).
        3. Reconciliacion: si habia numero asignado, se consulta a ARCA; si ya lo
           autorizo, se registra el CAE y NO se emite un segundo comprobante.
        4. Asignacion del numero candidato (getLastVoucher + 1) y su persistencia.
        5. Llamada SOAP SIN ninguna transaccion abierta.
        6. Persistencia del resultado en una transaccion propia.
        """
        ahora = datetime.now(timezone.utc)
        corte = ahora - timedelta(seconds=settings.FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS)

        with Session(self.engine) as session:
            reclamada = self._reclamar_en(session, factura_id, ahora=ahora, corte=corte)
        if not reclamada:
            return  # otro worker la esta procesando: no duplicar trabajo

        # Lectura corta del contexto; la transaccion se cierra antes de hablar con ARCA
        with Session(self.engine) as session:
            factura = session.get(Factura, factura_id)
            if factura is None or factura.cae:
                return  # ya autorizada por otro camino
            numero = factura.numero_comprobante
            datos = DatosComprobante(
                punto_de_venta=factura.punto_de_venta,
                tipo_comprobante=factura.tipo_comprobante,
                doc_tipo=factura.doc_tipo,
                doc_numero=factura.doc_numero,
                monto_neto=factura.monto_neto,
                monto_iva=factura.monto_iva,
                monto_total=factura.monto_total,
                desglose_iva=factura.desglose_iva,
            )

        cliente = self.cliente_factory()

        # Reconciliacion: el numero ya fue asignado en un intento anterior (posible
        # crash post-ARCA). Consultar antes de reemitir evita el comprobante duplicado.
        if numero is not None:
            try:
                autorizado = cliente.consultar_comprobante(
                    datos.punto_de_venta, datos.tipo_comprobante, numero,
                )
            except AfipErrorTransitorio as error:
                self._registrar_fallo_transitorio(factura_id, error)
                return
            if autorizado is not None:
                logger.info('Factura %s: ARCA ya tenia autorizado el comprobante %s (reconciliado)', factura_id, numero)
                self._persistir_aprobada(factura_id, autorizado)
                return

        if numero is None:
            try:
                ultimo = cliente.obtener_ultimo_comprobante(datos.punto_de_venta, datos.tipo_comprobante)
            except AfipErrorTransitorio as error:
                self._registrar_fallo_transitorio(factura_id, error)
                return
            numero = ultimo + 1
            # Persistir el candidato ANTES de llamar a ARCA: es la clave de la
            # reconciliacion si el proceso muere despues de obtener el CAE.
            self._persistir_numero_comprobante(factura_id, numero)

        self._solicitar_y_persistir(cliente, factura_id, datos, numero)

    def _solicitar_y_persistir(self, cliente, factura_id: int, datos: DatosComprobante, numero: int) -> None:
        """Solicita el CAE con re-consulta de correlativo ante carrera de numeros.

        Si ARCA rechaza el numero por carrera (otro worker/instancia emitio primero),
        re-consulta el ultimo autorizado y reintenta hasta FACTURACION_MAX_REINTENTOS_NUMERO
        veces. El SOAP corre sin transaccion abierta; el resultado se persiste aparte.
        """
        for _ in range(settings.FACTURACION_MAX_REINTENTOS_NUMERO):
            try:
                resultado = cliente.solicitar_cae(datos, numero)
            except AfipErrorNumeroInvalido:
                # Carrera sobre el correlativo: el numero no es una reserva. Re-consultar
                # el ultimo real y volver a intentar con el correlativo fresco.
                logger.warning('Factura %s: ARCA rechazo el numero %s por carrera; re-consultando correlativo', factura_id, numero)
                try:
                    numero = cliente.obtener_ultimo_comprobante(datos.punto_de_venta, datos.tipo_comprobante) + 1
                except AfipErrorTransitorio as error:
                    self._registrar_fallo_transitorio(factura_id, error)
                    return
                continue
            except AfipErrorTransitorio as error:
                self._registrar_fallo_transitorio(factura_id, error)
                return
            except AfipErrorDefinitivo as error:
                self._persistir_rechazada(factura_id, error)
                return

            self._persistir_aprobada(factura_id, resultado)
            return

        # Agotados los reintentos de numero: error tecnico con la ultima causa conocida
        self._registrar_fallo_transitorio(
            factura_id,
            AfipErrorTransitorio(f'no se pudo asignar numero de comprobante tras {settings.FACTURACION_MAX_REINTENTOS_NUMERO} re-consultas de correlativo'),
        )

    # ------------------------------------------------------------------ #
    # Persistidores (cada uno en su propia transaccion corta)
    # ------------------------------------------------------------------ #
    def _persistir_numero_comprobante(self, factura_id: int, numero: int) -> None:
        """Persiste el numero candidato (para poder reconciliar ante un crash)."""
        with Session(self.engine) as session:
            session.exec(
                update(Factura)
                .where(Factura.id == factura_id, Factura.estado == EstadoFactura.procesando)
                .values(numero_comprobante=numero, updated_at=datetime.now(timezone.utc))
                .execution_options(synchronize_session=False)
            )
            session.commit()

    def _persistir_aprobada(self, factura_id: int, resultado: ResultadoCae) -> None:
        """Registra el CAE y congela la factura (datos fiscales inmutables).

        Todas las guardas exigen estado `procesando`: si otro worker ya la aprobo (o la
        rechazo), esta escritura no pisa nada.
        WHERE estado = 'procesando'.
        """
        with Session(self.engine) as session:
            session.exec(
                update(Factura)
                .where(Factura.id == factura_id, Factura.estado == EstadoFactura.procesando)
                .values(
                    estado=EstadoFactura.aprobada,
                    cae=resultado.cae,
                    vencimiento_cae=resultado.vencimiento_cae,
                    numero_comprobante=resultado.numero_comprobante,
                    fecha_emision=datetime.now(timezone.utc),
                    ultimo_error=None,
                    updated_at=datetime.now(timezone.utc),
                )
                .execution_options(synchronize_session=False)
            )
            session.commit()

    def _persistir_rechazada(self, factura_id: int, error: Exception) -> None:
        """Rechazo fiscal definitivo de ARCA: no se reintenta (fiscal != tecnico)."""
        with Session(self.engine) as session:
            session.exec(
                update(Factura)
                .where(Factura.id == factura_id, Factura.estado == EstadoFactura.procesando)
                .values(
                    estado=EstadoFactura.rechazada,
                    ultimo_error=str(error)[:500],
                    updated_at=datetime.now(timezone.utc),
                )
                .execution_options(synchronize_session=False)
            )
            session.commit()

    def _registrar_fallo_transitorio(self, factura_id: int, error: Exception) -> None:
        """Fallo tecnico transitorio: incrementa intentos y reagenda con backoff+jitter.

        Distingue tecnico de fiscal: `error` = reintentos TECNICOS agotados (timeout,
        red; se recupera con `reintentar`); `rechazada` = rechazo FISCAL de ARCA (hay
        que corregir datos). Al agotar FACTURACION_MAX_INTENTOS pasa a `error` y sale
        de la barrida automatica para no martillar a ARCA para siempre.
        """
        with Session(self.engine) as session:
            factura = session.get(Factura, factura_id)
            if factura is None or factura.estado != EstadoFactura.procesando:
                return
            factura.intentos += 1
            factura.ultimo_error = str(error)[:500]
            factura.updated_at = datetime.now(timezone.utc)
            if factura.intentos >= settings.FACTURACION_MAX_INTENTOS:
                factura.estado = EstadoFactura.error
                factura.proximo_intento = None
                logger.error('Factura %s: se agotaron los %s intentos ante ARCA', factura_id, factura.intentos)
            else:
                factura.estado = EstadoFactura.pendiente
                factura.proximo_intento = self.calcular_proximo_intento(factura.intentos)
                logger.warning(
                    'Factura %s: fallo transitorio (%s). Reintento %s/%s agendado en %s',
                    factura_id, error, factura.intentos, settings.FACTURACION_MAX_INTENTOS, factura.proximo_intento,
                )
            session.add(factura)
            session.commit()
    # ------------------------------------------------------------------ #
    # Reintento manual
    # ------------------------------------------------------------------ #
    def reintentar(self, session: Session, factura_id: int) -> Factura:
        """Reinicia el ciclo de emision de una factura pendiente o en error.

        Seguro frente a concurrencia: el reset es un UPDATE con guarda de estado, asi
        que si otro worker la tiene en `procesando` el reset no aplica y se informa.
        """
        factura = session.get(Factura, factura_id)
        if not factura:
            raise FacturaNoEncontradaError(id=factura_id)

        if factura.estado == EstadoFactura.aprobada:
            raise FacturaYaEmitidaError(id=factura.id, estado=factura.estado.value)

        if factura.estado not in ESTADOS_REINTENTABLES:
            raise FacturaNoReintentableError(id=factura.id, estado=factura.estado.value)

        sentencia = (
            update(Factura)
            .where(Factura.id == factura_id, Factura.estado.in_(list(ESTADOS_REINTENTABLES)))
            .values(
                estado=EstadoFactura.pendiente,
                intentos=0,
                ultimo_error=None,
                proximo_intento=None,
                updated_at=datetime.now(timezone.utc),
            )
            .execution_options(synchronize_session=False)
        )
        session.exec(sentencia)
        session.commit()
        session.refresh(factura)
        return factura

    def encolar_emision(self, factura_id: int, background_tasks=None) -> None:
        """Dispara la emision del CAE en background (nunca dentro del ciclo del request).

        `emitir_cae` abre sus propias sesiones: recibe solo el id, jamas la sesion del
        request, para no dejar transacciones abiertas durante la llamada SOAP.
        """
        if background_tasks is None:
            return
        background_tasks.add_task(self.emitir_cae, factura_id)





