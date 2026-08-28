import { NavLink } from "react-router-dom"
import { TablaProductos, BotonEliminar } from "./ProductosTabla.styles";
import useBorrarProducto from '../../../../hooks/productos/useBorrarProducto'

import useOrdenamiento from "../../../../hooks/useOrdenar";


const ProductosTabla = ({ productos, cargando, statusError, sortConfig }) => {
  const { eliminarProducto, message } = useBorrarProducto();
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

  return (
    <TablaProductos>
      {message && <div>{message}</div>}
      <ul>
        {datosOrdenados.map((producto) => (
          <li key={producto.id}>
            <NavLink to={`/admin/productos/${producto.id}`}>
              <img src={producto.imagen_url?.[0] || '/placeholder.png'} alt={producto.nombre}/>
              <p>{producto.nombre}</p>
              <p>
                {Array.isArray(producto.categoria)
                  ? producto.categoria.map((cat) => (typeof cat === 'object' ? cat.nombre : cat)).join(', ')
                  : producto.categoria?.nombre || producto.categoria}
              </p>
              <p>${producto.precio}</p>
              <p>{producto.sku}</p>
              <p>{producto.stock} un.</p>
              <p>{producto.producto_activo ? 'Activo' : 'Inactivo'}</p>
            </NavLink>
            <BotonEliminar onClick={async () => {if (window.confirm(`¿Eliminar ${producto.nombre}?`)) await eliminarProducto(producto.id)}}>
              🗑
            </BotonEliminar>
          </li>
        ))}
      </ul>
    </TablaProductos>
  );
};

export default ProductosTabla