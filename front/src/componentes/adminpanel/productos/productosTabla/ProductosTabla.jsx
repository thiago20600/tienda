import { useState } from "react"
import { NavLink } from "react-router-dom"
import { TablaProductos, BotonEliminar } from "./ProductosTabla.styles";
import useBorrarProducto from '../../../../hooks/productos/useBorrarProducto'
import useProductosAdmin from "../../../../hooks/productos/useProductosAdmin";
import useOrdenamiento from "../../../../hooks/useOrdenar";


const ProductosTabla = ({ sortConfig }) => { // 👈 Recibimos sortConfig por props
  

  const { eliminarProducto, message } = useBorrarProducto()
  const { productos, cargando, statusError } = useProductosAdmin();

  // 👈 Le pasamos los productos que vinieron de la API y el criterio de ordenamiento
  const { datosOrdenados } = useOrdenamiento(productos, sortConfig);


  if (cargando) {
    return <div>Cargando productos...</div>;
  }


  if (statusError) {
    return <div>Error al cargar productos (Código: {statusError})</div>;
  }
  

  if (productos.length === 0) {
    return <div>No hay productos registrados todavía.</div>;
  }

  // 4. Renderizamos usando datosOrdenados en lugar de productos
  return (
    <TablaProductos>
      <ul>
        {datosOrdenados.map((producto) => ( // 👈 Usamos datosOrdenados aquí
          <li key={producto.id}>
            <NavLink to={`/admin/productos/${producto.id}`}>
              <img 
                src={producto.imagen_url?.[0] || '/placeholder.png'} 
                alt={producto.nombre} 
              />
              <p>{producto.nombre}</p>
              <p>
                {Array.isArray(producto.categoria)
                  ? producto.categoria.map((cat) => (typeof cat === 'object' ? cat.nombre : cat)).join(', ')
                  : producto.categoria?.nombre || producto.categoria}
              </p>
              <p>${producto.precio}</p>
              <p>{producto.sku}</p>
              <p>{producto.stock} un.</p>
            </NavLink>
              <BotonEliminar onClick={async () => {await eliminarProducto(producto.id)}}>🗑</BotonEliminar>
          </li>
        ))}
      </ul>
    </TablaProductos>
  );
};

export default ProductosTabla;