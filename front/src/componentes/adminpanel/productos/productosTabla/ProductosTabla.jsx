import { useState } from "react";
import { NavLink } from "react-router-dom"
import { TablaProductos, BotonEstado, BotonDestacado, MensajeTabla, InputStock } from "./ProductosTabla.styles";
import useBorrarProducto from '../../../../hooks/productos/useBorrarProducto'

import useActualizarEstadoProducto from '../../../../hooks/productos/useActualizarEstadoProducto'
import useDestacarProducto from '../../../../hooks/productos/useDestacarProducto'
import useActualizarStockProducto from '../../../../hooks/productos/useActualizarStockProducto'
import AdminButton from "../../ui/AdminButton/AdminButton";
import PrecioProducto from "../../../PrecioProducto/PrecioProducto";

const ProductosTabla = ({ productos, cargando, statusError }) => {
  const { eliminarProducto, message, statusError: statusErrorEliminar } = useBorrarProducto();
  const { actualizarEstado, statusError: statusErrorEstado, actualizando: actualizandoEstado } = useActualizarEstadoProducto();
  const { toggleDestacado, statusError: statusErrorDestacado, actualizando: actualizandoDestacado } = useDestacarProducto();
  const { actualizarStock, statusError: statusErrorStock, actualizando: actualizandoStock } = useActualizarStockProducto();

  const [productosEliminados, setProductosEliminados] = useState(new Set());
  const [estadosLocales, setEstadosLocales] = useState({});
  const [destacadosLocales, setDestacadosLocales] = useState({});
  const [stockLocales, setStockLocales] = useState({});

  const productosActuales = productos
    .filter((producto) => !productosEliminados.has(producto.id))
    .map((producto) => ({
      ...producto,
      producto_activo: estadosLocales[producto.id] ?? producto.producto_activo,
      destacado: destacadosLocales[producto.id] ?? producto.destacado
    }));

  const cambiarEstado = async (event, producto) => {
    event.preventDefault();
    event.stopPropagation();

    const resultado = await actualizarEstado(producto.id, producto.producto_activo);
    if (resultado?.ok) {
      setEstadosLocales((prev) => ({ ...prev, [producto.id]: !producto.producto_activo }));
    }
  };

  const guardarStock = async (event, producto) => {
    event.preventDefault();
    event.stopPropagation();

    const valor = Number(event.currentTarget.value);
    if (!Number.isInteger(valor) || valor < 0 || valor === producto.stock) return;

    const resultado = await actualizarStock(producto.id, valor);
    if (resultado?.ok) {
      setStockLocales((prev) => ({ ...prev, [producto.id]: valor }));
    }
  };

  const cambiarDestacado = async (event, producto) => {
    event.preventDefault();
    event.stopPropagation();

    const resultado = await toggleDestacado(producto.id, producto.destacado);
    if (resultado?.ok) {
      setDestacadosLocales((prev) => ({ ...prev, [producto.id]: !producto.destacado }));
    }
  };

  if (cargando) {
    return <MensajeTabla>Cargando productos...</MensajeTabla>;
  }

  if (statusError) {
    return <MensajeTabla $error>Error al cargar productos (Código: {statusError})</MensajeTabla>;
  }

  if (productos.length === 0) {
    return <MensajeTabla>No hay productos registrados todavía.</MensajeTabla>;
  }

  if (statusErrorEliminar) {
    return <MensajeTabla $error>Error al eliminar producto (Código: {statusErrorEliminar})</MensajeTabla>;
  }

  if (statusErrorEstado) {
    return <MensajeTabla $error>Error al cambiar estado de producto (Código: {statusErrorEstado})</MensajeTabla>;
  }

  if (statusErrorDestacado) {
    return <MensajeTabla $error>Error al cambiar destacado de producto (Código: {statusErrorDestacado})</MensajeTabla>;
  }

  if (statusErrorStock) {
    return <MensajeTabla $error>Error al actualizar stock (Código: {statusErrorStock})</MensajeTabla>;
  }

  return (
    <TablaProductos>
      {message && <MensajeTabla>{message}</MensajeTabla>}
      <ul>
        {productosActuales.map((producto) => (
          <li key={producto.id}>
            <NavLink to={`/admin/productos/${producto.id}`}>
              <img src={producto.imagen_url?.[0] || '/placeholder.png'} alt={producto.nombre}/>
              <p>{producto.nombre}</p>
              <p>
                {Array.isArray(producto.categoria)
                  ? producto.categoria?.map((cat) => (typeof cat === 'object' ? cat.nombre : cat)).join(', ')
                  : producto.categoria?.nombre || producto.categoria}
              </p>
              <p className="product-price">
                <PrecioProducto precio={producto.precio} precioDescuento={producto.precio_descuento} tabla />
              </p>
              <p>{producto.sku}</p>
              <InputStock
                type="number"
                min="0"
                defaultValue={stockLocales[producto.id] ?? producto.stock}
                key={`${producto.id}-${stockLocales[producto.id] ?? producto.stock}`}
                disabled={actualizandoStock === producto.id}
                title="Editar stock"
                onClick={(event) => event.preventDefault()}
                onBlur={(event) => guardarStock(event, producto)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
              />
            </NavLink>
            
            <BotonEstado
              type="button"
              $activo={estadosLocales[producto.id] ?? producto.producto_activo}
              disabled={actualizandoEstado === producto.id || !!statusErrorEstado}
              onClick={(event) => cambiarEstado(event, producto)}
            >
              <span>{estadosLocales[producto.id] ?? producto.producto_activo ? '✓' : '✕'}</span>
              {estadosLocales[producto.id] ?? producto.producto_activo ? 'Activo' : 'Inactivo'}
            </BotonEstado>
            <BotonDestacado
              type="button"
              $destacado={destacadosLocales[producto.id] ?? producto.destacado}
              disabled={actualizandoDestacado === producto.id || !!statusErrorDestacado}
              onClick={(event) => cambiarDestacado(event, producto)}
            >
              <span>★</span>
              {destacadosLocales[producto.id] ?? producto.destacado ? 'Destacado' : 'Destacar'}
            </BotonDestacado>
            <AdminButton $variant="danger" $size="sm"
              onClick={async () => {
                if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
                setProductosEliminados((prev) => new Set(prev).add(producto.id));
                const resultado = await eliminarProducto(producto.id);
                if (resultado?.ok) {
                  setProductosEliminados((prev) => {
                    const next = new Set(prev);
                    next.delete(producto.id);
                    return next;
                  });
                } else {
                  setProductosEliminados((prev) => {
                    const next = new Set(prev);
                    next.delete(producto.id);
                    return next;
                  });
                }
              }}
            >
              🗑
            </AdminButton>
          </li>
        ))}
      </ul>
    </TablaProductos>
  );
};

export default ProductosTabla