import React from 'react';
import { StudentProvider } from './context/student/StudentContext';
import StudentPage from './pages/student/PageStudent';

function  App() {
  return (
    <StudentProvider>
      <StudentPage />
    </StudentProvider>
  );
};

export default App;