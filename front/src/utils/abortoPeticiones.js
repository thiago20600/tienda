export function crearControladorAborto() {
    if (typeof AbortController === 'undefined') {
        return { signal: undefined, abort: () => {} }
    }
    const controlador = new AbortController()
    return { signal: controlador.signal, abort: () => controlador.abort() }
}

export function esErrorAborto(error) {
    return error?.name === 'AbortError'
}
