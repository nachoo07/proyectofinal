import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

export const SharesContext = createContext();

export const SharesProvider = ({ children }) => {
  const { auth, userData, loading: authLoading } = useContext(LoginContext);
  const [studentsWithShares, setStudentsWithShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const fetchStudentsWithShares = useCallback(async () => {
    if (authLoading || !auth || auth !== 'admin') return; // Solo admins

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/shares', {
        withCredentials: true,
      });
      const normalizedData = response.data.map((item) => ({
        ...item,
        date: formatDateForInput(item.date),
        paymentdate: formatDateForInput(item.paymentdate),
        paymentdate_actual: formatDateForInput(item.paymentdate_actual),
      }));
      setStudentsWithShares(normalizedData);
    } catch (err) {
      setError('Error al cargar las cuotas.');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [auth, authLoading]);

  const fetchSharesByStudent = useCallback(async (studentId) => {
    if (authLoading || !auth) return; // Esperar autenticación

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/shares/student/${studentId}`, {
        withCredentials: true,
      });
      const normalizedData = response.data.map((item) => ({
        ...item,
        date: formatDateForInput(item.date),
        paymentdate: formatDateForInput(item.paymentdate),
        paymentdate_actual: formatDateForInput(item.paymentdate_actual),
      }));
      setStudentsWithShares(normalizedData);
    } catch (err) {
      setError('Error al cargar las cuotas del alumno.');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [auth, authLoading]);

  const createShare = async (shareData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/shares/create', shareData, {
        withCredentials: true,
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
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const createMassShare = async (massShareData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/shares/create-mass', massShareData, {
        withCredentials: true,
      });
      await fetchStudentsWithShares();
      return response.data;
    } catch (err) {
      setError('Error al crear cuotas masivas');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateShare = async (shareId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/shares/update/${shareId}`, updatedData, {
        withCredentials: true,
      });
      setStudentsWithShares((prev) =>
        prev.map((item) => (item.share_id === shareId ? { ...item, ...updatedData } : item))
      );
      return response.data;
    } catch (err) {
      setError('Error al actualizar la cuota');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const deleteShare = async (shareId) => {
    try {
      await axios.delete(`http://localhost:4000/api/shares/delete/${shareId}`, {
        withCredentials: true,
      });
      setStudentsWithShares((prev) => prev.filter((item) => item.share_id !== shareId));
    } catch (err) {
      setError('Error al eliminar la cuota');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateStudentStatus = async (studentId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/shares/students/${studentId}/status`, { status }, {
        withCredentials: true,
      });
      setStudentsWithShares((prev) =>
        prev.map((item) => (item.student_id === studentId ? { ...item, student_status: status } : item))
      );
      await fetchStudentsWithShares();
    } catch (err) {
      setError('Error al actualizar el estado del alumno');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (auth === 'admin') {
      fetchStudentsWithShares();
    }
    // Comentado: Los usuarios no admin no tienen acceso a cuotas
    // else if (auth === 'user' && userData) {
    //   fetchSharesByStudent(userData.id);
    // }
  }, [auth, userData, fetchStudentsWithShares, fetchSharesByStudent]);

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