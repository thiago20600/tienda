import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useActualizarStockProducto() {

    const [statusError, setStatusError] = useState(null)
    const [actualizando, setActualizando] = useState(null)

    const actualizarStock = async (id, stock) => {
        setActualizando(id)
        setStatusError(null)

        try {
            const response = await tiendaRequest(`/productos/${id}`, {
                method: "PATCH",
                auth: true,
                body: { stock: Number(stock) }
            })

            if (!response.ok) {
                setStatusError(response.status)
                return { ok: false }
            }

            return { ok: true }
        } catch (error) {
            console.error("Error actualizando stock:", error)
            setStatusError(0)
            return { ok: false }
        } finally {
            setActualizando(null)
        }
    }

    return { actualizarStock, statusError, actualizando }
}
