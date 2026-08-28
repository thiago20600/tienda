import { CardPayment } from "@mercadopago/sdk-react"

const BricksForm = ({ amount, paymentId, onSubmit, onError, onReady }) => {
    return (
        <>
            {!paymentId && amount?.amount && (
                <CardPayment
                    initialization={amount}
                    onSubmit={onSubmit}
                    onError={onError}
                    onReady={onReady}
                />
            )}
        </>
    )
}

export default BricksForm