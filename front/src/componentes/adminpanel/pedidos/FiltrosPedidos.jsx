import { FiltrosContainer, Filtro, FiltroLabel, FiltroInput, FiltroSelect } from './FiltrosPedidos.styles';

const estados = ['pendiente', 'pagado', 'en_proceso', 'en_camino', 'entregado', 'rechazado', 'cancelado'];
const metodosPago = ['tarjeta', 'efectivo'];

const FiltrosPedidos = ({ filtros, onFiltroChange }) => (
  <FiltrosContainer>
    <Filtro>
      <FiltroLabel htmlFor="filtro-numero">Número de pedido</FiltroLabel>
      <FiltroInput
        id="filtro-numero"
        value={filtros.numero_pedido}
        onChange={(event) => onFiltroChange('numero_pedido', event.target.value)}
        placeholder="PED-202608-0001"
      />
    </Filtro>
    <Filtro>
      <FiltroLabel htmlFor="filtro-estado">Estado</FiltroLabel>
      <FiltroSelect
        id="filtro-estado"
        value={filtros.estado}
        onChange={(event) => onFiltroChange('estado', event.target.value)}
      >
        <option value="">Todos</option>
        {estados.map((estado) => <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>)}
      </FiltroSelect>
    </Filtro>
    <Filtro>
      <FiltroLabel htmlFor="filtro-metodo">Método de pago</FiltroLabel>
      <FiltroSelect
        id="filtro-metodo"
        value={filtros.metodo_pago}
        onChange={(event) => onFiltroChange('metodo_pago', event.target.value)}
      >
        <option value="">Todos</option>
        {metodosPago.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
      </FiltroSelect>
    </Filtro>
    <Filtro>
      <FiltroLabel htmlFor="filtro-total">Precio total</FiltroLabel>
      <FiltroInput
        id="filtro-total"
        type="number"
        min="0"
        step="0.01"
        value={filtros.precio_total}
        onChange={(event) => onFiltroChange('precio_total', event.target.value)}
        placeholder="0.00"
      />
    </Filtro>
  </FiltrosContainer>
);

export default FiltrosPedidos;