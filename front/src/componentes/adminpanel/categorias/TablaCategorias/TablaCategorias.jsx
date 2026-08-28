import useCategorias from "../../../../hooks/categorias/useCategorias"
import { CategoriasTabla, BotonEliminar } from "./TablaCategorias.styles";
import useOrdenamiento from "../../../../hooks/useOrdenar";
import { NavLink } from "react-router-dom";
import useEliminarCategoria from "../../../../hooks/categorias/useEliminarCategoria";

const TablaCategorias = ({ sortConfig }) => {

    const { eliminarCategoria, statusError: statusErrorEliminar } = useEliminarCategoria()
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

    if (statusErrorEliminar) {
        return <div>Error al eliminar categoria (Código: {statusErrorEliminar})</div>;
    }
        

    return (
        <div>
            <CategoriasTabla>
                <ul>
                    {datosOrdenados.map((categoria) => (
                    <li key={categoria.id}>
                        <NavLink to={`/admin/categorias/${categoria.id}`}>
                            <p>{categoria.nombre}</p>
                            <p>{categoria.estado ? 'Activa' : 'Inactiva'}</p>
                        </NavLink>
                        <BotonEliminar onClick={async () => {if (window.confirm(`¿Eliminar ${categoria.nombre}?`)) await eliminarCategoria(categoria.id)}}>🗑</BotonEliminar>
                    </li>
                    ))}
                </ul>
            </CategoriasTabla>
        </div>
    )
}

export default TablaCategorias