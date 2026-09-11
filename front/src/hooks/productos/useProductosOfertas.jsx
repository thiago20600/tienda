import { useState, useEffect } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useProductosOfertas(limite = 12, activo = true) {

    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)

    useEffect(() => {
        if (!activo) {
            setProductos([])
            setCargando(false)
            setStatusError(null)
            return
        }

        const obtenerProductos = async () => {
            try {
                const response = await tiendaRequest(`/productos/ofertas?limite=${limite}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setProductos(data)
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en useProductosOfertas:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerProductos()

    }, [limite, activo])

    return { productos, statusError, cargando }
}
