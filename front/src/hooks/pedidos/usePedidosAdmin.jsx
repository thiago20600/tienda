import { useEffect, useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function usePedidosAdmin({
  userEmail = '',
  numeroPedido = '',
  estado = '',
  metodoPago = '',
  precioTotal = '',
  enabled = true,
  page = 1,
  size = 10
} = {}) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [statusError, setStatusError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(page);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalPedidos, setTotalPedidos] = useState(0);

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!enabled) {
        setPedidos([]);
        setPaginaActual(1);
        setTotalPaginas(1);
        setTotalPedidos(0);
        setCargando(false);
        return;
      }

      setCargando(true);
      try {
        const query = new URLSearchParams({
          page: String(paginaActual),
          size: String(size),
        });

        if (userEmail) query.set('user_email', userEmail);
        if (numeroPedido) query.set('numero_pedido', numeroPedido);
        if (estado) query.set('estado', estado);
        if (metodoPago) query.set('metodo_pago', metodoPago);
        if (precioTotal) query.set('precio_total', precioTotal);

        const response = await tiendaRequest(`/pedidos/?${query.toString()}`, {
          method: 'GET',
          auth: true
        });

        if (!response.ok) {
          setStatusError(response.status);
          return;
        }

        const data = await response.json().catch(() => ({ items: [], total: 0, page: 1, size, pages: 1 }));
        setPedidos(data.items || []);
        setTotalPaginas(data.pages || 1);
        setTotalPedidos(data.total || 0);
        setPaginaActual(data.page || paginaActual);
        setStatusError(null);
      } catch (error) {
        console.error('Error en usePedidosAdmin:', error);
        setStatusError(0);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, [userEmail, numeroPedido, estado, metodoPago, precioTotal, enabled, paginaActual, size]);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return { pedidos, cargando, statusError, page: paginaActual, pages: totalPaginas, total: totalPedidos, cambiarPagina };
}