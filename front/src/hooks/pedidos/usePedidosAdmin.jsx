import { useEffect, useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function usePedidosAdmin({ userEmail = '', enabled = true } = {}) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!enabled) {
        setPedidos([]);
        setCargando(false);
        return;
      }
      setCargando(true);
      try {
        const filtroUsuario = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
        const response = await tiendaRequest(`/pedidos/${filtroUsuario}`, {
          method: 'GET',
          auth: true
        });

        if (!response.ok) {
          setStatusError(response.status);
          return;
        }

        setPedidos(await response.json());
        setStatusError(null);
      } catch (error) {
        console.error('Error en usePedidosAdmin:', error);
        setStatusError(0);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, [userEmail, enabled]);

  return { pedidos, cargando, statusError };
}