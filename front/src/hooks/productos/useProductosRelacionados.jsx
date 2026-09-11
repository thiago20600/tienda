import { useEffect, useState } from "react";
import { crearSolicitudCancelable } from "../../utils/abortController";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductosRelacionados(productoId, limite = 4) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);

    useEffect(() => {
        if (!productoId) return;
        const solicitud = crearSolicitudCancelable();

        const obtenerRelacionados = async () => {
            setCargando(true);
            try {
                const { cancelada, valor: response } = await solicitud.ejecutar(() =>
                    tiendaRequest(`/productos/${productoId}/relacionados?limite=${limite}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                );
                if (cancelada) return;
                if (!response.ok) {
                    setStatusError(response.status);
                    return;
                }
                const data = await response.json();
                setProductos(Array.isArray(data) ? data : []);
                setStatusError(null);
            } catch (error) {
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerRelacionados();
        return () => solicitud.cancelar();
    }, [productoId, limite]);

    return { productos, cargando, statusError };
}
