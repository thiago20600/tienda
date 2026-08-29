import { useState } from "react";
import { NavLink } from "react-router-dom"
import { tiendaRequest } from "../../../../services/api/apiClient";
import { TablaProductos, BotonEliminar, BotonEstado, MensajeTabla } from "./ProductosTabla.styles";
import useBorrarProducto from '../../../../hooks/productos/useBorrarProducto'

import useOrdenamiento from "../../../../hooks/useOrdenar";
import PrecioProducto from "../../../PrecioProducto/PrecioProducto";


const ProductosTabla = ({ productos, cargando, statusError, sortConfig }) => {
  const { eliminarProducto, message } = useBorrarProducto();
  const [estadosLocales, setEstadosLocales] = useState({});
  const [productosEliminados, setProductosEliminados] = useState(new Set());
  const [actualizandoEstado, setActualizandoEstado] = useState(null);
  const [estadoError, setEstadoError] = useState('');
  const [eliminandoProducto, setEliminandoProducto] = useState(null);
  const productosActuales = productos
    .filter((producto) => !productosEliminados.has(producto.id))
    .map((producto) => ({
      ...producto,
      producto_activo: estadosLocales[producto.id] ?? producto.producto_activo
    }));
  const { datosOrdenados } = useOrdenamiento(productosActuales, sortConfig);

  const cambiarEstado = async (event, producto) => {
    event.preventDefault();
    event.stopPropagation();
    setActualizandoEstado(producto.id);
    setEstadoError('');

    try {
      const response = await tiendaRequest(`/productos/${producto.id}`, {
        method: 'PATCH',
        auth: true,
        body: { producto_activo: !producto.producto_activo }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setEstadoError(data.detail || 'No se pudo cambiar el estado.');
        return;
      }

      const nuevoEstado = !producto.producto_activo;
      setEstadosLocales((actuales) => ({ ...actuales, [producto.id]: nuevoEstado }));
    } catch (error) {
      console.error('Error cambiando el estado del producto:', error);
      setEstadoError('Error de conexión al cambiar el estado.');
    } finally {
      setActualizandoEstado(null);
    }
  };

  if (cargando) {
    return <MensajeTabla>Cargando productos...</MensajeTabla>;
  }

  if (statusError) {
    return <MensajeTabla $error>Error al cargar productos (Código: {statusError})</MensajeTabla>;
  }

  if (productosActuales.length === 0) {
    return <MensajeTabla>No hay productos registrados todavía.</MensajeTabla>;
  }

  return (
    <TablaProductos>
      {message && <MensajeTabla $success={!message.toLowerCase().includes('error')}>{message}</MensajeTabla>}
      {estadoError && <MensajeTabla $error>{estadoError}</MensajeTabla>}
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
              <div className="product-price"><PrecioProducto precio={producto.precio} precioDescuento={producto.precio_descuento} compacto /></div>
              <p>{producto.sku}</p>
              <p>{producto.stock} un.</p>
              <BotonEstado
                type="button"
                $activo={producto.producto_activo}
                disabled={actualizandoEstado === producto.id}
                onClick={(event) => cambiarEstado(event, producto)}
                aria-label={`Cambiar estado de ${producto.nombre}`}
              >
                <span aria-hidden="true">{producto.producto_activo ? '✓' : 'X'}</span>
                {producto.producto_activo ? 'Activo' : 'Inactivo'}
              </BotonEstado>
            </NavLink>
            <BotonEliminar disabled={eliminandoProducto === producto.id} onClick={async () => {
              if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
              setEliminandoProducto(producto.id);
              const eliminado = await eliminarProducto(producto.id);
              if (eliminado) setProductosEliminados((actuales) => new Set(actuales).add(producto.id));
              setEliminandoProducto(null);
            }}>
              🗑
            </BotonEliminar>
          </li>
        ))}
      </ul>
    </TablaProductos>
  );
};

export default ProductosTabla