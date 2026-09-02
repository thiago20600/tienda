import { useState } from "react"
import { usuariosRequest } from "../../services/api/apiClient"

export default function useCrearRol() {
    const [statusError, setStatusError] = useState(null)

    const crearRol = async (data) => {
        try {
            const response = await usuariosRequest('/admin/roles', {
                method: 'POST',
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

    return { crearRol, statusError }
}
