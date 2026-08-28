import { loadMercadoPago } from "@mercadopago/sdk-js"
import { useEffect, useRef, useState } from "react"
import { CheckoutWrapper, PaymentGrid, AmountText, PagoExitosoContainer, CheckoutColumns, OrderSummary, CheckoutError, ProcessingMessage } from "./checkout.styles"
import { initMercadoPago } from "@mercadopago/sdk-react"
import useCarrito from "../../hooks/cart/useCarrito"
import DatosAdicionalesForm from "../../componentes/Checkout/DatosAdicionalesForm/DatosAdicionalesForm"
import BricksForm from "../../componentes/Checkout/BrickForm/BricksForm"
import { useNavigate } from "react-router-dom"
import { tiendaRequest } from "../../services/api/apiClient"


const Checkout = () => {
    const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY
    const [metodosPago, setMetodosPago] = useState([])
    const [paymentId, setPaymentId] = useState(null)
    const navigate = useNavigate()
    const formDataMPRef = useRef({})
    const [pedido, setPedido] = useState(null)
    const [errorPago, setErrorPago] = useState(null)
    const [procesandoPago, setProcesandoPago] = useState(false)
    const { carrito, statusError: carritoError, cargando: carritoCargando } = useCarrito()
    const amount = { amount: carrito?.total }

    useEffect(() => {

        initMercadoPago(`${MP_PUBLIC_KEY}`, { locale: 'es-AR' })
    }, [MP_PUBLIC_KEY])

    useEffect(() => {
        const listarMetodosPago = async () => {
            await loadMercadoPago()

            const response = await tiendaRequest('/metodos-pago')

            const data = await response.json()

            if (Array.isArray(data)) {
                setMetodosPago(data)
            } else if (data && Array.isArray(data.metodos)) {
                setMetodosPago(data.metodos)
            } else {
                setMetodosPago([])
            }
        }
        listarMetodosPago()
    }, [])

    const payload_tarjeta = async (paramTarjeta, formDataMP) => {
        setProcesandoPago(true)
        setErrorPago(null)
        try {
            const metodoEncontrado = metodosPago.find(
                (m) => m.id === paramTarjeta.payment_method_id
            )

            const datosTarjeta = {
                token_tarjeta: paramTarjeta.token,
                payment_method_id: paramTarjeta.payment_method_id,
                payment_method_type: metodoEncontrado?.payment_type_id ?? null,
                cuotas: Number(paramTarjeta.installments),
                tipo_identificacion: paramTarjeta.payer?.identification?.type,
                numero_identificacion: paramTarjeta.payer?.identification?.number,
            }

            const datosAdicionalesMP = {
                nombre: formDataMP.nombre,
                apellido: formDataMP.apellido,
                telefono_area: String(formDataMP.telefonoArea),
                telefono_numero: String(formDataMP.telefonoNumero),
                codigo_postal: formDataMP.codigoPostal,
                nombre_calle: formDataMP.nombreCalle,
                numero_calle: String(formDataMP.numeroCalle),
                provincia: formDataMP.provincia,
                localidad: formDataMP.localidad,
                detalle_direccion: formDataMP.detalleDireccion || null,
            }

            const payloadFinal = { ...datosTarjeta, ...datosAdicionalesMP }

            const response = await tiendaRequest('/crear-orden', {
                method: 'POST',
                auth: true,
                body: payloadFinal
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                console.error('Error creando orden:', errorData)
                const detalle = errorData?.detail
                setErrorPago(typeof detalle === 'string' ? detalle : detalle?.message || 'Mercado Pago rechazó el pago.')
                return
            }

            const resultado = await response.json()
            setPaymentId(resultado.mp_payment_id)
            setPedido(resultado)
            console.log(resultado.mp_payment_id)
        } catch (err) {
            console.error('Error en payload_tarjeta:', err)
            setErrorPago('No se pudo conectar con la pasarela de pago.')
        } finally {
            setProcesandoPago(false)
        }


    }

    if (carritoCargando) return <CheckoutWrapper><p>Cargando checkout...</p></CheckoutWrapper>
    if (carritoError) return <CheckoutWrapper><p>No se pudo cargar el carrito (código: {carritoError}).</p></CheckoutWrapper>
    if (!carrito || !carrito.items?.length) return <CheckoutWrapper><p>Tu carrito está vacío.</p></CheckoutWrapper>

    return (
    <CheckoutWrapper>
        <PaymentGrid>
            
            {pedido && pedido.estado === 'pagado' ? (
                <PagoExitosoContainer>
                    <h2>¡Pago exitoso!</h2>
                    <p><strong>Número de pedido:</strong> {pedido.numero_pedido}</p>
                    <p><strong>Total pagado:</strong> ${pedido.precio_total?.toLocaleString('es-AR')}</p>
                    <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
                    <p><strong>Cliente:</strong> {pedido.user_email}</p>
                    <p><strong>Productos:</strong> {pedido.detalles?.reduce((total, detalle) => total + detalle.cantidad, 0)}</p>
                    {pedido.mp_payment_id && <p><strong>Pago:</strong> {pedido.mp_payment_id}</p>}
                    <button onClick={() => navigate('/')}>Volver a la tienda</button>
                </PagoExitosoContainer>
            ) : (
                <>
        <AmountText>Total a pagar: ${amount?.amount?.toLocaleString('es-AR')}</AmountText>
        {errorPago && <CheckoutError>{errorPago}</CheckoutError>}
        {procesandoPago && <ProcessingMessage>Procesando pago...</ProcessingMessage>}
        <CheckoutColumns>
            <OrderSummary>
                <h2>Resumen de compra</h2>
                <ul>
                    {carrito.items.map((item) => (
                        <li key={item.id}>
                            <span>{item.cantidad} x {item.producto.nombre}</span>
                            <strong>${(item.subtotal || item.cantidad * item.precio_unitario).toLocaleString('es-AR')}</strong>
                        </li>
                    ))}
                </ul>
            </OrderSummary>
            <div>
                <DatosAdicionalesForm
                    onChangeFormData={(data) => { formDataMPRef.current = data; }}/>
                {!procesandoPago && <BricksForm
                    amount={amount}
                    paymentId={paymentId}
                    onSubmit={(param) => payload_tarjeta(param, formDataMPRef.current)}/>} 
            </div>
        </CheckoutColumns>
        </>)}
        </PaymentGrid>
    </CheckoutWrapper>
)
}

export default Checkout