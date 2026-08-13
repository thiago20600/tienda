import { useEffect, useState } from "react"
import { LoginFormContainer, LoginFormStyle } from "./LoginForm.styles"
import { useNavigate } from "react-router-dom"

export const LoginForm = () => {

    const UrlApiBaseUsuarios = import.meta.env.VITE_API_URL_USUARIOS
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [recordarEmail, setRecordarEmail] = useState(false)
    const navigate = useNavigate()

    /* Obtener email guardado */
    useEffect(() => {
        const emailGuardado = localStorage.getItem("email")
        

        if (emailGuardado) {
            setEmail(emailGuardado)
            setRecordarEmail(true)
            }
        }, [])

    /* Enviar formulario para loguear */
    const EnviarLoginForm = async (e) => {
        e.preventDefault()

        const datos = new FormData()

        datos.append('username', email)
        datos.append('password', password)
        

        const response = await fetch(`${UrlApiBaseUsuarios}/login`, {
            method: 'POST',
            body: datos
        })

        if (response.ok) {
            const data = await response.json()

            console.log(data)

            if (recordarEmail) {
                localStorage.setItem("email", email)
            } else {
                localStorage.removeItem("email")
            }

            localStorage.setItem("token", data.access)
            setMessage('Login exitoso')
            navigate('/')

            
        }else{ 
            const data = await response.json()
            setMessage(data.detail)            
        }
    }
    

    
    return (
        <LoginFormContainer>
            <h1>Iniciar sesion</h1>
            <LoginFormStyle onSubmit={EnviarLoginForm}>
                <input  type="email" placeholder="ingrese su email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="ingrese su contraseña" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            
                <label>
                    <input type='checkbox' checked={recordarEmail} onChange={(e) => setRecordarEmail(e.target.checked)}></input>
                    Recordar email
                </label>
                <button type="submit">Iniciar sesion</button>
            </LoginFormStyle>
            {message && <p>{message}</p>}
            <a href=''>Recuperar contraseña</a>
        </LoginFormContainer>
    )

}