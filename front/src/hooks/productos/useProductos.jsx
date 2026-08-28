import { useEffect, useState } from "react";
import useDebounce from "../../../utils/useDebounce";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useProductos(query = '', categoriaId = '') {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null) 
    const termino = useDebounce(query, 500).trim()

    useEffect(() => {
        const controlador = new AbortController()

        const obtenerProductos = async () => {
            setCargando(true)
            try {
                const parametros = new URLSearchParams()
                if (termino) parametros.set('q', termino)
                if (categoriaId) parametros.set('categoria_id', categoriaId)
                const queryString = parametros.toString()
                const response = await tiendaRequest(`/productos${queryString ? `?${queryString}` : ''}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controlador.signal
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setProductos(data.items || [])
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

    }, [termino, categoriaId])

    return { productos, statusError, cargando }
}