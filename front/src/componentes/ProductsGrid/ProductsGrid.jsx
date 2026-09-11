import ProductCard from "../ProductCard/ProductCard"
import { ProductsListContainer, EmptyProducts } from "../ProductsList/ProductsListStyles"
import ProductoCard from "../Carousel/ProductoCard"

const ProductsGrid = ({ productos = [], mensajeVacio = {} }) => {
    if (!productos.length) {
        return (
            <EmptyProducts>
                <h2>{mensajeVacio.titulo || 'No encontramos productos'}</h2>
                <p>{mensajeVacio.subtitulo || 'Probá con otra búsqueda o elegí una categoría diferente.'}</p>
            </EmptyProducts>
        )
    }

    return (
        <ProductsListContainer>
            {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
            ))}
        </ProductsListContainer>
    )
}

export default ProductsGrid
