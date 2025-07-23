import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaBell, FaUserCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './homeUser.css';

const HomeUser = () => {
  const navigate = useNavigate();

  const textColor = '#1b5e20';

  const sections = [
    { title: 'Asistencias', route: '/attendance', icon: <FaUserCheck size={40} color={textColor} /> },
    { title: 'Notificaciones', route: '/notifications', icon: <FaBell size={40} color={textColor} /> },
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
    <div className="user-dashboard-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="user-dashboard-title">Panel de Usuario</h1>
        <div className="user-dashboard-grid">
          {sections.map((section, idx) => (
            <div key={idx} className="user-dashboard-item">
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
                  className="user-dashboard-card"
                  style={{
                    minWidth: '300px',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '16px',
                    boxShadow: '0 6px 24px rgba(67, 233, 123, 0.15)',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="user-dashboard-icon"
                    style={{
                      marginBottom: '16px',
                    }}
                  >
                    {section.icon}
                  </div>
                  <Card.Title
                    className="user-dashboard-card-title"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: textColor,
                      textAlign: 'center',
                    }}
                  >
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

export default HomeUser;