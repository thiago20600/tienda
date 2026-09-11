import useProductosOfertas from '../../hooks/productos/useProductosOfertas'
import Carousel from '../Carousel/Carousel'
import ProductoCard from '../Carousel/ProductoCard'

const ProductosOfertasCarousel = () => {
    const { productos, cargando, statusError } = useProductosOfertas(12)

    if (cargando || statusError || productos.length === 0) return null

    return (
        <Carousel
            items={productos}
            itemsVisibles={4}
            gapPx={12}
            titulo={{ texto: 'Ofertas', to: '/?ver=ofertas' }}
            renderItem={(producto) => (
                <ProductoCard key={producto.id} producto={producto} />
            )}
        />
    )
}

export default ProductosOfertasCarousel
