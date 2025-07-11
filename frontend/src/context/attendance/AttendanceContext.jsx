
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LoginContext } from '../login/LoginContext'; // Ajusta la ruta según tu estructura

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [asistencias, setAsistencias] = useState([]);
  const { auth } = useContext(LoginContext);

  // Carga asistencias cuando la autenticación está lista
  useEffect(() => {
    const fetchData = async () => {
      if (auth === 'admin' || auth === 'user') {
        await obtenerAsistencias();
      }
    };
    fetchData();
  }, [auth]);

  // Obtener todas las asistencias
 const obtenerAsistencias = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/attendance/', {
      withCredentials: true,
    });
    const data = Array.isArray(response.data) ? response.data : response.data;
    // Asegúrate de que 'students' esté en la respuesta
    const students = data.students || [];
    const attendanceData = data.attendance || [];
    setAsistencias({ students, attendance: attendanceData });
  } catch (error) {
    console.error('Error al cargar las asistencias:', error);
    setAsistencias({ students: [], attendance: [] });
    Swal.fire('Error', 'No se pudieron cargar las asistencias', 'error');
  }
};

  // Agregar una nueva asistencia
  const agregarAsistencia = async (asistencia) => {
    if (auth === 'admin' || auth === 'user') {
      try {
        const response = await axios.post('http://localhost:4000/api/attendance/create', asistencia, {
          withCredentials: true,
        });
        setAsistencias((prev) => [...prev, response.data.attendance]);
        Swal.fire('Éxito', 'La asistencia ha sido creada correctamente', 'success');
      } catch (error) {
        console.error('Error al agregar asistencia:', error);
        Swal.fire('Error', 'Ha ocurrido un error al crear la asistencia', 'error');
        throw error;
      }
    }
  };

  // Actualizar una asistencia existente
  const actualizarAsistencia = async ({ date, category, attendance }) => {
    if (auth === 'admin' || auth === 'user') {
      try {
        const response = await axios.put('http://localhost:4000/api/attendance/update', {
          date,
          category,
          attendance,
        }, { withCredentials: true });
        setAsistencias((prev) =>
          prev.map((a) =>
            a.date === date && a.category === category
              ? { ...a, attendance: response.data.attendance }
              : a
          )
        );
        Swal.fire('Éxito', 'La asistencia ha sido actualizada correctamente', 'success');
      } catch (error) {
        console.error('Error al actualizar asistencia:', error);
        Swal.fire('Error', 'Ha ocurrido un error al actualizar la asistencia', 'error');
        throw error;
      }
    }
  };

  return (
    <AttendanceContext.Provider value={{ asistencias, agregarAsistencia, actualizarAsistencia, obtenerAsistencias }}>
      {children}
    </AttendanceContext.Provider>
  );
};
