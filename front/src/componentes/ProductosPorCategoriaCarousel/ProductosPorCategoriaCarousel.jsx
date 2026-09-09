import useProductosPorCategoria from '../../hooks/productos/useProductosPorCategoria';
import Carousel from '../Carousel/Carousel';
import ProductoCard from '../Carousel/ProductoCard';

const ProductosPorCategoriaCarousel = ({ categoria }) => {
    const { productos, cargando, statusError } = useProductosPorCategoria(categoria?.id);

    if (cargando || statusError || productos.length === 0) return null;

    return (
        <Carousel
            items={productos}
            itemsVisibles={4}
            gapPx={12}
            titulo={{ texto: categoria.nombre, to: `/?categoria_id=${categoria.id}` }}
            renderItem={(producto) => (
                <ProductoCard key={producto.id} producto={producto} compacto />
            )}
        />
    );
};

export default ProductosPorCategoriaCarousel;