import { useAuth } from '../services/auth/useAuth';

export const useUserRole = () => {
  const { usuario } = useAuth();
  return usuario?.rol || null;
};