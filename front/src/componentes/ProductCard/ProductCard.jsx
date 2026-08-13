import { ProductCardContainer } from "./ProductCardStyles"
import { ProductInfo } from "./ProductCardStyles"
import { ProductTitle } from "./ProductCardStyles"
import { ProductItem } from "./ProductCardStyles"
import { Link } from "react-router-dom"
import { ProductLink } from "./ProductCardStyles"

const ProductCard = ({ producto }) => {
    return (
        <ProductLink to={`/productos/${producto.id}`}>
            <ProductCardContainer>
                
                <ProductTitle>{producto.nombre}</ProductTitle>

                <ProductInfo>
                    <ProductItem>precio: ${producto.precio}</ProductItem>
                    <ProductItem>stock: {producto.stock}</ProductItem>
                </ProductInfo>
            </ProductCardContainer>
        </ProductLink>
    )
}

export default ProductCard