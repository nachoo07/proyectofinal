import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { auth, loading: authLoading } = useContext(LoginContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:4000/api/users';

  const fetchUsers = useCallback(async () => {
    if (authLoading || !auth || auth !== 'admin') return; // Solo admins

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener usuarios');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [auth, authLoading]);

  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/create`, userData, {
        withCredentials: true,
      });
      await fetchUsers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, userData, {
        withCredentials: true,
      });
      await fetchUsers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        withCredentials: true,
      });
      await fetchUsers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUserState = useCallback(async (id, state) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_URL}/update/${id}/state`, { state }, {
        withCredentials: true,
      });
      await fetchUsers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar estado');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, auth, authLoading]);

  return (
    <UserContext.Provider value={{ users, loading, error, fetchUsers, createUser, updateUser, deleteUser, updateUserState }}>
      {children}
    </UserContext.Provider>
  );
};