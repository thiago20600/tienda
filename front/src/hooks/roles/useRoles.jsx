import { useState, useEffect, useCallback } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useRoles() {
    const [roles, setRoles] = useState([])
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)

    const cargarRoles = useCallback(async () => {
        setCargando(true)
        try {
            const response = await usuariosRequest('/admin/roles', {
                method: 'GET',
                auth: true
            })
            if (!response.ok) {
                setStatusError(response.status)
            } else {
                const data = await response.json()
                setRoles(data)
                setStatusError(null)
            }
        } catch (error) {
            setStatusError(0)
            console.error('Error en useRoles:', error)
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        cargarRoles()
    }, [cargarRoles])

    return { roles, statusError, cargando, recargarRoles: cargarRoles }
}
