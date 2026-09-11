import { useEffect, useState } from "react";
import useDebounce from "../../../utils/useDebounce";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductos(query = '', categoriaId = '', activo = true, page = 1, size = 12, ofertas = false) {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)
    const [paginaActual, setPaginaActual] = useState(page)
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const termino = useDebounce(query, 500).trim()

    useEffect(() => {
        if (!activo) {
            setProductos([])
            setCargando(false)
            setStatusError(null)
            setPaginaActual(1)
            setPages(1)
            setTotal(0)
            return
        }

        const controlador = new AbortController()

        const obtenerProductos = async () => {
            setCargando(true)
            try {
                const parametros = new URLSearchParams({
                    page: String(paginaActual),
                    size: String(size),
                })
                if (termino) parametros.set('q', termino)
                if (categoriaId) parametros.set('categoria_id', categoriaId)
                if (ofertas) parametros.set('ofertas', 'true')
                const queryString = parametros.toString()
                const response = await tiendaRequest(`/productos?${queryString}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controlador.signal
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setProductos(data.items || [])
                    setPages(data.pages || 1)
                    setTotal(data.total || 0)
                    setPaginaActual(data.page || paginaActual)
                    setStatusError(null)
                }
            } catch (error) {
                if (error.name === 'AbortError') return
                setStatusError(0)
                console.error('Error en useProductos:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerProductos()
        return () => controlador.abort()

    }, [termino, categoriaId, activo, paginaActual, size, ofertas])

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= pages) {
            setPaginaActual(nuevaPagina)
        }
    }

    return { productos, statusError, cargando, page: paginaActual, pages, total, cambiarPagina }
}