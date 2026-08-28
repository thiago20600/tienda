import { useEffect, useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductosAdmin({ q = '', categoriaId = '' } = {}) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        const obtenerProductos = async () => {
            setCargando(true);
            try {
                    const response = await tiendaRequest(
                    `/admin/productos?page=${page}&size=${size}&q=${encodeURIComponent(q)}${categoriaId ? `&categoria_id=${categoriaId}` : ''}`,
                    {
                        method: 'GET',
                        auth: true
                    }
                );
                if (!response.ok) {
                    setStatusError(response.status);
                } else {
                    const data = await response.json();
                    setProductos(data.items || []);
                    setTotal(data.total || 0);
                    setPages(data.pages || 0);
                    setStatusError(null);
                }
            } catch (error) {
                setStatusError(0);
                console.error('Error en useProductosAdmin:', error);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductos();
    }, [page, size, q, categoriaId]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= pages) {
            setPage(nuevaPagina);
        }
    };

    const cambiarSize = (nuevoSize) => {
        setSize(nuevoSize);
        setPage(1);
    };

    return {
        productos,
        cargando,
        statusError,
        page,
        size,
        total,
        pages,
        cambiarPagina,
        cambiarSize
    };
}