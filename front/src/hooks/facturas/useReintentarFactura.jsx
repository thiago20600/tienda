import { useState } from 'react';
import { facturacionRequest } from '../../services/api/apiClient';

// Reintento manual de una factura fallida (POST /facturas/{id}/reintentar).
export default function useReintentarFactura() {
    const [reintentando, setReintentando] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const reintentar = async (facturaId) => {
        setReintentando(true);
        try {
            const response = await facturacionRequest(`/facturas/${facturaId}/reintentar`, {
                method: 'POST',
                auth: true,
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatusError(response.status);
                return { ok: false, status: response.status, detalle: data.detail };
            }

            setStatusError(null);
            return { ok: true, factura: data };
        } catch (error) {
            console.error('Error en useReintentarFactura:', error);
            setStatusError(0);
            return { ok: false, status: 0, detalle: 'Error al conectar con el servicio de facturación.' };
        } finally {
            setReintentando(false);
        }
    };

    return { reintentar, reintentando, statusError };
}
