// src/context/SharesContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SharesContext = createContext();

export const SharesProvider = ({ children }) => {
  const [studentsWithShares, setStudentsWithShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener las cuotas
  const fetchStudentsWithShares = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/shares', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudentsWithShares(response.data);
    } catch (err) {
      setError('Error al cargar las cuotas. Verifica que el servidor esté corriendo en el puerto 4000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una cuota
  const updateShare = async (shareId, updatedData) => {
    try {
      await axios.put(`http://localhost:4000/api/shares/update/${shareId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Actualizar el estado local
      setStudentsWithShares((prev) =>
        prev.map((item) =>
          item.share_id === shareId ? { ...item, ...updatedData } : item
        )
      );
    } catch (err) {
      setError('Error al actualizar la cuota');
      console.error('Error:', err);
      throw err;
    }
  };

  // Cargar las cuotas al montar el componente
  useEffect(() => {
    fetchStudentsWithShares();
  }, []);

  return (
    <SharesContext.Provider
      value={{
        studentsWithShares,
        loading,
        error,
        fetchStudentsWithShares,
        updateShare,
      }}
    >
      {children}
    </SharesContext.Provider>
  );
};