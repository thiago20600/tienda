let vigente = true

export function crearControlCarga() {
    vigente = true
    return {
        esVigente: () => vigente,
        cancelar: () => { vigente = false }
    }
}
