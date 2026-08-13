import { useState } from "react"
import { ContadorCantidadContainer, BotonAumentarCantidad, BotonDisminuirCantidad, CantidadProducto } from "./ContadorCantidad.styles"

const ContadorCantidad=({valorInicial, onChange, stockMaximo})=>{
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
            <BotonDisminuirCantidad onClick={disminuirCantidad}>-</BotonDisminuirCantidad>
            <CantidadProducto>{cantidad}</CantidadProducto>
            <BotonAumentarCantidad onClick={aumentarCantidad}>+</BotonAumentarCantidad>
        </ContadorCantidadContainer>
    )


}

export default ContadorCantidad