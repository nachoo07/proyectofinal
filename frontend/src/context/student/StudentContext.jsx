import React, { createContext, useEffect, useState } from 'react';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/student');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider value={{ students, loading }}>
      {children}
    </StudentContext.Provider>
  );
};
