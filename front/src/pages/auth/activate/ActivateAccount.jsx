import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usuariosRequest } from '../../../services/api/apiClient';
import {
  ActivateContainer,
  ActivateTitle,
  ActivateMessage,
  ActivateLink
} from './ActivateAccount.styles';

const ActivateAccount = () => {
  const { token } = useParams();
  const [estado, setEstado] = useState('cargando');
  const [mensaje, setMensaje] = useState('Activando tu cuenta...');

  useEffect(() => {
    const activarCuenta = async () => {
      try {
        const response = await usuariosRequest(`/activate_account/${token}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setEstado('error');
          setMensaje(data.detail?.message || data.detail || 'El enlace de activación no es válido.');
          return;
        }
        setEstado('exito');
        setMensaje(data.message || 'Cuenta activada con éxito.');
      } catch (error) {
        console.error('Error activando cuenta:', error);
        setEstado('error');
        setMensaje('No se pudo validar el enlace de activación.');
      }
    };

    activarCuenta();
  }, [token]);

  return (
    <ActivateContainer>
      <ActivateTitle $error={estado === 'error'}>
        {estado === 'cargando' ? 'Activando cuenta' : estado === 'exito' ? 'Cuenta activada' : 'No se pudo activar'}
      </ActivateTitle>
      <ActivateMessage>{mensaje}</ActivateMessage>
      {estado !== 'cargando' && <ActivateLink as={Link} to="/login">Ir al inicio de sesión</ActivateLink>}
    </ActivateContainer>
  );
};

export default ActivateAccount;
