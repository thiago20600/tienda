import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useActualizarRol() {
    const [statusError, setStatusError] = useState(null)

    const actualizarRol = async (rolId, data) => {
        try {
            const response = await usuariosRequest(`/admin/roles/${rolId}`, {
                method: 'PUT',
                auth: true,
                body: data
            })
            const responseData = await response.json().catch(() => ({}))
            if (!response.ok) {
                setStatusError(response.status)
                return { ok: false, data: responseData }
            }
            setStatusError(null)
            return { ok: true, data: responseData }
        } catch (error) {
            setStatusError(0)
            return { ok: false, data: null }
        }
    }

    return { actualizarRol, statusError }
}
