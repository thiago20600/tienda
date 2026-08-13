import ProductosHeader from "../../../componentes/adminpanel/productos/productosHeader/ProductosHeader"
import TablaHeader from "../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader.jsx";
import ProductosTabla from "../../../componentes/adminpanel/productos/productosTabla/ProductosTabla.jsx";
import { useState } from "react";

const ProductosAdmin = () => {

    const filtroProductos = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'sku', label: 'Sku' }
    ];

    const [sortConfig, setSortConfig] = useState({ campo: null, direccion: 'asc' });

    return (
        <div>
            <ProductosHeader/>
            <TablaHeader areasFiltrar={filtroProductos} onSortChange={setSortConfig}/>
            <ProductosTabla sortConfig={sortConfig}/>
        </div> 
        
    )
} 

export default ProductosAdmin