import useProductosDestacados from '../../hooks/productos/useProductosDestacados';
import Carousel from '../Carousel/Carousel';
import ProductoCard from '../Carousel/ProductoCard';

const ProductosDestacadosCarousel = () => {
    const { productos, cargando, statusError } = useProductosDestacados(10);

    if (cargando || statusError || productos.length === 0) return null;

    return (
        <Carousel
            items={productos}
            itemsVisibles={4}
            gapPx={12}
            titulo={{ texto: 'Productos destacados', to: '/?ver=destacados' }}
            renderItem={(producto) => (
                <ProductoCard key={producto.id} producto={producto} />
            )}
        />
    );
};

export default ProductosDestacadosCarousel;
