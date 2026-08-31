import { ImageContainer, ProductImageElement, PlaceholderImage } from "./ProductImageStyles";
import { useState } from "react";

const ProductImage = ({ imagenes }) => {
    const [imagenPrincipal, setImagenPrincipal] = useState(0)

    const ultimoIndice = (imagenes?.length || 0) - 1

    if (!imagenes || imagenes.length === 0) {
        return <PlaceholderImage src="https://res.cloudinary.com/dfnnundpn/image/upload/v1781797763/sistema_1/mirsnducpj6tdy5hjewy.jpg" alt="Imagen no disponible" />
    }

    return (
        <ImageContainer>
            <button onClick={() => setImagenPrincipal(imagenPrincipal === 0 ? ultimoIndice : imagenPrincipal - 1)}>◀</button>

            <ProductImageElement src={imagenes?.[imagenPrincipal]} alt="Producto" />

            <button onClick={() => setImagenPrincipal(imagenPrincipal === ultimoIndice ? 0 : imagenPrincipal + 1)}>▶</button>
        </ImageContainer>
    )
}

export default ProductImage;