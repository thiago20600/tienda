import { useEffect, useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function useMisPedidos({ page = 1, size = 5 } = {}) {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(page);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const obtenerPedidos = async () => {
            setCargando(true);
            try {
                const query = new URLSearchParams({
                    page: String(paginaActual),
                    size: String(size),
                });

                const response = await tiendaRequest(`/mis-pedidos?${query.toString()}`, {
                    method: 'GET',
                    auth: true,
                });

                if (!response.ok) {
                    setStatusError(response.status);
                    return;
                }

                const data = await response.json().catch(() => ({ items: [], total: 0, pages: 1 }));
                setPedidos(data.items || []);
                setPages(data.pages || 1);
                setTotal(data.total || 0);
                setStatusError(null);
            } catch (error) {
                console.error('Error en useMisPedidos:', error);
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerPedidos();
    }, [paginaActual, size]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= pages) {
            setPaginaActual(nuevaPagina);
        }
    };

    return { pedidos, cargando, statusError, page: paginaActual, pages, total, cambiarPagina };
}
