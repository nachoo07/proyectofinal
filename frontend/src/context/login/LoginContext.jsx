import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // Role: 'admin' or 'user'
  const [userData, setUserData] = useState(null); // { id, name, mail }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = 'http://localhost:4000/api/auth'; // Ajusta al puerto correcto del backend

  // Configurar Axios
  axios.defaults.withCredentials = true;

  // Verificar autenticación al montar, excepto en /login
  useEffect(() => {
    const checkAuth = async () => {
      if (location.pathname === '/login') {
        setLoading(false);
        return; 
      }

      try {
        const response = await axios.get(`${API_URL}/protected`);
        console.log('Auth check successful:', response.data);
        setAuth(response.data.user.role);
        setUserData({
          id: response.data.user.userId,
          name: response.data.user.name,
          mail: response.data.user.mail,
        });
      } catch (error) {
        console.error('Error en checkAuth:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setAuth(null);
        setUserData(null);
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, location]);

  // Login
  const login = async (mail, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { mail, password });
      setAuth(response.data.user.role);
      setUserData({
        id: response.data.user.id,
        name: response.data.user.name,
        mail: response.data.user.mail,
      });

      navigate(response.data.user.role === 'admin' ? '/' : '/homeuser', { replace: true });

      return response.data.user.role;
    } catch (error) {
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      setAuth(null);
      setUserData(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error.response?.data || error.message);
    }
  };

  // Refrescar access token
  const refreshToken = async () => {
    try {
      await axios.post(`${API_URL}/refresh`);
      const response = await axios.get(`${API_URL}/protected`);
      setAuth(response.data.user.role);
      setUserData({
        id: response.data.user.userId,
        name: response.data.user.name,
        mail: response.data.user.mail,
      });
      return true;
    } catch (error) {
      console.error('Error en refreshToken:', error.response?.data || error.message);
      setAuth(null);
      setUserData(null);
      navigate('/login', { replace: true });
      return false;
    }
  };

  // Interceptor para manejar errores de autenticación
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.response?.data?.message === 'Token expirado.') {
          const refreshed = await refreshToken();
          if (refreshed) {
            return axios(error.config);
          }
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          setAuth(null);
          setUserData(null);
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate, location]);

  return (
    <LoginContext.Provider value={{ auth, userData, login, logout, loading, refreshToken }}>
      {children}
    </LoginContext.Provider>
  );
};