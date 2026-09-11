const OPCIONES = [
    { valor: '', etiqueta: 'Más recientes' },
    { valor: 'precio_asc', etiqueta: 'Precio: menor a mayor' },
    { valor: 'precio_desc', etiqueta: 'Precio: mayor a menor' },
    { valor: 'nombre_asc', etiqueta: 'Nombre: A a Z' },
    { valor: 'nombre_desc', etiqueta: 'Nombre: Z a A' },
]

const ProductosOrden = ({ valor, onChange }) => {
    return (
        <label>
            Ordenar por:{' '}
            <select value={valor} onChange={(e) => onChange(e.target.value)}>
                {OPCIONES.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                        {opcion.etiqueta}
                    </option>
                ))}
            </select>
        </label>
    )
}

export default ProductosOrden
