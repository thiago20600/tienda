import Carousel from '../Carousel/Carousel';
import ProductoCard from '../Carousel/ProductoCard';
import {
    CategoriaBanner,
    CategoriaBannerBg,
    CategoriaBannerOverlay,
    CategoriaBannerTitle,
    CategoriaBannerLink,
} from './ProductosPorCategoriaCarousel.styles';

const ProductosPorCategoriaCarousel = ({ categoria }) => {
    const productos = categoria?.productos || [];
    const imagen = categoria?.imagen_url?.[0] || null;

    if (productos.length === 0) return null;

    return (
        <>
            {imagen && (
                <CategoriaBanner>
                    <CategoriaBannerBg $imagen={imagen} />
                    <CategoriaBannerOverlay>
                        <CategoriaBannerTitle>{categoria.nombre}</CategoriaBannerTitle>
                        <CategoriaBannerLink to={`/?categoria_id=${categoria.id}`}>
                            Ver todos
                        </CategoriaBannerLink>
                    </CategoriaBannerOverlay>
                </CategoriaBanner>
            )}

            <Carousel
                items={productos}
                itemsVisibles={4}
                gapPx={12}
                titulo={{ texto: categoria.nombre, to: `/?categoria_id=${categoria.id}` }}
                renderItem={(producto) => (
                    <ProductoCard key={producto.id} producto={producto} compacto />
                )}
            />
        </>
    );
};

export default ProductosPorCategoriaCarousel;