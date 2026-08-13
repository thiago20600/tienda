import { ProductName, DescriptionTitle, ProductDescription, ProductDetailContainer } from './ProductDetailCardStyles'
import ProductImage from '../ProductImage/ProductImage'

const ProductDetailCard=({ producto })=>{
    return(
        <ProductDetailContainer>
            <ProductName>{producto.nombre}</ProductName>
            <ProductImage imagenes={producto.imagenes} />
            <DescriptionTitle>Descripcion</DescriptionTitle>
            <ProductDescription>{producto.descripcion}</ProductDescription>
        </ProductDetailContainer>
    )
}

export default ProductDetailCard