import { HeaderContainer, ImportarProductos, ActionsGroup } from "./ProductosHeader.styles"
import Buscador from "../../Buscador/Buscador"
import AdminButton from "../../ui/AdminButton/AdminButton"

const ProductosHeader = () => {
    return (
        <HeaderContainer>
            <ActionsGroup>
                <ImportarProductos to="/admin/productos/importar">Importar productos</ImportarProductos>
                <AdminButton to="/admin/productos/nuevo">Agregar producto</AdminButton>
            </ActionsGroup>
        </HeaderContainer>
    )
}

export default ProductosHeader