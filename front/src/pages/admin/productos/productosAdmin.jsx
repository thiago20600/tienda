import ProductosHeader from "../../../componentes/adminpanel/productos/productosHeader/ProductosHeader"
import TablaHeader from "../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader.jsx";
import ProductosTabla from "../../../componentes/adminpanel/productos/productosTabla/ProductosTabla.jsx";
import { useState } from "react";
import useProductosAdmin from "../../../hooks/productos/useProductosAdmin.jsx";
import CambiarPagina from "../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx";
import FiltrosProductosAdmin from "../../../componentes/adminpanel/productos/FiltrosProductosAdmin";

const ProductosAdmin = () => {
  const filtroProductos = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'sku', label: 'Sku' }
  ];

  const [sortConfig, setSortConfig] = useState({ campo: null, direccion: 'asc' });
  const [filtros, setFiltros] = useState({ q: '', categoriaId: '', estado: '' });


  const {productos, cargando, statusError, page, pages, cambiarPagina} = useProductosAdmin(filtros);
  const productosFiltrados = productos.filter((producto) => {
    if (filtros.estado === 'activo') return producto.producto_activo;
    if (filtros.estado === 'inactivo') return !producto.producto_activo;
    return true;
  });

  return (
    <div>
      <ProductosHeader />
      <FiltrosProductosAdmin filtros={filtros} onFiltroChange={(campo, valor) => {
        setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
        if (campo !== 'estado') cambiarPagina(1);
      }} />
      <TablaHeader areasFiltrar={filtroProductos} onSortChange={setSortConfig} />
      

      <ProductosTabla productos={productosFiltrados} cargando={cargando} statusError={statusError} sortConfig={sortConfig}/>

      <CambiarPagina paginaActual={page} totalPaginas={pages} onPageChange={cambiarPagina}/>
    </div>
  );
};

export default ProductosAdmin