import { ProductCardContainer } from "./ProductCardStyles"
import { ProductInfo } from "./ProductCardStyles"
import { ProductTitle } from "./ProductCardStyles"
import { ProductItem } from "./ProductCardStyles"
import { ProductLink } from "./ProductCardStyles"
import { ProductImage } from "./ProductCardStyles"
import PrecioProducto from "../PrecioProducto/PrecioProducto"
import { UltimasUnidadesBar, NoDisponibleBar } from "./ProductCardStyles"

const IMAGEN_FALLBACK = 'https://res.cloudinary.com/dfnnundpn/image/upload/v1781797763/sistema_1/mirsnducpj6tdy5hjewy.jpg';

const ProductCard = ({ producto }) => {
    return (
        <ProductLink to={`/productos/${producto.id}`}>
            <ProductCardContainer>
                <ProductImage
                    src={producto.imagen_url?.[0] || IMAGEN_FALLBACK}
                    alt={producto.nombre}
                />
                {producto.stock === 0 && <NoDisponibleBar>No disponible</NoDisponibleBar>}
                {producto.stock > 0 && producto.stock <= 4 && <UltimasUnidadesBar>Ultimas unidades</UltimasUnidadesBar>}                
                <ProductTitle>{producto.nombre}</ProductTitle>

                <ProductInfo>
                    <PrecioProducto precio={producto.precio} precioDescuento={producto.precio_descuento} compacto />
                </ProductInfo>
                
            </ProductCardContainer>
        </ProductLink>
    )
}

export default ProductCard