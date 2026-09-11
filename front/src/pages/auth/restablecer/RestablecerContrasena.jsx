import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import useRestablecerContrasena from "../../../hooks/auth/useRestablecerContrasena"
import {
    AuthTitulo,
    AuthForm,
    AuthLabel,
    AuthInput,
    AuthBoton,
    AuthMensaje,
    AuthLink
} from "../authStyles"

const RestablecerContrasena = () => {
    const { token } = useParams()
    const { restablecer, enviando, mensaje, exito } = useRestablecerContrasena()
    const [password, setPassword] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [errorLocal, setErrorLocal] = useState(null)

    const enviar = async (e) => {
        e.preventDefault()
        setErrorLocal(null)

        if (password.length < 6) {
            setErrorLocal('La contraseña debe tener al menos 6 caracteres.')
            return
        }
        if (password !== confirmar) {
            setErrorLocal('Las contraseñas no coinciden.')
            return
        }

        await restablecer(token, password)
    }

    return (
        <>
            <AuthTitulo>Restablecer contraseña</AuthTitulo>
            {!exito && (
                <AuthForm onSubmit={enviar}>
                    <AuthLabel htmlFor="restablecer-password">Nueva contraseña</AuthLabel>
                    <AuthInput
                        id="restablecer-password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <AuthLabel htmlFor="restablecer-confirmar">Confirmar contraseña</AuthLabel>
                    <AuthInput
                        id="restablecer-confirmar"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                    />
                    <AuthBoton type="submit" disabled={enviando}>
                        {enviando ? 'Guardando...' : 'Guardar contraseña'}
                    </AuthBoton>
                </AuthForm>
            )}
            {(errorLocal || mensaje) && <AuthMensaje $error={!exito}>{errorLocal || mensaje}</AuthMensaje>}
            <AuthLink>
                <Link to="/login">{exito ? 'Ir al inicio de sesión' : 'Cancelar'}</Link>
            </AuthLink>
        </>
    )
}

export default RestablecerContrasena
