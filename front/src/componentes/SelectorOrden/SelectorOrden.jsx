import { CampoSelect, BotonDireccion, ContenedorOrden } from './SelectorOrden.styles'

const OPCIONES_ORDEN = [
    { value: '', label: 'Ordenar por' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' },
    { value: 'stock', label: 'Stock' },
    { value: 'created_at', label: 'Novedades' },
]

const SelectorOrden = ({ campo = '', direccion = 'asc', onCambiar }) => {
    const cambiarCampo = (event) => onCambiar(event.target.value, direccion)
    const alternarDireccion = () => onCambiar(campo, direccion === 'asc' ? 'desc' : 'asc')

    return (
        <ContenedorOrden>
            <CampoSelect value={campo} onChange={cambiarCampo} aria-label="Ordenar productos">
                {OPCIONES_ORDEN.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                ))}
            </CampoSelect>
            <BotonDireccion
                type="button"
                onClick={alternarDireccion}
                disabled={!campo}
                title={direccion === 'asc' ? 'Ascendente' : 'Descendente'}
            >
                {direccion === 'asc' ? '↑' : '↓'}
            </BotonDireccion>
        </ContenedorOrden>
    )
}

export default SelectorOrden
