import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const { auth, loading: authLoading } = useContext(LoginContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachers = useCallback(async () => {
    if (authLoading || !auth || auth !== 'admin') return; // Solo admins

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/teachers', {
        withCredentials: true,
      });
      setTeachers(response.data);
    } catch (err) {
      setError('Error al cargar los profesores.');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [auth, authLoading]);

  const createTeacher = async (teacherData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/teachers/create', teacherData, {
        withCredentials: true,
      });
      setTeachers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Error al crear el profesor');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const updateTeacher = async (teacherId, updatedData) => {
    try {
      await axios.put(`http://localhost:4000/api/teachers/edit/${teacherId}`, updatedData, {
        withCredentials: true,
      });
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === teacherId ? { ...teacher, ...updatedData } : teacher))
      );
    } catch (err) {
      setError('Error al actualizar el profesor');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  const deleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teachers/delete/${teacherId}`, {
        withCredentials: true,
      });
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
    } catch (err) {
      setError('Error al eliminar el profesor');
      console.error('Error:', err.response?.data || err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers, auth, authLoading]);

  return (
    <TeacherContext.Provider
      value={{
        teachers,
        loading,
        error,
        fetchTeachers,
        createTeacher,
        updateTeacher,
        deleteTeacher,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};