import ProductCard from "../ProductCard/ProductCard"
import { ProductsListContainer, EmptyProducts } from "./ProductsListStyles"

const ProductsList = ({productos}) => {
    if (!productos.length) {
        return (
            <EmptyProducts>
                <h2>No encontramos productos</h2>
                <p>Probá con otra búsqueda o elegí una categoría diferente.</p>
            </EmptyProducts>
        )
    }

    return (
    <ProductsListContainer>
        {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto}/>
            ))
        }

    </ProductsListContainer>
    )
}

export default ProductsList