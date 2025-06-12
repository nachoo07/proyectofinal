import { createContext, useState, useEffect } from 'react';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  // Traer todos los estudiantes
  const getAllStudents = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/student/");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  // Crear estudiante
  const createStudent = async (studentData) => {
    try {
      const res = await fetch("http://localhost:4000/api/student/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) {
        throw new Error("Error al crear el estudiante");
      }
  
      // Actualizamos la lista llamando a fetchStudents
      await getAllStudents();
    } catch (error) {
      throw new Error("Error al crear el estudiante: " + error.message);
    }
  };

  // Actualizar estudiante
  const updateStudent = async (id, studentData) => {
    try {
      const res = await fetch(`http://localhost:4000/api/student/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!res.ok) throw new Error(await res.text());
  
      await getAllStudents();
    } catch (error) {
      throw new Error("Error al actualizar estudiante: " + error.message);
    }
  };

  const refreshStudents = async () => {
    const res = await fetch("http://localhost:4000/api/student");
    const data = await res.json();
    setStudents(data);
  };

  // Borrar estudiante
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/student/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{ students, createStudent, updateStudent, deleteStudent, getAllStudents }}
    >
      {children}
    </StudentContext.Provider>
  );
};
