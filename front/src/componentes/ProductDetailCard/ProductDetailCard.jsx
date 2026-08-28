import { ProductName, DescriptionTitle, ProductDescription, ProductDetailContainer } from './ProductDetailCardStyles'
import ProductCarousel from '../ProductCarousel/ProductCarousel'

const ProductDetailCard=({ producto })=>{
    return(
        <ProductDetailContainer>
            <ProductName>{producto.nombre}</ProductName>
            <ProductCarousel imagenes={producto.imagen_url} nombre={producto.nombre} />
            <DescriptionTitle>Descripcion</DescriptionTitle>
            <ProductDescription>{producto.descripcion || 'Este producto no tiene una descripción disponible.'}</ProductDescription>
        </ProductDetailContainer>
    )
}

export default ProductDetailCard