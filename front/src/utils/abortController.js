export function crearSolicitudCancelable() {
    let version = 0

    return {
        async ejecutar(tarea) {
            const miVersion = ++version
            try {
                const resultado = await tarea()
                if (miVersion !== version) return { cancelada: true, valor: null }
                return { cancelada: false, valor: resultado }
            } catch (error) {
                if (miVersion !== version) return { cancelada: true, valor: null }
                throw error
            }
        },
        cancelar() {
            version += 1
        }
    }
}
