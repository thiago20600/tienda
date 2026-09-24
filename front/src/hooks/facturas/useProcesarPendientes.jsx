import { useState } from 'react';
import { facturacionRequest } from '../../services/api/apiClient';

// Barrida manual de emision (POST /facturas/procesar-pendientes): reclama en el microservicio
// las facturas vencidas y las que quedaron colgadas en `procesando`, y las encola.
export default function useProcesarPendientes() {
    const [procesando, setProcesando] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const procesarPendientes = async () => {
        setProcesando(true);
        try {
            const response = await facturacionRequest('/facturas/procesar-pendientes', {
                method: 'POST',
                auth: true,
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatusError(response.status);
                return { ok: false, status: response.status, detalle: data.detail };
            }

            setStatusError(null);
            return { ok: true, reclamadas: data.reclamadas || 0 };
        } catch (error) {
            console.error('Error en useProcesarPendientes:', error);
            setStatusError(0);
            return { ok: false, status: 0, detalle: 'Error al conectar con el servicio de facturación.' };
        } finally {
            setProcesando(false);
        }
    };

    return { procesarPendientes, procesando, statusError };
}
