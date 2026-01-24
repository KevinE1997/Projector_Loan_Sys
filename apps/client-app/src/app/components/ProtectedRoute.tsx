import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles?: string[]; // Opcional: Lista de roles permitidos para esta ruta
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Asumiremos que guardamos el rol al hacer login

  // 1. Si no hay token, fuera (al Login)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta exige roles específicos y el usuario no lo tiene
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Si intenta entrar a algo de admin siendo usuario, lo mandamos al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Si todo está bien, renderiza la página solicitada
  return <Outlet />;
};