// src/pages/share/PageStudentShares.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentShares from '../../components/share/StudentShares'; // Importamos el componente

const PageStudentShares = () => {
  const { studentId } = useParams(); // Obtenemos el studentId de la URL
  const navigate = useNavigate(); // Para manejar la navegación

  // Función para manejar el botón "Volver"
  const handleBack = () => {
    navigate('/shares');
  };

  return <StudentShares studentId={studentId} onBack={handleBack} />;
};

export default PageStudentShares;