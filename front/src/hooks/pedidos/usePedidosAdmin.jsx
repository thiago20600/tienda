import { useEffect, useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function usePedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const obtenerPedidos = async () => {
      setCargando(true);
      try {
        const response = await tiendaRequest('/pedidos/', {
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
  }, []);

  return { pedidos, cargando, statusError };
}