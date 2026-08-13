import ProductCard from "../ProductCard/ProductCard"
import { ProductsListContainer } from "./ProductsListStyles"

const ProductsList = ({productos}) => {
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