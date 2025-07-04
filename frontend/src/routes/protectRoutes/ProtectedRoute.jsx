import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginContext } from '../../context/login/LoginContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth, loading } = useContext(LoginContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth)) {
    return <Navigate to="/homeuser" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
