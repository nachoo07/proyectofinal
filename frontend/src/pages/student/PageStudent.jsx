import React, { useContext } from 'react';
import { StudentContext } from "../../context/student/StudentContext";
import StudentTable from "../../components/student/StudentTable";

const StudentPage = () => {
  const { students, loading } = useContext(StudentContext);

  if (loading) return <p>Cargando estudiantes...</p>;

  return (
    <div>
      <h1>Lista de Estudiantes</h1>
      <StudentTable students={students} />
    </div>
  );
};

export default StudentPage;
