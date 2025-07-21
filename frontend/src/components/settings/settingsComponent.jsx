import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
} from '@mui/material';
import { useSettings } from '../../context/settings/settingsContext';
import { useContext } from 'react';
import { LoginContext } from '../../context/login/LoginContext';

const SettingsComponent = () => {
  const { themeMode, toggleTheme, fontSize, setFontSize } = useSettings();

  const { logout } = useContext(LoginContext)

  const handleLogout = () => {
    logout();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/manualDeUsuario.pdf'; // ruta relativa desde public
    link.download = 'manualDeUsuario.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3, transition: 'all 0.3s ease' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Configuraciones
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Button
            onClick={handleDownload}
            variant="contained"
            color="warning"
            fullWidth
            sx={{ mb: 2 }}
          >
            Descargar Manual de Usuario
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
          >
            Cerrar Sesión
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default SettingsComponent;