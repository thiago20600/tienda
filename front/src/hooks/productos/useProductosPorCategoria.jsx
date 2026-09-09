import { useEffect, useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductosPorCategoria(categoriaId) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);

    useEffect(() => {
        const controlador = new AbortController();

        const obtenerProductos = async () => {
            if (!categoriaId) {
                setProductos([]);
                setStatusError(null);
                setCargando(false);
                return;
            }

            setCargando(true);
            try {
                const response = await tiendaRequest(`/productos?categoria_id=${categoriaId}&size=12`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controlador.signal
                });
                if (!response.ok) {
                    setStatusError(response.status);
                } else {
                    const data = await response.json();
                    setProductos(data.items || []);
                    setStatusError(null);
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                setStatusError(0);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductos();
        return () => controlador.abort();
    }, [categoriaId]);

    return { productos, cargando, statusError };
}