export const agruparPermisosPorModulo = (permisos) => {
    return permisos.reduce((acc, permiso) => {
        const partes = permiso.nombre.split(':')
        const modulo = partes[0] || 'general'

        if (!acc[modulo]) acc[modulo] = []
        acc[modulo].push({
            ...permiso,
            accion: partes[1] || '',
            alcance: partes[2] || ''
        })
        return acc
    }, {})
}

export const obtenerEtiquetaPermiso = (accion, alcance) => {
    const accionesMap = {
        create: 'Crear',
        read: 'Ver',
        update: 'Editar',
        delete: 'Eliminar'
    }

    const textoAccion = accionesMap[accion] || accion
    if (!alcance) return textoAccion
    return alcance === 'admin' ? `${textoAccion} (Todos)` : `${textoAccion} (Propios)`
}