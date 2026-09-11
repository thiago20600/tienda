import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useRecuperarContrasena() {
    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [statusError, setStatusError] = useState(null)

    const solicitarRecuperacion = async (email) => {
        setEnviando(true)
        setMensaje(null)
        setStatusError(null)

        try {
            const response = await usuariosRequest('/forgot-password', {
                method: 'POST',
                body: { email }
            })
            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                setStatusError(response.status)
                setMensaje(data.detail || 'No se pudo procesar la solicitud.')
                return false
            }

            setMensaje(data.message || 'Si el email está registrado, vas a recibir un enlace para restablecer la contraseña.')
            return true
        } catch (error) {
            console.error('Error al solicitar recuperación:', error)
            setStatusError(0)
            setMensaje('Error de conexión con el servidor.')
            return false
        } finally {
            setEnviando(false)
        }
    }

    return { solicitarRecuperacion, enviando, mensaje, statusError }
}
