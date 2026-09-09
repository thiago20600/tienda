import { useState } from "react";
import useCategorias from "../../../../hooks/categorias/useCategorias"
import { CategoriasTabla, BotonEliminar, BotonDestacar } from "./TablaCategorias.styles";
import useOrdenamiento from "../../../../hooks/useOrdenar";
import { NavLink } from "react-router-dom";
import useEliminarCategoria from "../../../../hooks/categorias/useEliminarCategoria";
import useDestacarCategoria from "../../../../hooks/categorias/useDestacarCategoria";

const TablaCategorias = ({ sortConfig }) => {

    const { eliminarCategoria, statusError: statusErrorEliminar } = useEliminarCategoria()
    const { toggleDestacado, statusError: statusErrorDestacado, actualizando: actualizandoDestacado } = useDestacarCategoria()
    const { categorias, statusError, cargando } = useCategorias()
    const { datosOrdenados } = useOrdenamiento(categorias, sortConfig);
    const [destacadosLocales, setDestacadosLocales] = useState({});

    const categoriasActuales = datosOrdenados.map((categoria) => ({
        ...categoria,
        destacado: destacadosLocales[categoria.id] ?? categoria.destacado
    }));

    const cambiarDestacado = async (event, categoria) => {
        event.preventDefault();
        event.stopPropagation();

        const resultado = await toggleDestacado(categoria.id, categoria.destacado);
        if (resultado?.ok) {
            setDestacadosLocales((actuales) => ({ ...actuales, [categoria.id]: !categoria.destacado }));
        }
    };

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

    if (statusErrorDestacado) {
        return <div>Error al cambiar destacado de categoria (Código: {statusErrorDestacado})</div>;
    }

    return (
        <CategoriasTabla>
            <ul>
                {categoriasActuales.map((categoria) => (
                    <li key={categoria.id}>
                        <NavLink to={`/admin/categorias/${categoria.id}`}>
                            <p>{categoria.nombre}</p>
                            <p>{categoria.estado ? 'Activa' : 'Inactiva'}</p>
                            <p style={{ color: categoria.destacado ? '#b45309' : '#666666', fontSize: '13px' }}>
                                {categoria.destacado ? 'Destacada' : 'Normal'}
                            </p>
                        </NavLink>
                        <BotonDestacar
                            type="button"
                            $destacado={destacadosLocales[categoria.id] ?? categoria.destacado}
                            disabled={actualizandoDestacado === categoria.id || !!statusErrorDestacado}
                            onClick={(event) => cambiarDestacado(event, categoria)}
                            aria-label={`Cambiar destacado de ${categoria.nombre}`}
                        >
                            <span aria-hidden="true">★</span>
                            {(destacadosLocales[categoria.id] ?? categoria.destacado) ? "Destacada" : "Destacar"}
                        </BotonDestacar>
                        <BotonEliminar onClick={async () => {if (window.confirm(`¿Eliminar ${categoria.nombre}?`)) await eliminarCategoria(categoria.id)}}>🗑</BotonEliminar>
                    </li>
                ))}
            </ul>
        </CategoriasTabla>
    )
}

export default TablaCategorias
