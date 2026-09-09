import PrecioProducto from '../PrecioProducto/PrecioProducto';
import {
    CardItem,
    Card,
    CardLink,
    Imagen,
    ImgWrap,
    TituloProducto,
    Info,
    Precio,
    NoDisponibleBar,
    UltimasUnidadesBar,
} from './ProductoCard.styles';

const IMAGEN_FALLBACK = 'https://res.cloudinary.com/dfnnundpn/image/upload/v1781797763/sistema_1/mirsnducpj6tdy5hjewy.jpg';

const ProductoCard = ({ producto, compacto = false }) => (
    <CardItem>
        <CardLink to={`/productos/${producto.id}`}>
            <Card>
                <ImgWrap>
                    <Imagen
                        src={producto.imagen_url?.[0] || IMAGEN_FALLBACK}
                        alt={producto.nombre}
                    />
                    {producto.stock === 0 && <NoDisponibleBar>No disponible</NoDisponibleBar>}
                    {producto.stock > 0 && producto.stock <= 4 && <UltimasUnidadesBar>Últimas unidades</UltimasUnidadesBar>}
                </ImgWrap>
                <TituloProducto>{producto.nombre}</TituloProducto>
                <Info>
                    <Precio>
                        <PrecioProducto precio={producto.precio} precioDescuento={producto.precio_descuento} compacto={compacto} />
                    </Precio>
                </Info>
            </Card>
        </CardLink>
    </CardItem>
);

export default ProductoCard;
