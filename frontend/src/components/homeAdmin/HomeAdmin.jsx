import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  FaUserGraduate, FaMoneyBillWave, FaUsers, FaChalkboardTeacher,
  FaCogs, FaChartBar, FaBell, FaExchangeAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Verde más suave
  const greenBg = '#a5d6a7'; // verde claro pastel
  const greenHover = '#81c784'; // un poco más oscuro para hover
  const textColor = '#1b5e20'; // verde oscuro para texto

  const sections = [
    { title: 'Estudiantes', route: '/students', icon: <FaUserGraduate size={40} color={textColor} /> },
    { title: 'Cuotas', route: '/shares', icon: <FaMoneyBillWave size={40} color={textColor} /> },
    { title: 'Usuarios', route: '/user', icon: <FaUsers size={40} color={textColor} /> },
    { title: 'Profesores', route: '/teachers', icon: <FaChalkboardTeacher size={40} color={textColor} /> },
    { title: 'Configuración', route: '/settings', icon: <FaCogs size={40} color={textColor} /> },
    { title: 'Reportes', route: '/reports', icon: <FaChartBar size={40} color={textColor} /> },
    { title: 'Notificaciones', route: '/notifications', icon: <FaBell size={40} color={textColor} /> },
    { title: 'Movimientos', route: '/motions', icon: <FaExchangeAlt size={40} color={textColor} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.15, when: "beforeChildren" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container className="p-4 d-flex justify-content-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
          {sections.map((section, idx) => (
            <Col key={idx}>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${greenHover}` }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onClick={() => navigate(section.route)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: greenBg,
                    color: textColor,
                    borderRadius: '12px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1.5rem',
                    boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                    userSelect: 'none',
                  }}
                >
                  <div className="mb-3">{section.icon}</div>
                  <Card.Title style={{ fontWeight: 'bold' }}>{section.title}</Card.Title>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Container>
  );
};

export default HomeAdmin;
