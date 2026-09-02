import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useAsignarPermisos() {
    const [statusError, setStatusError] = useState(null)

    const asignarPermisos = async (rolId, permisoIds) => {
        try {
            const response = await usuariosRequest(`/admin/roles/${rolId}/permisos`, {
                method: 'PUT',
                auth: true,
                body: { permiso_ids: permisoIds }
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

    return { asignarPermisos, statusError }
}
