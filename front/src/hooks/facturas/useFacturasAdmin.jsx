import { useCallback, useEffect, useState } from 'react';
import { facturacionRequest } from '../../services/api/apiClient';

// Listado administrativo de facturas (GET /facturas/) con filtros, paginacion y recarga manual.
export default function useFacturasAdmin({
    estado = '',
    numeroPedido = '',
    userEmail = '',
    enabled = true,
    page = 1,
    size = 10
} = {}) {
    const [facturas, setFacturas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(page);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalFacturas, setTotalFacturas] = useState(0);
    const [recarga, setRecarga] = useState(0);

    useEffect(() => {
        const obtenerFacturas = async () => {
            if (!enabled) {
                setFacturas([]);
                setPaginaActual(1);
                setTotalPaginas(1);
                setTotalFacturas(0);
                setCargando(false);
                return;
            }

            setCargando(true);
            try {
                const query = new URLSearchParams({
                    page: String(paginaActual),
                    size: String(size),
                });

                if (estado) query.set('estado', estado);
                if (numeroPedido) query.set('numero_pedido', numeroPedido);
                if (userEmail) query.set('user_email', userEmail);

                const response = await facturacionRequest(`/facturas/?${query.toString()}`, {
                    method: 'GET',
                    auth: true
                });

                if (!response.ok) {
                    setStatusError(response.status);
                    return;
                }

                const data = await response.json().catch(() => ({ items: [], total: 0, page: 1, size, pages: 1 }));
                setFacturas(data.items || []);
                setTotalPaginas(data.pages || 1);
                setTotalFacturas(data.total || 0);
                setPaginaActual(data.page || paginaActual);
                setStatusError(null);
            } catch (error) {
                console.error('Error en useFacturasAdmin:', error);
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerFacturas();
    }, [estado, numeroPedido, userEmail, enabled, paginaActual, size, recarga]);

    // Fuerza una nueva consulta (tras reintentar una factura o barrer pendientes)
    const recargar = useCallback(() => setRecarga((valor) => valor + 1), []);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    return { facturas, cargando, statusError, page: paginaActual, pages: totalPaginas, total: totalFacturas, cambiarPagina, recargar };
}
