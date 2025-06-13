// src/pages/teacher/PageTeacher.jsx
import React from 'react';
import Teacher from '../../components/teacher/Teacher';

const PageTeacher = () => {
  return <Teacher onBack={() => window.history.back()} />;
};

export default PageTeacher;