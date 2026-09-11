import { useState, useEffect } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useCategoria(categoriaId) {
    const [categoria, setCategoria] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [statusError, setStatusError] = useState(null)

    useEffect(() => {
        if (!categoriaId) {
            setCategoria(null)
            return
        }
        const cargarCategoria = async () => {
            setCargando(true)
            setStatusError(null)
            try {
                const response = await tiendaRequest(`/categorias/${categoriaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    setStatusError(response.status)
                    setCategoria(null)
                } else {
                    const data = await response.json()
                    setCategoria(data)
                }
            } catch (error) {
                setStatusError(0)
                setCategoria(null)
                console.error('Error en useCategoria:', error)
            } finally {
                setCargando(false)
            }
        }
        cargarCategoria()
    }, [categoriaId])

    return { categoria, statusError, cargando }
}
