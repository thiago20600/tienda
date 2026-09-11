from sqlmodel import Session, func, select

from models.categorias import Categoria
from models.metricas import ConteoPorEstado, MetricasPublic, ProductoTop, StockBajoItem
from models.pedido import DetallePedido, EstadoPedido, Pedido
from models.productos import Producto
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import JSONB

ESTADOS_VALIDOS_VENTA = [
    EstadoPedido.pagado,
    EstadoPedido.en_proceso,
    EstadoPedido.en_camino,
    EstadoPedido.entregado,
]

UMBRAL_STOCK_BAJO = 5


class MetricasService:

    def calcular(self, session: Session) -> MetricasPublic:
        return MetricasPublic(
            total_pedidos=self._contar_pedidos_validos(session),
            ingresos=self._calcular_ingresos(session),
            pedidos_por_estado=self._contar_pedidos_por_estado(session),
            top_productos=self._obtener_top_productos(session),
            stock_bajo=self._obtener_stock_bajo(session),
            productos_total=self._contar_productos_activos(session),
            categorias_total=self._contar_categorias(session),
        )

    # ---------- PEDIDOS ----------

    def _contar_pedidos_validos(self, session: Session) -> int:
        return session.exec(
            select(func.count(Pedido.id)).where(
                Pedido.estado.in_(ESTADOS_VALIDOS_VENTA)
            )
        ).one()

    def _calcular_ingresos(self, session: Session) -> float:
        ingresos = session.exec(
            select(func.coalesce(func.sum(Pedido.precio_total), 0.0)).where(
                Pedido.estado.in_(ESTADOS_VALIDOS_VENTA)
            )
        ).one()
        return float(ingresos)

    def _contar_pedidos_por_estado(self, session: Session) -> list[ConteoPorEstado]:
        filas = session.exec(
            select(
                Pedido.estado,
                func.count(Pedido.id)
            ).group_by(Pedido.estado)
        ).all()

        return [
            ConteoPorEstado(estado=str(estado), total=total)
            for estado, total in filas
        ]

    # ---------- PRODUCTOS ----------

    def _obtener_top_productos(self, session: Session) -> list[ProductoTop]:
        filas = session.exec(
            select(
                DetallePedido.producto_id,
                Producto.nombre,
                func.sum(DetallePedido.cantidad).label("unidades"),
                cast(Producto.imagen_url, JSONB).label("imagen_url"),
            )
            .join(Pedido, Pedido.id == DetallePedido.pedido_id)
            .join(Producto, Producto.id == DetallePedido.producto_id)
            .where(Pedido.estado.in_(ESTADOS_VALIDOS_VENTA))
            .group_by(
                DetallePedido.producto_id,
                Producto.nombre,
                cast(Producto.imagen_url, JSONB),
            )
            .order_by(func.sum(DetallePedido.cantidad).desc())
            .limit(5)
        ).all()

        return [
            ProductoTop(
                producto_id=producto_id,
                nombre=nombre,
                unidades=unidades,
                imagen_url=imagen_url[:1] if imagen_url else None,
            )
            for producto_id, nombre, unidades, imagen_url in filas
        ]

    def _obtener_stock_bajo(self, session: Session) -> list[StockBajoItem]:
        productos = session.exec(
            select(Producto)
            .where(
                Producto.producto_activo == True,
                Producto.eliminado_at == None,
                Producto.stock <= UMBRAL_STOCK_BAJO,
            )
            .order_by(Producto.stock)
            .limit(10)
        ).all()

        return [
            StockBajoItem(
                id=p.id,
                nombre=p.nombre,
                stock=p.stock,
                imagen_url=p.imagen_url[:1] if p.imagen_url else None,
            )
            for p in productos
        ]

    def _contar_productos_activos(self, session: Session) -> int:
        return session.exec(
            select(func.count(Producto.id)).where(
                Producto.producto_activo == True,
                Producto.eliminado_at == None,
            )
        ).one()

    # ---------- CATEGORÍAS ----------

    def _contar_categorias(self, session: Session) -> int:
        return session.exec(
            select(func.count(Categoria.id))
        ).one()
