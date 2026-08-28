import HeaderCategorias from "../../../componentes/adminpanel/categorias/HeaderCategorias/HeaderCategorias";
import TablaCategorias from "../../../componentes/adminpanel/categorias/TablaCategorias/TablaCategorias";
import TablaHeader from "../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader"
import { useState } from "react";

const CategoriasAdmin = () => {

    const filtroCategorias = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'cantidadProductos', label: 'cantidadProductos' },

        ];

    const [sortConfig, setSortConfig] = useState({ campo: null, direccion: 'asc' });

    return (
        <div>
            <HeaderCategorias></HeaderCategorias>
            <TablaHeader areasFiltrar={filtroCategorias} onSortChange={setSortConfig}></TablaHeader>
            <TablaCategorias sortConfig={sortConfig}></TablaCategorias>
        </div>
    )
} 

export default CategoriasAdmin