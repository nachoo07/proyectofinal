// src/context/teacher/TeacherContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/teachers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTeachers(response.data);
    } catch (err) {
      setError('Error al cargar los profesores. Verifica que el servidor esté corriendo en el puerto 4000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeacher = async (teacherData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/teachers/create', teacherData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTeachers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Error al crear el profesor');
      console.error('Error:', err);
      throw err;
    }
  };

  const updateTeacher = async (teacherId, updatedData) => {
    try {
      await axios.put(`http://localhost:4000/api/teachers/edit/${teacherId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === teacherId ? { ...teacher, ...updatedData } : teacher))
      );
    } catch (err) {
      setError('Error al actualizar el profesor');
      console.error('Error:', err);
      throw err;
    }
  };

  const deleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teachers/delete/${teacherId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
    } catch (err) {
      setError('Error al eliminar el profesor');
      console.error('Error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

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