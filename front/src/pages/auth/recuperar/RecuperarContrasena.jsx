import { useState } from "react"
import { Link } from "react-router-dom"
import useRecuperarContrasena from "../../../hooks/auth/useRecuperarContrasena"
import {
    AuthTitulo,
    AuthForm,
    AuthLabel,
    AuthInput,
    AuthBoton,
    AuthMensaje,
    AuthLink
} from "../authStyles"

const RecuperarContrasena = () => {
    const { solicitarRecuperacion, enviando, mensaje } = useRecuperarContrasena()
    const [email, setEmail] = useState('')
    const [enviado, setEnviado] = useState(false)

    const enviar = async (e) => {
        e.preventDefault()
        const ok = await solicitarRecuperacion(email)
        if (ok) setEnviado(true)
    }

    return (
        <>
            <AuthTitulo>Recuperar contraseña</AuthTitulo>
            {!enviado && (
                <AuthForm onSubmit={enviar}>
                    <AuthLabel htmlFor="recuperar-email">Correo electrónico</AuthLabel>
                    <AuthInput
                        id="recuperar-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="ingrese su email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <AuthBoton type="submit" disabled={enviando}>
                        {enviando ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </AuthBoton>
                </AuthForm>
            )}
            {mensaje && <AuthMensaje $error={!enviado}>{mensaje}</AuthMensaje>}
            <AuthLink>
                <Link to="/login">Volver al inicio de sesión</Link>
            </AuthLink>
        </>
    )
}

export default RecuperarContrasena
