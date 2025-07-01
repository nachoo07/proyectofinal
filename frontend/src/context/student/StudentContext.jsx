import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/student", {
        withCredentials: true,
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const createStudent = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/student",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setStudents([...students, response.data]);
    } catch (error) {
      console.error("Error al crear el estudiante:", error);
      throw error;
    }
  };

  const updateStudent = async (id, formData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/student/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updated = students.map((s) =>
        s.id === parseInt(id) ? response.data : s
      );
      setStudents(updated);
    } catch (error) {
      console.error("Error al actualizar el estudiante:", error);
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
      console.error("Error al eliminar el estudiante:", error);
    }
  };

  

  return (
    <StudentContext.Provider
      value={{
        students,
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
