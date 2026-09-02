import { useState, useEffect } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function usePermisos() {
    const [permisos, setPermisos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)

    useEffect(() => {
        const cargarPermisos = async () => {
            try {
                const response = await usuariosRequest('/admin/permisos', {
                    method: 'GET',
                    auth: true
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setPermisos(data)
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en usePermisos:', error)
            } finally {
                setCargando(false)
            }
        }

        cargarPermisos()
    }, [])

    return { permisos, statusError, cargando }
}
