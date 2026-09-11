import { PrecioContainer, PrecioAnterior, PrecioActual, DescuentoBadge } from './PrecioProducto.styles';

const PrecioProducto = ({ precio, precioDescuento, compacto = false, tabla = false }) => {
  const precioOriginal = Number(precio);
  const precioFinal = Number(precioDescuento);
  const tieneDescuento = Number.isFinite(precioFinal)
    && precioFinal > 0
    && precioFinal < precioOriginal;

  if (!tieneDescuento) {
    return <PrecioActual $compacto={compacto} $tabla={tabla}>${precioOriginal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</PrecioActual>;
  }

  const porcentaje = Math.round((1 - precioFinal / precioOriginal) * 100);

  return (
    <PrecioContainer $compacto={compacto}>
      <div>
        <PrecioAnterior $tabla={tabla}>${precioOriginal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</PrecioAnterior>
        <PrecioActual $compacto={compacto} $tabla={tabla}>${precioFinal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</PrecioActual>
      </div>
      <DescuentoBadge $tabla={tabla}>-{porcentaje}%</DescuentoBadge>
    </PrecioContainer>
  );
};

export default PrecioProducto;
