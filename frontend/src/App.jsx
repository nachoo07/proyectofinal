import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentTable from "./components/student/StudentTable";
import StudentDetail from './pages/student/StudentDetail';
import { StudentProvider, StudentContext } from './context/student/StudentContext';

const App = () => {
  return (
    <Router>
      <StudentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students/new" element={<StudentDetail isNew={true} />} />
          <Route path="/students/:id" element={<StudentDetail />} />
        </Routes>
      </StudentProvider>
    </Router>
  );
};

// Vista principal con la tabla
const Home = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  return <StudentTable students={students} onDelete={deleteStudent} />;
};

export default App;
