import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // URL base del backend (ajusta según tu configuración)
  const API_URL = 'http://localhost:4000/api/users';

  // Obtener todos los usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un usuario
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/create`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchUsers(); // Refrescar la lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Actualizar un usuario
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchUsers(); // Refrescar la lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Eliminar un usuario
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchUsers(); // Refrescar la lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Actualizar estado de un usuario
  const updateUserState = useCallback(async (id, state) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_URL}/update/${id}/state`, { state }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchUsers(); // Refrescar la lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Valor del contexto
  const value = {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserState,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};