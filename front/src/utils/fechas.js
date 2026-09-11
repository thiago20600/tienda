export function formatearFecha(valor) {
    if (!valor) return '-'
    const fecha = new Date(valor)
    if (Number.isNaN(fecha.getTime())) return '-'
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
