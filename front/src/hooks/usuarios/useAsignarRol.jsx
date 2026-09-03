import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useAsignarRol() {
    const [statusError, setStatusError] = useState(null)

    const asignarRol = async (userId, rolId) => {
        try {
            const response = await usuariosRequest(`/users/${userId}/roles/${rolId}`, {
                method: 'PATCH',
                auth: true
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

    return { asignarRol, statusError }
}