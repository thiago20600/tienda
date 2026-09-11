import { useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function usePedidoEfectivo() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const crearPedidoEfectivo = async () => {
        setCargando(true);
        setStatusError(null);
        try {
            const response = await tiendaRequest('/crear-orden-efectivo', {
                method: 'POST',
                auth: true,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setStatusError(response.status);
                return { ok: false, detalle: data.detail || null };
            }

            const pedido = await response.json();
            return { ok: true, pedido };
        } catch (error) {
            console.error('Error creando pedido en efectivo:', error);
            setStatusError(0);
            return { ok: false, detalle: null };
        } finally {
            setCargando(false);
        }
    };

    return { crearPedidoEfectivo, cargando, statusError };
}
