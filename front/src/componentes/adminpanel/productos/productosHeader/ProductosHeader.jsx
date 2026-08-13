import { HeaderContainer, AgregarProducto, ImportarProductos, ActionsGroup } from "./ProductosHeader.styles"
import Buscador from "../../Buscador/Buscador"

const ProductosHeader = () => {
    return (
        <HeaderContainer>
            <Buscador />
            <ActionsGroup>
                <ImportarProductos to="/admin/productos/importar">Importar productos</ImportarProductos>
                <AgregarProducto to="/admin/productos/nuevo">Agregar producto</AgregarProducto>
            </ActionsGroup>
        </HeaderContainer>
    )
}

export default ProductosHeader