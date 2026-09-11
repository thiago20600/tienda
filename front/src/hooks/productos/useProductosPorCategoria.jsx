import { useEffect, useState } from "react";
import { crearSolicitudCancelable } from "../../utils/abortController";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductosPorCategoria(categoriaId) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);

    useEffect(() => {
        const solicitud = crearSolicitudCancelable();

        const obtenerProductos = async () => {
            if (!categoriaId) {
                setProductos([]);
                setStatusError(null);
                setCargando(false);
                return;
            }

            setCargando(true);
            try {
                const { cancelada, valor: response } = await solicitud.ejecutar(() =>
                    tiendaRequest(`/productos?categoria_id=${categoriaId}&size=12`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                );
                if (cancelada) return;
                if (!response.ok) {
                    setStatusError(response.status);
                } else {
                    const data = await response.json();
                    setProductos(data.items || []);
                    setStatusError(null);
                }
            } catch (error) {
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductos();
        return () => solicitud.cancelar();
    }, [categoriaId]);

    return { productos, cargando, statusError };
}