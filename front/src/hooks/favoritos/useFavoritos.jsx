import { useCallback, useEffect, useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"
import { getSession } from "../../services/auth/session"

export default function useFavoritos() {
    const [favoritos, setFavoritos] = useState([])
    const [idsFavoritos, setIdsFavoritos] = useState(() => new Set())
    const [cargando, setCargando] = useState(false)
    const [statusError, setStatusError] = useState(null)
    const [autenticado, setAutenticado] = useState(Boolean(getSession()))

    const recargar = useCallback(async () => {
        if (!getSession()) {
            setAutenticado(false)
            return
        }
        setAutenticado(true)
        setCargando(true)
        setStatusError(null)
        try {
            const response = await tiendaRequest('/favoritos', { method: 'GET', auth: true })
            if (!response.ok) {
                setStatusError(response.status)
                return
            }
            const data = await response.json()
            setFavoritos(data || [])
            setIdsFavoritos(new Set((data || []).map((favorito) => favorito.producto_id)))
        } catch (error) {
            setStatusError(0)
            console.error('Error en useFavoritos:', error)
        } finally {
            setCargando(false)
        }
    }, [])

    useEffect(() => {
        recargar()
    }, [recargar])

    const alternarFavorito = useCallback(async (productoId) => {
        if (!getSession()) return { ok: false, requiereLogin: true }

        const esFavorito = idsFavoritos.has(productoId)

        setIdsFavoritos((prev) => {
            const siguientes = new Set(prev)
            if (esFavorito) siguientes.delete(productoId)
            else siguientes.add(productoId)
            return siguientes
        })

        try {
            const response = await tiendaRequest(`/favoritos/${productoId}`, {
                method: esFavorito ? 'DELETE' : 'POST',
                auth: true
            })
            if (!response.ok) {
                setIdsFavoritos((prev) => {
                    const anteriores = new Set(prev)
                    if (esFavorito) anteriores.add(productoId)
                    else anteriores.delete(productoId)
                    return anteriores
                })
                setStatusError(response.status)
                return { ok: false, status: response.status }
            }
            if (!esFavorito) {
                const data = await response.json().catch(() => null)
                if (data) setFavoritos((prev) => [...prev, data])
            } else {
                setFavoritos((prev) => prev.filter((favorito) => favorito.producto_id !== productoId))
            }
            return { ok: true, esFavorito: !esFavorito }
        } catch (error) {
            setIdsFavoritos((prev) => {
                const anteriores = new Set(prev)
                if (esFavorito) anteriores.add(productoId)
                else anteriores.delete(productoId)
                return anteriores
            })
            setStatusError(0)
            console.error('Error al alternar favorito:', error)
            return { ok: false }
        }
    }, [idsFavoritos])

    return { favoritos, idsFavoritos, cargando, statusError, autenticado, alternarFavorito, recargar }
}
