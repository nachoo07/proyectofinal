// src/pages/student/PageStudent.jsx
import React, { useContext } from 'react';
import { StudentContext } from '../../context/student/StudentContext';
import StudentTable from '../../components/student/StudentTable';

const PageStudent = () => {
  const { students, loading, deleteStudent } = useContext(StudentContext);

  if (loading) return <p>Cargando estudiantes...</p>;

  return (
    <div>
      <StudentTable students={students} onDelete={deleteStudent} />
    </div>
  );
};

export default PageStudent;
