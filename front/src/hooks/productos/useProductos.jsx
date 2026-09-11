import { useEffect, useState } from "react"
import useDebounce from "../../../utils/useDebounce"
import { crearSolicitudCancelable } from "../../utils/abortController"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useProductos(query = '', categoriaId = '', activo = true, page = 1, size = 12, ofertas = false, ordenarPor = '', orden = 'asc', destacados = false) {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const termino = useDebounce(query, 500).trim()

    useEffect(() => {
        const solicitud = crearSolicitudCancelable()

        const obtenerProductos = async () => {
            if (!activo) {
                setProductos([])
                setCargando(false)
                setStatusError(null)
                setPages(1)
                setTotal(0)
                return
            }

            setCargando(true)
            try {
                if (destacados) {
                    const { cancelada, valor: response } = await solicitud.ejecutar(() =>
                        tiendaRequest(`/productos/destacados?limite=${size}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        })
                    )
                    if (cancelada) return
                    if (!response.ok) {
                        setStatusError(response.status)
                        return
                    }
                    const data = await response.json()
                    const items = Array.isArray(data) ? data : []
                    setProductos(items)
                    setPages(1)
                    setTotal(items.length)
                    setStatusError(null)
                    return
                }

                const parametros = new URLSearchParams({
                    page: String(page),
                    size: String(size),
                })
                if (termino) parametros.set('q', termino)
                if (categoriaId) parametros.set('categoria_id', categoriaId)
                if (ofertas) parametros.set('ofertas', 'true')
                if (ordenarPor) {
                    parametros.set('ordenar_por', ordenarPor)
                    parametros.set('orden', orden)
                }
                const { cancelada, valor: response } = await solicitud.ejecutar(() =>
                    tiendaRequest(`/productos?${parametros.toString()}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                )
                if (cancelada) return
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setProductos(data.items || [])
                    setPages(data.pages || 1)
                    setTotal(data.total || 0)
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en useProductos:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerProductos()
        return () => solicitud.cancelar()

    }, [termino, categoriaId, activo, page, size, ofertas, ordenarPor, orden, destacados])

    return { productos, statusError, cargando, page, pages, total }
}
