import { useState, useEffect, useCallback } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useConfiguracion() {
    const [configuracion, setConfiguracion] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [statusError, setStatusError] = useState(null)
    const [actualizando, setActualizando] = useState(false)

    const obtenerConfiguracion = useCallback(async () => {
        setCargando(true)
        setStatusError(null)
        try {
            const response = await tiendaRequest('/configuracion', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) {
                setStatusError(response.status)
            } else {
                const data = await response.json()
                setConfiguracion(data)
            }
        } catch (error) {
            setStatusError(0)
            console.error('Error en useConfiguracion:', error)
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        obtenerConfiguracion()
    }, [obtenerConfiguracion])

    const actualizarConfiguracion = async (datos) => {
        setActualizando(true)
        setStatusError(null)
        try {
            const response = await tiendaRequest('/configuracion', {
                method: 'PATCH',
                auth: true,
                body: datos
            })
            if (!response.ok) {
                setStatusError(response.status)
                return null
            }
            const data = await response.json()
            setConfiguracion(data)
            return data
        } catch (error) {
            setStatusError(0)
            console.error('Error al actualizar configuracion:', error)
            return null
        } finally {
            setActualizando(false)
        }
    }

    const subirLogo = async (archivo) => {
        setActualizando(true)
        setStatusError(null)
        try {
            const formData = new FormData()
            formData.append('imagen', archivo)
            const response = await tiendaRequest('/configuracion/logo', {
                method: 'POST',
                auth: true,
                body: formData
            })
            if (!response.ok) {
                setStatusError(response.status)
                return null
            }
            const data = await response.json()
            setConfiguracion(data)
            return data
        } catch (error) {
            setStatusError(0)
            console.error('Error al subir logo:', error)
            return null
        } finally {
            setActualizando(false)
        }
    }

    return {
        configuracion,
        cargando,
        statusError,
        actualizando,
        actualizarConfiguracion,
        subirLogo,
        recargar: obtenerConfiguracion
    }
}
