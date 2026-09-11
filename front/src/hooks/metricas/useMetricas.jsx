import { useEffect, useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useMetricas(enabled = true) {
    const [metricas, setMetricas] = useState(null)
    const [cargando, setCargando] = useState(enabled)
    const [statusError, setStatusError] = useState(null)

    useEffect(() => {
        if (!enabled) return

        const obtenerMetricas = async () => {
            setCargando(true)
            try {
                const response = await tiendaRequest('/admin/metricas', {
                    method: 'GET',
                    auth: true
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    setMetricas(await response.json())
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en useMetricas:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerMetricas()
    }, [enabled])

    return {
        metricas: enabled ? metricas : null,
        cargando: enabled ? cargando : false,
        statusError: enabled ? statusError : null
    }
}