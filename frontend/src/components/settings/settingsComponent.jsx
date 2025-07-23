import React from 'react';
import {
  Typography,
  Card,
} from '@mui/material';
import { FaDownload, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/settings/settingsContext';
import { useContext } from 'react';
import { LoginContext } from '../../context/login/LoginContext';
import './settingsComponent.css';

const SettingsComponent = () => {
  const { themeMode, toggleTheme, fontSize, setFontSize } = useSettings();
  const { logout } = useContext(LoginContext);

  const textColor = '#1b5e20';

  const settingsSections = [
    { 
      title: 'Descargar Manual', 
      description: 'Manual de usuario en PDF',
      action: 'download', 
      icon: <FaDownload size={30} color={textColor} />,
      color: '#f57c00'
    },
    { 
      title: 'Cerrar Sesión', 
      description: 'Salir de la aplicación',
      action: 'logout', 
      icon: <FaSignOutAlt size={30} color="white" />,
      color: '#d32f2f'
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

  const handleLogout = () => {
    logout();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/manualDeUsuario.pdf';
    link.download = 'manualDeUsuario.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = (action) => {
    if (action === 'download') {
      handleDownload();
    } else if (action === 'logout') {
      handleLogout();
    }
  };

  return (
    <div className="settings-dashboard-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="settings-dashboard-title">Configuración</h1>
        <div className="settings-dashboard-grid">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="settings-dashboard-item">
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
                  onClick={() => handleAction(section.action)}
                  className="settings-dashboard-card"
                  sx={{
                    '& .settings-dashboard-icon': {
                      backgroundColor: section.color
                    }
                  }}
                >
                  <div className="settings-dashboard-icon" style={{ backgroundColor: section.color }}>
                    {section.icon}
                  </div>
                  <Typography className="settings-dashboard-card-title" variant="h6" component="h3">
                    {section.title}
                  </Typography>
                  <Typography className="settings-dashboard-card-description" variant="body2">
                    {section.description}
                  </Typography>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsComponent;