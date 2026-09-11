import { useState } from "react"
import { LoginFormContainer, LoginFormStyle } from "./LoginForm.styles"
import { useNavigate, NavLink } from "react-router-dom"
import { usuariosRequest } from "../../services/api/apiClient"
import { useAuth } from "../../services/auth/useAuth"

export const LoginForm = () => {

    const [email, setEmail] = useState(() => localStorage.getItem("email") || '')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [recordarEmail, setRecordarEmail] = useState(() => Boolean(localStorage.getItem("email")))
    const navigate = useNavigate()
    const { login } = useAuth()

    /* Enviar formulario para loguear */
    const EnviarLoginForm = async (e) => {
        e.preventDefault()
        setEnviando(true)
        setMessage('')

        const datos = new FormData()

        datos.append('username', email)
        datos.append('password', password)
        

        try {
            const response = await usuariosRequest('/login', {
                method: 'POST',
                body: datos
            })

            if (response.ok) {
                const data = await response.json()

                if (recordarEmail) {
                    localStorage.setItem("email", email)
                } else {
                    localStorage.removeItem("email")
                }

                await login(data.access)
                navigate('/')

            } else {
                const data = await response.json().catch(() => ({}))
                setMessage(data.detail || 'No se pudo iniciar sesión.')
            }
        } catch (error) {
            console.error('Error de red al iniciar sesión:', error)
            setMessage('Error de conexión con el servidor.')
        } finally {
            setEnviando(false)
        }
    }
    

    
    return (
        <LoginFormContainer>
            <h1>Iniciar sesion</h1>
            <LoginFormStyle onSubmit={EnviarLoginForm}>
                <label htmlFor="login-email">Correo electrónico</label>
                <input id="login-email" type="email" placeholder="ingrese su email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required></input>
                <label htmlFor="login-password">Contraseña</label>
                <input id="login-password" type="password" placeholder="ingrese su contraseña" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required></input>
            
                <label>
                    <input type='checkbox' checked={recordarEmail} onChange={(e) => setRecordarEmail(e.target.checked)}></input>
                    Recordar email
                </label>
                <button type="submit" disabled={enviando}>{enviando ? 'Ingresando...' : 'Iniciar sesion'}</button>
            </LoginFormStyle>
            {message && <p>{message}</p>}
            <NavLink to="/recuperar-contrasena">Olvidé mi contraseña</NavLink>
        </LoginFormContainer>
    )

}