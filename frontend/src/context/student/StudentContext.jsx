
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../login/LoginContext';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { auth, loading: authLoading } = useContext(LoginContext);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    if (authLoading || !auth) return; // Espera autenticación, permite 'admin' y 'user' para depuración
    try {
      const response = await axios.get('http://localhost:4000/api/student/', {
        withCredentials: true,
      });
      const data = Array.isArray(response.data) ? response.data : [];
      const studentsWithCategory = data.map(student => ({
        ...student,
        category: student.category || 'Sin categoría', // Maneja NULL o ausencia de category
      }));
      setStudents(studentsWithCategory);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error.response?.data || error.message);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [auth, authLoading]);

  const createStudent = async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/student/create', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStudents([...students, response.data]);
    } catch (error) {
      console.error('Error al crear el estudiante:', error.response?.data || error.message);
      throw error;
    }
  };

  const updateStudent = async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/student/${id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStudents(students.map((s) => (s.id === parseInt(id) ? response.data : s)));
    } catch (error) {
      console.error('Error al actualizar el estudiante:', error.response?.data || error.message);
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/student/${id}`, {
        withCredentials: true,
      });
      setStudents(students.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error.response?.data || error.message);
    }
  };

  return (
    <StudentContext.Provider value={{ students, fetchStudents, createStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
