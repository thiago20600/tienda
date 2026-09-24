"""Consultas administrativas de facturacion (CQRS liviano).

Los comandos fiscales (registrar, emitir CAE, reintentar, claims) viven en
`FacturacionService`; las lecturas de administracion y de usuario viven aca. Asi el
service de emision no mezcla el procesamiento fiscal con queries de lectura.
"""
from datetime import datetime

from fastapi_pagination import Params
from fastapi_pagination.ext.sqlmodel import paginate
from sqlmodel import Session, select

from exceptions.factura import FacturaNoAutorizadaError, FacturaNoEncontradaError
from models.factura import EstadoFactura, Factura
from services.comprobante_pdf import generar_pdf_comprobante, nombre_archivo


class ConsultasFacturacionService:

    def obtener_por_id(self, session: Session, factura_id: int) -> Factura:
        factura = session.get(Factura, factura_id)
        if not factura:
            raise FacturaNoEncontradaError(id=factura_id)
        return factura

    def obtener_por_pedido(self, session: Session, pedido_id: int) -> Factura | None:
        return session.exec(select(Factura).where(Factura.pedido_id == pedido_id)).first()

    def obtener_propia(self, session: Session, factura_id: int, email: str) -> Factura:
        """Factura del usuario autenticado (permiso `facturas:read:own`).

        Si la factura existe pero es de otro cliente se responde 404 igual que si no
        existiera: no se filtra si el comprobante de otro existe (no leaking).
        """
        factura = session.get(Factura, factura_id)
        if not factura or factura.user_email != email:
            raise FacturaNoEncontradaError(id=factura_id)
        return factura

    def generar_pdf(self, session: Session, factura_id: int, email: str | None = None) -> tuple[bytes, str]:
        """Genera el PDF fiscal de una factura autorizada.

        Devuelve (contenido_pdf, nombre_archivo). Solo tiene sentido para facturas con CAE:
        una factura pendiente no es un comprobante valido y se responde 409.
        """
        factura = (
            self.obtener_por_id(session=session, factura_id=factura_id)
            if email is None
            else self.obtener_propia(session=session, factura_id=factura_id, email=email)
        )

        if not factura.cae:
            raise FacturaNoAutorizadaError(id=factura.id, estado=factura.estado.value)

        return generar_pdf_comprobante(factura), nombre_archivo(factura)

    def listar_facturas(
        self,
        session: Session,
        estado: EstadoFactura | None = None,   # dominio explicito: FastAPI valida el enum
        numero_pedido: str | None = None,
        user_email: str | None = None,
        desde: datetime | None = None,
        hasta: datetime | None = None,
        params: Params | None = None,
    ):
        query = select(Factura)

        if estado is not None:
            query = query.where(Factura.estado == estado)

        if numero_pedido is not None and numero_pedido.strip():
            query = query.where(Factura.numero_pedido.ilike(f'%{numero_pedido.strip()}%'))

        if user_email is not None and user_email.strip():
            query = query.where(Factura.user_email.ilike(f'%{user_email.strip()}%'))

        if desde is not None:
            query = query.where(Factura.created_at >= desde)

        if hasta is not None:
            query = query.where(Factura.created_at <= hasta)

        query = query.order_by(Factura.created_at.desc())

        if params is not None:
            return paginate(session, query, params)

        return session.exec(query).all()

    def listar_por_usuario(self, session: Session, user_email: str, params: Params | None = None):
        """Facturas propias (permiso `facturas:read:own`): filtro exacto por el email del token."""
        query = (
            select(Factura)
            .where(Factura.user_email == user_email)
            .order_by(Factura.created_at.desc())
        )

        if params is not None:
            return paginate(session, query, params)

        return session.exec(query).all()