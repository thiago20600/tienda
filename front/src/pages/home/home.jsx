import ProductsList from "../../componentes/ProductsList/ProductsList"
import { useOutletContext } from "react-router-dom"
import useProductos from "../../hooks/productos/useProductos"
import { useSearchParams } from "react-router-dom"

const Home = () => {

    const { query } = useOutletContext()
    const [searchParams] = useSearchParams()
    const categoriaId = searchParams.get('categoria_id') || ''
    const { productos, cargando, statusError } = useProductos(query, categoriaId)

    if (cargando) return <p>Cargando productos...</p>
    if (statusError) return <p>No se pudieron cargar los productos.</p>

    return (
        <ProductsList productos={productos} />
    )
}

export default Home