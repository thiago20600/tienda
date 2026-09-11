import { useState, useEffect } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useCategoriasDestacadas() {

    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const response = await tiendaRequest('/categorias/destacadas/con-productos?limite=12', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setCategorias(data)
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en useCategoriasDestacadas:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerCategorias()

    }, [])

    return { categorias, statusError, cargando }
}