import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useRestablecerContrasena() {
    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [statusError, setStatusError] = useState(null)
    const [exito, setExito] = useState(false)

    const restablecer = async (token, nuevaPassword) => {
        setEnviando(true)
        setMensaje(null)
        setStatusError(null)
        setExito(false)

        try {
            const response = await usuariosRequest('/reset-password', {
                method: 'POST',
                body: { token, nueva_password: nuevaPassword }
            })
            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                setStatusError(response.status)
                setMensaje(data.detail || 'No se pudo restablecer la contraseña.')
                return false
            }

            setExito(true)
            setMensaje(data.message || 'Contraseña actualizada. Ya podés iniciar sesión.')
            return true
        } catch (error) {
            console.error('Error al restablecer contraseña:', error)
            setStatusError(0)
            setMensaje('Error de conexión con el servidor.')
            return false
        } finally {
            setEnviando(false)
        }
    }

    return { restablecer, enviando, mensaje, statusError, exito }
}
