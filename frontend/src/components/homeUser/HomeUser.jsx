import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaBell, FaUserCheck, FaUser, FaUserGraduate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './homeUser.css';

const HomeUser = () => {
  const navigate = useNavigate();

  // Paleta de colores consistente
  const textColor = '#1b5e20';

  const sections = [
 
    { 
      title: 'Asistencias', 
      route: '/attendance', 
      icon: <FaUserCheck size={48} color={textColor} />,
      description: 'Consulta y registra tu asistencia'
    },
    { 
      title: 'Notificaciones', 
      route: '/notifications', 
      icon: <FaBell size={48} color={textColor} />,
      description: 'Revisa tus notificaciones importantes'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2, 
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
      transition: { duration: 0.5 }
    }
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="home-user-wrapper">
      <Container fluid className="home-user-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="home-user-content"
        >
          {/* Header de bienvenida */}
          <motion.div 
            className="home-user-header"
            variants={cardVariants}
          >
            <div className="home-user-welcome">
              <FaUser size={40} color={textColor} />
              <div className="home-user-welcome-text">
                <h1 className="home-user-title">Bienvenido</h1>
                <p className="home-user-subtitle">Panel de Usuario</p>
              </div>
            </div>
          </motion.div>

          {/* Grid de secciones */}
          <Row className="home-user-grid justify-content-center">
            {sections.map((section, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={4} className="home-user-col">
                <motion.div
                  variants={cardVariants}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="home-user-card-wrapper"
                  onClick={() => handleNavigation(section.route)}
                >
                  <Card className="home-user-card">
                    <Card.Body className="home-user-card-body">
                      <div className="home-user-icon-container">
                        {section.icon}
                      </div>
                      <h4 className="home-user-card-title">{section.title}</h4>
                      <p className="home-user-card-description">{section.description}</p>
                      <div className="home-user-card-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Footer informativo */}
          <motion.div 
            className="home-user-footer"
            variants={cardVariants}
          >
            
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default HomeUser;
