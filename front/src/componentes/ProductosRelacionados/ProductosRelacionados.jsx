import ProductCard from "../ProductCard/ProductCard";
import useProductosRelacionados from "../../hooks/productos/useProductosRelacionados";
import { SeccionRelacionados, TituloRelacionados, GrillaRelacionados } from "./ProductosRelacionados.styles";

const ProductosRelacionados = ({ productoId, limite = 4 }) => {
    const { productos, cargando, statusError } = useProductosRelacionados(productoId, limite);

    if (cargando || statusError || productos.length === 0) return null;

    return (
        <SeccionRelacionados>
            <TituloRelacionados>También te puede interesar</TituloRelacionados>
            <GrillaRelacionados>
                {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                ))}
            </GrillaRelacionados>
        </SeccionRelacionados>
    );
};

export default ProductosRelacionados;
