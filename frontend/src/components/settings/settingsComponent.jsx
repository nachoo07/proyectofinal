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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useSettings } from '../../context/settings/settingsContext';

const SettingsComponent = () => {
  const { themeMode, toggleTheme, fontSize, setFontSize } = useSettings();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ severity: 'info', text: '' });

  const showAlert = (severity, message) => {
    setAlertMessage({ severity, text: message });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
    showAlert('success', 'Sesión cerrada correctamente');
  };

  const handleChangeUser = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
    showAlert('info', 'Preparando cambio de usuario...');
  };

  const handleForgotPassword = () => {
    setOpenDialog(true);
  };

  const confirmPasswordReset = async () => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        showAlert('success', 'Enlace para restablecer contraseña enviado a tu email');
      } else {
        showAlert('error', 'Error al enviar el enlace. Intenta de nuevo.');
      }
    } catch (error) {
      showAlert('error', 'Error de red. Por favor, intenta de nuevo.');
    }
    handleCloseDialog();
  };

  const handleTutorial = () => {
    window.location.href = '/tutorial';
    showAlert('info', 'Iniciando tutorial...');
  };

  const handleProfile = () => {
    window.location.href = '/profile/edit';
    showAlert('info', 'Redirigiendo a edición de perfil');
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3, transition: 'all 0.3s ease' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Configuraciones
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tema
            </Typography>
            <Button
              onClick={toggleTheme}
              variant="contained"
              color="primary"
              fullWidth
            >
              Cambiar a {themeMode === 'light' ? 'Oscuro' : 'Claro'}
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="font-size-label">Tamaño de fuente</InputLabel>
              <Select
                labelId="font-size-label"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                label="Tamaño de fuente"
              >
                <MenuItem value="small">Pequeño</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="large">Grande</MenuItem>
              </Select>
            </FormControl>
           
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button
            onClick={handleForgotPassword}
            variant="contained"
            color="warning"
            fullWidth
            sx={{ mb: 2 }}
          >
            Olvidaste tu contraseña
          </Button>
          <Button
            onClick={handleTutorial}
            variant="contained"
            color="success"
            fullWidth
            sx={{ mb: 2 }}
          >
            Ver Tutorial
          </Button>
          <Button
            onClick={handleProfile}
            variant="contained"
            sx={{ backgroundColor: 'purple', '&:hover': { backgroundColor: 'purple.dark' }, mb: 2 }}
            fullWidth
          >
            Editar Perfil
          </Button>
          <Button
            onClick={handleChangeUser}
            variant="contained"
            sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'orange.dark' }, mb: 2 }}
            fullWidth
          >
            Cambiar de usuario
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertMessage.severity}
          sx={{ width: '100%' }}
        >
          {alertMessage.text}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>¿Olvidaste tu contraseña?</DialogTitle>
        <DialogContent>
          Se enviará un enlace para restablecer tu contraseña al email asociado a tu cuenta.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={confirmPasswordReset} color="primary" variant="contained">
            Enviar enlace
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsComponent;