import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import {
  FaChartLine,
  FaCalendarAlt,
  FaCalendarWeek,
  FaCalendarCheck,
  FaCreditCard,
  FaCalendarDay,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../homeAdmin/homeAdmin.css'; // se reutiliza el mismo CSS

const DashboardReport = () => {
  const navigate = useNavigate();
  const textColor = '#1b5e20';

  const cards = [
    {
      title: 'Balance Semanal',
      route: '/reportbyweek',
      icon: <FaCalendarWeek size={40} color={textColor} />,
    },
    {
      title: 'Balance Trimestral',
      route: '/reportbyquarter',
      icon: <FaCalendarCheck size={40} color={textColor} />,
    },
    {
      title: 'Balance Anual',
      route: '/reports',
      icon: <FaChartLine size={40} color={textColor} />,
    },
    {
      title: 'Métricas de Pagos',
      route: '/reportbypaymethod',
      icon: <FaCreditCard size={40} color={textColor} />,
    },
    {
      title: 'Balance Mensual',
      route: '/reportbymonth',
      icon: <FaCalendarDay size={40} color={textColor} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="admin-dashboard-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <div className="admin-dashboard-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="admin-dashboard-item">
              <motion.div
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onClick={() => navigate(card.route)}
                  className="admin-dashboard-card"
                >
                  <div className="admin-dashboard-icon">{card.icon}</div>
                  <Card.Title className="admin-dashboard-card-title">
                    {card.title}
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

export default DashboardReport;
