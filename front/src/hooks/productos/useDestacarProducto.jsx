import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useDestacarProducto() {

    const [statusError, setStatusError] = useState(null)
    const [actualizando, setActualizando] = useState(null)

    const toggleDestacado = async (id, valorActual) => {
        setActualizando(id)
        setStatusError(null)

        try {
            const response = await tiendaRequest(`/productos/${id}`, {
                method: "PATCH",
                auth: true,
                body: { destacado: !valorActual }
            })

            if (!response.ok) {
                setStatusError(response.status)
                return { ok: false, data: await response.json().catch(() => ({})) }
            }

            const data = await response.json()
            return { ok: true, data }
        } catch (error) {
            console.error("Error cambiando destacado de producto:", error)
            setStatusError(0)
            return { ok: false, data: null }
        } finally {
            setActualizando(null)
        }
    }

    return { toggleDestacado, statusError, actualizando }
}
