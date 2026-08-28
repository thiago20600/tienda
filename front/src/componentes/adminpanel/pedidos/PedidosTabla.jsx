import { NavLink } from 'react-router-dom';
import { TablaPedidos, EncabezadoTabla, FilaPedido, MensajeTabla } from './PedidosTabla.styles';

const formatearMetodo = (metodo) => metodo === 'tarjeta' ? 'Tarjeta' : 'Efectivo';
const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR');

const PedidosTabla = ({ pedidos, cargando, statusError }) => {
  if (cargando) return <MensajeTabla>Cargando pedidos...</MensajeTabla>;
  if (statusError) return <MensajeTabla>Error al cargar pedidos (Código: {statusError})</MensajeTabla>;
  if (pedidos.length === 0) return <MensajeTabla>No hay pedidos que coincidan con los filtros.</MensajeTabla>;

  return (
    <TablaPedidos>
      <EncabezadoTabla>
        <span>Número de pedido</span>
        <span>Cliente</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span>Productos</span>
        <span>Método de pago</span>
        <span>Precio total</span>
      </EncabezadoTabla>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <NavLink to={`/admin/pedidos/${pedido.id}`}>
              <FilaPedido>{pedido.numero_pedido || `Pedido #${pedido.id}`}</FilaPedido>
              <FilaPedido>{pedido.user_email}</FilaPedido>
              <FilaPedido $estado={pedido.estado}>{pedido.estado.replace('_', ' ')}</FilaPedido>
              <FilaPedido>{formatearFecha(pedido.created_at)}</FilaPedido>
              <FilaPedido>{pedido.detalles?.reduce((total, detalle) => total + detalle.cantidad, 0) || 0}</FilaPedido>
              <FilaPedido>{formatearMetodo(pedido.metodo_pago)}</FilaPedido>
              <FilaPedido $precio>${Number(pedido.precio_total).toFixed(2)}</FilaPedido>
            </NavLink>
          </li>
        ))}
      </ul>
    </TablaPedidos>
  );
};

export default PedidosTabla;