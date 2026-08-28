import { useState } from 'react';
import {
    CarouselContainer,
    CarouselTrack,
    CarouselImage,
    CarouselButton,
    DotsContainer,
    Dot
} from './ProductCarousel.styles';

const IMAGEN_FALLBACK = 'https://res.cloudinary.com/dfnnundpn/image/upload/v1781797763/sistema_1/mirsnducpj6tdy5hjewy.jpg';

const ProductCarousel = ({ imagenes = [], nombre = 'Producto' }) => {
    const imagenesDisponibles = imagenes.length > 0 ? imagenes : [IMAGEN_FALLBACK];
    const [indiceActual, setIndiceActual] = useState(0);

    const cambiarImagen = (direccion) => {
        setIndiceActual((indice) => (
            (indice + direccion + imagenesDisponibles.length) % imagenesDisponibles.length
        ));
    };

    return (
        <CarouselContainer>
            <CarouselTrack $indice={indiceActual}>
                {imagenesDisponibles.map((imagen, indice) => (
                    <CarouselImage
                        key={`${imagen}-${indice}`}
                        src={imagen}
                        alt={`${nombre} - imagen ${indice + 1}`}
                    />
                ))}
            </CarouselTrack>
            {imagenesDisponibles.length > 1 && (
                <>
                    <CarouselButton type="button" $left onClick={() => cambiarImagen(-1)} aria-label="Imagen anterior"></CarouselButton>
                    <CarouselButton type="button" onClick={() => cambiarImagen(1)} aria-label="Imagen siguiente"></CarouselButton>
                    <DotsContainer>
                        {imagenesDisponibles.map((imagen, indice) => (
                            <Dot
                                key={`${imagen}-${indice}`}
                                type="button"
                                $activo={indice === indiceActual}
                                onClick={() => setIndiceActual(indice)}
                                aria-label={`Ver imagen ${indice + 1}`}
                            />
                        ))}
                    </DotsContainer>
                </>
            )}
        </CarouselContainer>
    );
};

export default ProductCarousel;
