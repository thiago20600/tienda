import { useState } from "react"
import { ContadorCantidadContainer, BotonAumentarCantidad, BotonDisminuirCantidad, CantidadProducto } from "./ContadorCantidad.styles"

const ContadorCantidad=({valorInicial, onChange, stockMaximo, disabled = false})=>{
    const [cantidad, setCantidad] = useState(valorInicial)

const aumentarCantidad = () => {

        if (!stockMaximo){
            const nuevaCantidad = cantidad + 1
            setCantidad(nuevaCantidad)

            if (onChange) {
                onChange(nuevaCantidad)
            }
        }else{
            if (cantidad < stockMaximo) {
                const nuevaCantidad = cantidad + 1
                setCantidad(nuevaCantidad)

                if (onChange) {
                    onChange(nuevaCantidad)
                }
            }
        }
    }

 const disminuirCantidad = () => {
    if (cantidad > 1) {
        const nuevaCantidad = cantidad - 1
        setCantidad(nuevaCantidad)

        if (onChange) {
            onChange(nuevaCantidad)
        }
    }
}


    return(
        <ContadorCantidadContainer>
            <BotonDisminuirCantidad type="button" disabled={disabled} onClick={disminuirCantidad} aria-label="Disminuir cantidad">-</BotonDisminuirCantidad>
            <CantidadProducto>{cantidad}</CantidadProducto>
            <BotonAumentarCantidad type="button" disabled={disabled} onClick={aumentarCantidad} aria-label="Aumentar cantidad">+</BotonAumentarCantidad>
        </ContadorCantidadContainer>
    )


}

export default ContadorCantidad