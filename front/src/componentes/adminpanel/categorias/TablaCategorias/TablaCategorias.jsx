import useCategorias from "../../../../hooks/categorias/useCategorias"
import { CategoriasTabla, BotonEliminar } from "./TablaCategorias.styles";
import useOrdenamiento from "../../../../hooks/useOrdenar";
import { NavLink } from "react-router-dom";
import useEliminarCategoria from "../../../../hooks/categorias/useEliminarCategoria";

const TablaCategorias = ({ sortConfig }) => {

    const { eliminarCategoria, statusErrorEliminar } = useEliminarCategoria()
    const { categorias, statusError, cargando } = useCategorias()
    const { datosOrdenados } = useOrdenamiento(categorias, sortConfig);
    if (statusError === 401) {
        return <div>No autorizado</div>
    }
    if (statusError === 404) {
        return <div>No se encontraron categorias</div>
    }
    
    if (cargando) {
        return <div>Cargando categorias...</div>;
    } 
        

    return (
        <div>
            <CategoriasTabla>
                <ul>
                    {datosOrdenados.map((categoria) => (
                    <li key={categoria.id}>
                        <NavLink to={`/admin/categorias/${categoria.id}`}>
                            <p>{categoria.nombre}</p>
                        </NavLink>
                        <BotonEliminar onClick={async () => {await eliminarCategoria(categoria.id)}}>🗑</BotonEliminar>
                    </li>
                    ))}
                </ul>
            </CategoriasTabla>
        </div>
    )
}

export default TablaCategorias