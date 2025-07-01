// src/context/share/SharesProvider.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const SharesContext = createContext();

export const SharesProvider = ({ children }) => {
  const [studentsWithShares, setStudentsWithShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para formatear fecha a YYYY-MM-DD (elimina hora y zona)
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // Toma solo la parte YYYY-MM-DD
  };

  const fetchStudentsWithShares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/shares', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Normalizar fechas si es necesario
      const normalizedData = response.data.map(item => ({
        ...item,
        date: formatDateForInput(item.date),
        paymentdate: formatDateForInput(item.paymentdate),
        paymentdate_actual: formatDateForInput(item.paymentdate_actual),
      }));
      setStudentsWithShares(normalizedData);
      console.log('Datos normalizados de studentsWithShares:', normalizedData); // Depuración
    } catch (err) {
      setError('Error al cargar las cuotas. Verifica que el servidor esté corriendo en el puerto 4000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSharesByStudent = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/shares/student/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Normalizar fechas si es necesario
      const normalizedData = response.data.map(item => ({
        ...item,
        date: formatDateForInput(item.date),
        paymentdate: formatDateForInput(item.paymentdate),
        paymentdate_actual: formatDateForInput(item.paymentdate_actual),
      }));
      setStudentsWithShares(normalizedData);
    } catch (err) {
      setError('Error al cargar las cuotas del alumno.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createShare = async (shareData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/shares/create', shareData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const newShare = {
        ...shareData,
        share_id: response.data.id,
        name: studentsWithShares.find((s) => s.student_id === shareData.student_id)?.name,
        lastName: studentsWithShares.find((s) => s.student_id === shareData.student_id)?.lastName,
        dni: studentsWithShares.find((s) => s.student_id === shareData.student_id)?.dni,
        date: formatDateForInput(shareData.date),
        paymentdate: formatDateForInput(shareData.paymentdate),
        paymentdate_actual: formatDateForInput(shareData.paymentdate_actual),
      };
      setStudentsWithShares((prev) => [newShare, ...prev]);
      return response.data;
    } catch (err) {
      setError('Error al crear la cuota');
      console.error('Error:', err);
      throw err;
    }
  };

  const createMassShare = async (massShareData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/shares/create-mass', massShareData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchStudentsWithShares();
      return response.data;
    } catch (err) {
      setError('Error al crear cuotas masivas');
      console.error('Error:', err);
      throw err;
    }
  };

  const updateShare = async (shareId, updatedData) => {
    try {
      console.log('Enviando datos a update:', updatedData); // Depuración
      const response = await axios.put(`http://localhost:4000/api/shares/update/${shareId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudentsWithShares((prev) =>
        prev.map((item) =>
          item.share_id === shareId ? { ...item, ...updatedData } : item
        )
      );
      return response.data;
    } catch (err) {
      setError('Error al actualizar la cuota');
      console.error('Error detallado:', err);
      throw err;
    }
  };

  const deleteShare = async (shareId) => {
    try {
      await axios.delete(`http://localhost:4000/api/shares/delete/${shareId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudentsWithShares((prev) => prev.filter((item) => item.share_id !== shareId));
    } catch (err) {
      setError('Error al eliminar la cuota');
      console.error('Error:', err);
      throw err;
    }
  };

  const updateStudentStatus = async (studentId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/shares/students/${studentId}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Actualizar el estado local inmediatamente
      setStudentsWithShares((prev) =>
        prev.map((item) =>
          item.student_id === studentId ? { ...item, student_status: status } : item
        )
      );
      await fetchStudentsWithShares(); // Refrescar para asegurar consistencia
    } catch (err) {
      setError('Error al actualizar el estado del alumno');
      console.error('Error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStudentsWithShares();
  }, [fetchStudentsWithShares]);

  return (
    <SharesContext.Provider
      value={{
        studentsWithShares,
        loading,
        error,
        fetchStudentsWithShares,
        fetchSharesByStudent,
        createShare,
        createMassShare,
        updateShare,
        deleteShare,
        updateStudentStatus,
      }}
    >
      {children}
    </SharesContext.Provider>
  );
};