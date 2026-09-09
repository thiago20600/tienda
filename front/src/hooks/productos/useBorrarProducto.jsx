import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useBorrarProducto() {

    const [statusError, setStatusError] = useState(null)
    const [message, setMessage] = useState(null)
    const [eliminando, setEliminando] = useState(null)

    const eliminarProducto = async (id) => {
        setEliminando(id)
        setStatusError(null)
        setMessage(null)

        try {
            const response = await tiendaRequest(`/admin/productos/${id}`, {
                method: "DELETE",
                auth: true,
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                setStatusError(response.status)
                setMessage(data.detail || "No se pudo eliminar el producto")
                return { ok: false, data }
            }

            setMessage("Producto eliminado correctamente")
            return { ok: true, data }
        } catch (error) {
            setStatusError(0)
            setMessage("Error de conexión al eliminar el producto")
            return { ok: false, data: null }
        } finally {
            setEliminando(null)
        }
    }

    return { eliminarProducto, message, statusError, eliminando }
}