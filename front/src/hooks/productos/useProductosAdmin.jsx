import { useEffect, useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductosAdmin({
    q = '',
    categoriaId = '',
    estado = '',
    ofertas = false,
    destacados = false,
    precioMin = '',
    precioMax = '',
    stockMin = '',
    stockMax = '',
    sku = '',
    ordenarPor = '',
    orden = 'asc',
    page = 1,
    size = 10
} = {}) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(page);
    const [sizeActual, setSizeActual] = useState(size);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        const obtenerProductos = async () => {
            setCargando(true);
            try {
                const query = new URLSearchParams({
                    page: String(paginaActual),
                    size: String(sizeActual),
                });

                if (q) query.set('q', q);
                if (categoriaId) query.set('categoria_id', categoriaId);
                if (estado !== '') {
                    // Convertir string 'true'/'false' a booleano para el backend
                    query.set('estado', estado === 'true' ? 'true' : 'false');
                }
                if (ofertas) query.set('ofertas', 'true');
                if (destacados) query.set('destacados', 'true');
                if (precioMin) query.set('precio_min', precioMin);
                if (precioMax) query.set('precio_max', precioMax);
                if (stockMin) query.set('stock_min', stockMin);
                if (stockMax) query.set('stock_max', stockMax);
                if (sku) query.set('sku', sku);
                if (ordenarPor) query.set('ordenar_por', ordenarPor);
                query.set('orden', orden);

                const response = await tiendaRequest(
                    `/admin/productos?${query.toString()}`,
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
    }, [paginaActual, sizeActual, q, categoriaId, estado, ofertas, destacados, precioMin, precioMax, stockMin, stockMax, sku, ordenarPor, orden]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= pages) {
            setPaginaActual(nuevaPagina);
        }
    };

    const cambiarSize = (nuevoSize) => {
        setSizeActual(nuevoSize);
        setPaginaActual(1);
    };

    return {
        productos,
        cargando,
        statusError,
        page: paginaActual,
        size: sizeActual,
        total,
        pages,
        cambiarPagina,
        cambiarSize
    };
}