from exceptions.base import BusinessError


class FacturaNoEncontradaError(BusinessError):
    def __init__(self, id: int):
        super().__init__(
            message=f'No se encontro la factura con id: {id}',
            code='FACTURA_NOT_FOUND',
        )


class FacturaYaEmitidaError(BusinessError):
    def __init__(self, id: int, estado: str):
        super().__init__(
            message=f'La factura con id: {id} ya fue emitida (estado: {estado})',
            code='FACTURA_YA_EMITIDA',
        )


class FacturaEnProcesamientoError(BusinessError):
    """Otro worker tiene la factura reclamada (estado `procesando`)."""

    def __init__(self, id: int):
        super().__init__(
            message=f'La factura con id: {id} esta siendo procesada por otro worker',
            code='FACTURA_EN_PROCESAMIENTO',
        )


class FacturaNoReintentableError(BusinessError):
    def __init__(self, id: int, estado: str):
        super().__init__(
            message=f'La factura con id: {id} no se puede reintentar (estado: {estado})',
            code='FACTURA_NO_REINTENTABLE',
        )


class ErrorEmisionCaeError(BusinessError):
    def __init__(self, detalle: str):
        super().__init__(
            message=f'No se pudo emitir el CAE ante ARCA: {detalle}',
            code='ERROR_EMISION_CAE',
        )


class FacturaNoAutorizadaError(BusinessError):
    """Se pidio el comprobante PDF de una factura que ARCA todavia no autorizo."""

    def __init__(self, id: int, estado: str):
        super().__init__(
            message=f'La factura con id: {id} todavia no fue autorizada por ARCA (estado: {estado})',
            code='FACTURA_NO_AUTORIZADA',
        )
