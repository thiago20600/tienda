import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useImagenCategoria() {
    const [subiendo, setSubiendo] = useState(false)
    const [statusError, setStatusError] = useState(null)

    const subirImagen = async (categoriaId, archivo) => {
        if (!archivo) return null
        setSubiendo(true)
        setStatusError(null)
        try {
            const formData = new FormData()
            formData.append('imagen', archivo)
            const response = await tiendaRequest(`/categorias/${categoriaId}/imagen`, {
                method: 'POST',
                auth: true,
                body: formData
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setStatusError(data.detail || 'No se pudo subir la imagen.')
                return null
            }
            return data
        } catch (error) {
            setStatusError('Error de conexión con el servidor.')
            console.error('Error en useImagenCategoria:', error)
            return null
        } finally {
            setSubiendo(false)
        }
    }

    return { subirImagen, subiendo, statusError }
}
