import { useEffect, useState } from 'react';
import { facturacionRequest } from '../../services/api/apiClient';

// Facturas propias del cliente logueado (GET /mis-facturas: el backend filtra por el `sub` del JWT).
export default function useMisFacturas({ page = 1, size = 5 } = {}) {
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(page);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const obtenerFacturas = async () => {
            setCargando(true);
            try {
                const query = new URLSearchParams({
                    page: String(paginaActual),
                    size: String(size),
                });

                const response = await facturacionRequest(`/mis-facturas?${query.toString()}`, {
                    method: 'GET',
                    auth: true,
                });

                if (!response.ok) {
                    setStatusError(response.status);
                    setFacturas([]);
                    return;
                }

                const data = await response.json().catch(() => ({ items: [], total: 0, pages: 1 }));
                setFacturas(data.items || []);
                setPages(data.pages || 1);
                setTotal(data.total || 0);
                setStatusError(null);
            } catch (error) {
                console.error('Error en useMisFacturas:', error);
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerFacturas();
    }, [paginaActual, size]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= pages) {
            setPaginaActual(nuevaPagina);
        }
    };

    return { facturas, cargando, statusError, page: paginaActual, pages, total, cambiarPagina };
}
