import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosRequest } from '../../../services/api/apiClient';
import {
    Campo,
    CampoInput,
    FormMessage,
    LoginLink,
    RegisterButton,
    RegisterContainer,
    RegisterForm,
    RegisterHeader
} from './Register.styles';

const initialForm = { username: '', email: '', password: '', confirmPassword: '' };

const getErrorMessage = (detail) => {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map((error) => error.msg).join('. ');
    return 'No se pudo crear la cuenta.';
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [mensaje, setMensaje] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((actual) => ({ ...actual, [name]: value }));
        setMensaje(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMensaje({ error: 'Las contraseñas no coinciden.' });
            return;
        }

        setEnviando(true);
        setMensaje(null);
        try {
            const response = await usuariosRequest('/users', {
                method: 'POST',
                body: {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                setMensaje({ error: getErrorMessage(data.detail) });
                return;
            }

            setMensaje({ texto: 'Cuenta creada. Revisá tu correo para activarla.' });
            setTimeout(() => navigate('/login'), 2200);
        } catch (error) {
            console.error('Error de red al registrarse:', error);
            setMensaje({ error: 'Error de conexión con el servidor.' });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <RegisterContainer>
            <RegisterHeader>
                <h1>Crear cuenta</h1>
                <p>Registrate para comprar en la tienda.</p>
            </RegisterHeader>
            <RegisterForm onSubmit={handleSubmit}>
                <Campo htmlFor="username">Nombre de usuario
                    <CampoInput id="username" name="username" value={formData.username} onChange={handleChange} required minLength={3} autoComplete="username" />
                </Campo>
                <Campo htmlFor="email">Correo electrónico
                    <CampoInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                </Campo>
                <Campo htmlFor="password">Contraseña
                    <CampoInput id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
                </Campo>
                <Campo htmlFor="confirmPassword">Repetir contraseña
                    <CampoInput id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required minLength={6} autoComplete="new-password" />
                </Campo>
                <RegisterButton type="submit" disabled={enviando}>{enviando ? 'Creando cuenta...' : 'Registrarme'}</RegisterButton>
            </RegisterForm>
            {mensaje && <FormMessage $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</FormMessage>}
            <LoginLink>¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link></LoginLink>
        </RegisterContainer>
    );
};