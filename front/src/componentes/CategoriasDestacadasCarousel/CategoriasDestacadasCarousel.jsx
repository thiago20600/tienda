import useCategoriasDestacadas from '../../hooks/categorias/useCategoriasDestacadas';
import ProductosPorCategoriaCarousel from '../ProductosPorCategoriaCarousel/ProductosPorCategoriaCarousel';
import Carousel from '../Carousel/Carousel';
import {
    CategoriasDestacadasWrapper,
    CategoriaCard,
    CategoriaNombre,
} from './CategoriasDestacadasCarousel.styles';

const CategoriasDestacadasCarousel = () => {
    const { categorias, cargando, statusError } = useCategoriasDestacadas();

    if (cargando || statusError || categorias.length === 0) return null;

    return (
        <CategoriasDestacadasWrapper>
            <Carousel
                items={categorias}
                itemsVisibles={5}
                gapPx={12}
                titulo={{ texto: 'Categorías destacadas' }}
                renderItem={(categoria) => {
                    const imagen = categoria.imagen_url?.[0] || null;
                    return (
                        <CategoriaCard
                            key={categoria.id}
                            to={`/?categoria_id=${categoria.id}`}
                            $imagen={imagen}
                        >
                            <CategoriaNombre $conImagen={Boolean(imagen)}>
                                {categoria.nombre}
                            </CategoriaNombre>
                        </CategoriaCard>
                    );
                }}
            />

            {categorias.map((categoria) => (
                <ProductosPorCategoriaCarousel key={categoria.id} categoria={categoria} />
            ))}
        </CategoriasDestacadasWrapper>
    );
};

export default CategoriasDestacadasCarousel;