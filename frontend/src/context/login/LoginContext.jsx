import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem('authRole') || null);
  const [userData, setUserData] = useState(
    localStorage.getItem('authName') ? { name: localStorage.getItem('authName'), mail: localStorage.getItem('authMail') } : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // URL base del backend (ajusta según tu configuración)
  const API_URL = 'http://localhost:4000/api/auth';
  
  // Verificar autenticación al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      const authRole = localStorage.getItem('authRole');
      const authName = localStorage.getItem('authName');
      const authMail = localStorage.getItem('authMail');

      if (!authRole || !authName || !authMail) {
        setAuth(null);
        setUserData(null);
        setLoading(false);
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
        return;
      }

      try {
        setLoading(true);
        // Hacer una solicitud a una ruta protegida para verificar el token
        await axios.get(`${API_URL.replace('/auth', '')}/users`, { withCredentials: true }); // Ajusta esta ruta según tu backend
        setAuth(authRole);
        setUserData({ name: authName, mail: authMail });
      } catch (error) {
        console.error('Error al verificar autenticación:', error.response?.data || error.message);
        setAuth(null);
        setUserData(null);
        localStorage.removeItem('authRole');
        localStorage.removeItem('authName');
        localStorage.removeItem('authMail');
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const login = async (mail, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { mail, password }, { withCredentials: true });
      const { role, name, mail: userMail } = response.data.user;
      setAuth(role);
      setUserData({ name, mail: userMail });
      localStorage.setItem('authRole', role);
      localStorage.setItem('authName', name);
      localStorage.setItem('authMail', userMail);
      navigate(role === 'admin' ? '/' : '/homeuser', { replace: true });
      return role;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  const logout = async () => {
    try {
      setAuth(null);
      setUserData(null);
      localStorage.removeItem('authRole');
      localStorage.removeItem('authName');
      localStorage.removeItem('authMail');
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error.response?.data || error.message);
    }
  };

  // Interceptor para manejar errores de autenticación
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setAuth(null);
          setUserData(null);
          localStorage.removeItem('authRole');
          localStorage.removeItem('authName');
          localStorage.removeItem('authMail');
          navigate('/login', { replace: true });
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  return (
    <LoginContext.Provider value={{ auth, userData, login, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};