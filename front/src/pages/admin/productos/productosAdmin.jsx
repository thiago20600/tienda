import ProductosHeader from "../../../componentes/adminpanel/productos/productosHeader/ProductosHeader"
import TablaHeader from "../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader.jsx";
import ProductosTabla from "../../../componentes/adminpanel/productos/productosTabla/ProductosTabla.jsx";
import { useState } from "react";
import useProductosAdmin from "../../../hooks/productos/useProductosAdmin.jsx";
import CambiarPagina from "../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx";
import FiltrosProductosAdmin from "../../../componentes/adminpanel/productos/FiltrosProductosAdmin";
import useDebounce from "../../../../utils/useDebounce";

const ProductosAdmin = () => {
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState({
    q: '',
    categoriaId: '',
    estado: '',
    precioMin: '',
    precioMax: '',
    stockMin: '',
    stockMax: '',
    sku: ''
  });
  const [ordenamiento, setOrdenamiento] = useState({ campo: null, direccion: 'asc' });
  
  const qDebounce = useDebounce(filtros.q, 500);

  const { productos, cargando, statusError, page, pages, cambiarPagina } = useProductosAdmin({
    q: qDebounce,
    categoriaId: filtros.categoriaId,
    estado: filtros.estado,
    precioMin: filtros.precioMin,
    precioMax: filtros.precioMax,
    stockMin: filtros.stockMin,
    stockMax: filtros.stockMax,
    sku: filtros.sku,
    ordenarPor: ordenamiento.campo,
    orden: ordenamiento.direccion,
    page: pagina,
    size: 10
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
    setPagina(1);
  };

  const handleOrdenamiento = (configuracion) => {
    setOrdenamiento(configuracion);
    setPagina(1);
  };

  return (
    <div>
      <ProductosHeader />
      <FiltrosProductosAdmin filtros={filtros} onFiltroChange={handleFiltroChange} />
      <TablaHeader areasFiltrar={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'precio', label: 'Precio' },
        { key: 'stock', label: 'Stock' },
        { key: 'sku', label: 'Sku' }
      ]} onSortChange={handleOrdenamiento} />

      <ProductosTabla productos={productos} cargando={cargando} statusError={statusError} />

      <CambiarPagina paginaActual={pagina} totalPaginas={pages} onPageChange={(nuevaPagina) => {
        setPagina(nuevaPagina);
        cambiarPagina(nuevaPagina);
      }} />
    </div>
  );
};

export default ProductosAdmin