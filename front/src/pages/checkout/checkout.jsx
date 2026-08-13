import { loadMercadoPago } from "@mercadopago/sdk-js"
import { useEffect, useRef, useState } from "react"
import { CheckoutWrapper, PaymentGrid, AmountText, PagoExitosoContainer } from "./checkout.styles"
import { initMercadoPago } from "@mercadopago/sdk-react"
import useCarrito from "../../hooks/cart/useCarrito"
import DatosAdicionalesForm from "../../componentes/Checkout/DatosAdicionalesForm/DatosAdicionalesForm"
import BricksForm from "../../componentes/Checkout/BrickForm/BricksForm"
import { useNavigate } from "react-router-dom"


const Checkout = () => {
    const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [metodosPago, setMetodosPago] = useState([])
    const [paymentId, setPaymentId] = useState(null)
    const navigate = useNavigate()
    const formDataMPRef = useRef({})
    const [pedido, setPedido] = useState(null)
    const { carrito, error } = useCarrito()
    const amount = { amount: carrito?.total }

    useEffect(() => {

        initMercadoPago(`${MP_PUBLIC_KEY}`, { locale: 'es-AR' })
    }, [])

    useEffect(() => {
        const listarMetodosPago = async () => {
            await loadMercadoPago()

            const response = await fetch(`${UrlApiBaseProductos}/metodos-pago`, {
                method: 'GET'
            })

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
        try {
            const accessToken = localStorage.getItem('token')

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

            const response = await fetch(`${UrlApiBaseProductos}/crear-orden`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payloadFinal)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                console.error('Error creando orden:', errorData)
                return
            }

            const resultado = await response.json()
            setPaymentId(resultado.mp_payment_id)
            setPedido(resultado)
            console.log(resultado.mp_payment_id)
        } catch (err) {
            console.error('Error en payload_tarjeta:', err)
        }


    }

    return (
    <CheckoutWrapper>
        <PaymentGrid>
            
            {pedido && pedido.estado === 'pagado' ? (
                <PagoExitosoContainer>
                    <h2>¡Pago exitoso!</h2>
                    <p><strong>Número de pedido:</strong> {pedido.numero_pedido}</p>
                    <p><strong>Total pagado:</strong> ${pedido.precio_total?.toLocaleString('es-AR')}</p>
                    <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
                    <button onClick={() => navigate('/')}>Volver a la tienda</button>
                </PagoExitosoContainer>
            ) : (
                <>
        <AmountText>Total a pagar: ${amount?.amount?.toLocaleString('es-AR')}</AmountText>

        <DatosAdicionalesForm
            onChangeFormData={(data) => { formDataMPRef.current = data; }}/>

        <BricksForm
            amount={amount}
            paymentId={paymentId}
            onSubmit={(param) => payload_tarjeta(param, formDataMPRef.current)}/>
        </>)}
        </PaymentGrid>
    </CheckoutWrapper>
)
}

export default Checkout