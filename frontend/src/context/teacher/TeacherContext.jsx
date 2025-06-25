import React, { createContext, useState } from "react";

export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);

  return (
    <TeacherContext.Provider value={{ teachers, setTeachers }}>
      {children}
    </TeacherContext.Provider>
  );
};
