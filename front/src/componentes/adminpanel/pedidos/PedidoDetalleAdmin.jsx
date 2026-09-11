import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DetalleContainer,
  EncabezadoDetalle,
  FormularioEstado,
  GridResumen,
  Mensaje,
  ProductoInfo,
  ResumenItem,
  Seccion,
  TablaProductos
} from './PedidoDetalleAdmin.styles';
import AdminButton from '../ui/AdminButton/AdminButton'
import { tiendaRequest } from '../../../services/api/apiClient';

const ESTADOS = ['pendiente', 'pagado', 'en_proceso', 'en_camino', 'entregado', 'rechazado', 'cancelado'];
const ESTADOS_FINALES = ['entregado', 'cancelado'];

const textoEstado = (estado) => estado.replaceAll('_', ' ');
const formatoFecha = (fecha) => new Date(fecha).toLocaleString('es-AR');
const formatoPrecio = (precio) => `$${Number(precio).toFixed(2)}`;

const PedidoDetalleAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [estado, setEstado] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const obtenerPedido = async () => {
      try {
        const response = await tiendaRequest(`/pedidos/${id}`, { auth: true });
        if (!response.ok) {
          setStatusError(response.status);
          return;
        }
        const data = await response.json();
        setPedido(data);
        setEstado(data.estado);
        setComentarios(data.comentarios || '');
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
        setStatusError(0);
      }
    };

    obtenerPedido();
  }, [id]);

  const guardarCambios = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const response = await tiendaRequest(`/pedidos/${id}`, {
        method: 'PATCH',
        auth: true,
        body: { estado, comentarios: comentarios || null }
      });
      const data = await response.json();
      if (!response.ok) {
        setMensaje({ error: data.detail || 'No se pudieron guardar los cambios.' });
        return;
      }
      setPedido(data);
      setEstado(data.estado);
      setComentarios(data.comentarios || '');
      setMensaje({ texto: 'Cambios guardados correctamente.' });
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      setMensaje({ error: 'Error al conectar con el servidor.' });
    } finally {
      setGuardando(false);
    }
  };

  if (statusError) return <DetalleContainer><Mensaje $error>Error al cargar el pedido (Código: {statusError})</Mensaje></DetalleContainer>;
  if (!pedido) return <DetalleContainer><p>Cargando pedido...</p></DetalleContainer>;

  const esEstadoFinal = ESTADOS_FINALES.includes(pedido.estado);

  return (
    <DetalleContainer>
      <EncabezadoDetalle>
        <div>
          <AdminButton type="button" $variant="secondary" $size="sm" onClick={() => navigate('/admin/pedidos')}>Volver a pedidos</AdminButton>
          <h1>{pedido.numero_pedido || `Pedido #${pedido.id}`}</h1>
        </div>
        <strong>{textoEstado(pedido.estado)}</strong>
      </EncabezadoDetalle>

      <GridResumen>
        <ResumenItem><span>Cliente</span><strong>{pedido.user_email}</strong></ResumenItem>
        <ResumenItem><span>Fecha</span><strong>{formatoFecha(pedido.created_at)}</strong></ResumenItem>
        <ResumenItem><span>Método de pago</span><strong>{pedido.metodo_pago}</strong></ResumenItem>
        <ResumenItem><span>Total</span><strong>{formatoPrecio(pedido.precio_total)}</strong></ResumenItem>
      </GridResumen>

      <Seccion>
        <h2>Productos</h2>
        <TablaProductos>
          <table>
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
            <tbody>
              {pedido.detalles.map((detalle) => (
                <tr key={detalle.id}>
                  <td><ProductoInfo>{detalle.producto.imagen_url?.[0] && <img src={detalle.producto.imagen_url[0]} alt="" />}<span>{detalle.producto.nombre}</span></ProductoInfo></td>
                  <td>{detalle.cantidad}</td>
                  <td>{formatoPrecio(detalle.precio_unitario)}</td>
                  <td>{formatoPrecio(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablaProductos>
      </Seccion>

      <Seccion>
        <h2>Gestionar pedido</h2>
        <FormularioEstado>
          <label htmlFor="estado">Estado
            <select id="estado" value={estado} onChange={(event) => setEstado(event.target.value)} disabled={esEstadoFinal || guardando}>
              {ESTADOS.map((opcion) => <option key={opcion} value={opcion}>{textoEstado(opcion)}</option>)}
            </select>
          </label>
          <label htmlFor="comentarios">Comentarios
            <textarea id="comentarios" value={comentarios} onChange={(event) => setComentarios(event.target.value)} disabled={esEstadoFinal || guardando} />
          </label>
          <AdminButton type="button" onClick={guardarCambios} disabled={esEstadoFinal || guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</AdminButton>
        </FormularioEstado>
        {esEstadoFinal && <Mensaje>Este pedido está cerrado y no admite cambios.</Mensaje>}
        {mensaje && <Mensaje $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</Mensaje>}
      </Seccion>
    </DetalleContainer>
  );
};

export default PedidoDetalleAdmin;