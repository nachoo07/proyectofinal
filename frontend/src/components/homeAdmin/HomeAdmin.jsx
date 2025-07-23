import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import {
  FaUserGraduate, FaMoneyBillWave, FaUsers, FaChalkboardTeacher,
  FaCogs, FaChartBar, FaBell, FaExchangeAlt, FaUserCheck
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './homeAdmin.css';

const HomeAdmin = () => {
  const navigate = useNavigate();

  const textColor = '#16801dff';

  const sections = [
    { title: 'Estudiantes', route: '/students', icon: <FaUserGraduate size={30} color={textColor} /> },
    { title: 'Cuotas', route: '/shares', icon: <FaMoneyBillWave size={30} color={textColor} /> },
    { title: 'Usuarios', route: '/user', icon: <FaUsers size={30} color={textColor} /> },
    { title: 'Profesores', route: '/teachers', icon: <FaChalkboardTeacher size={30} color={textColor} /> },
    { title: 'Configuración', route: '/settings', icon: <FaCogs size={30} color={textColor} /> },
    { title: 'Reportes', route: '/reports', icon: <FaChartBar size={30} color={textColor} /> },
    { title: 'Notificaciones', route: '/notifications', icon: <FaBell size={30} color={textColor} /> },
    { title: 'Movimientos', route: '/motions', icon: <FaExchangeAlt size={30} color={textColor} /> },
    { title: 'Asistencia', route: '/attendance', icon: <FaUserCheck size={30} color={textColor} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1, 
        when: "beforeChildren" 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="admin-dashboard-title">Panel de Administración</h1>
        <div className="admin-dashboard-grid">
          {sections.map((section, idx) => (
            <div key={idx} className="admin-dashboard-item">
              <motion.div
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -8
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onClick={() => navigate(section.route)}
                  className="admin-dashboard-card"
                >
                  <div className="admin-dashboard-icon">
                    {section.icon}
                  </div>
                  <Card.Title className="admin-dashboard-card-title">
                    {section.title}
                  </Card.Title>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeAdmin;