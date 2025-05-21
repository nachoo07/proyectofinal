import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import es from 'date-fns/locale/es';
import { useMotions } from '../../context/motion/MotionContext';
import MotionList from './motionList.jsx';
import Navigato from '../navbar/Navigato.jsx';

const MotionComponent = () => {
  const {
    motions,
    loading,
    error,
    fetchMotions,
    createMotion,
    updateMotion,
    deleteMotion,
  } = useMotions();

  const [formData, setFormData] = useState({
    id: null,
    concept: '',
    amount: '',
    date: null,
    paymentMethod: '',
    incomeType: 'egreso',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      fetchMotions({ type: 'egreso' });
    } else {
      fetchMotions();
    }
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    //setFilters({ type: 'egreso' });
    fetchMotions({ type: 'egreso' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      const formattedData = {
        ...formData,
        date: formatDateToYYYYMMDD(formData.date),
      };
      if (isEditing) {
        await updateMotion(formData.id, formattedData);
      } else {
        await createMotion(formattedData);
      }
      // Resetea el formulario después de enviar
      setFormData({
        id: null,
        concept: '',
        amount: '',
        date: null,
        paymentMethod: '',
        incomeType: 'egreso',
      });
      setIsEditing(false);
      setLocalError('');
    } catch (err) {
      console.error(err);
      setLocalError('Error al guardar el movimiento');
    }
  };

  const handleDelete = async (id) => {
    deleteMotion(id);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      date: newDate,
    }));
  };

  const handleEdit = (motion) => {
    setFormData({
      id: motion.id,
      concept: motion.concept,
      amount: motion.amount,
      date: new Date(motion.date), // Asegúrate de que sea un objeto Date
      paymentMethod: motion.paymentMethod || '',
      incomeType: motion.incomeType || 'egreso',
    });
    setIsEditing(true);

  };

  const handleCancel = () => {
    setFormData({
      id: null,
      concept: '',
      amount: '',
      date: null,
      paymentMethod: '',
      incomeType: 'egreso',
    });
    setIsEditing(false);
    setLocalError(''); // Opcional: limpia errores locales
  };

  // ... resto de la lógica de MotionComponent igual que antes ...

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Navigato />
      <Typography variant="h4" gutterBottom>
        Gestión de Movimientos
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Egresos" />
        <Tab label="Todos los Movimientos" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="concept"
                  value={formData.concept}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monto"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Método de Pago"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Ej: Efectivo, Transferencia"
                />
              </Grid>
              <Grid item xs={12}>
                {(error || localError) && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error || localError}
                  </Alert>
                )}
                {loading && <CircularProgress sx={{ mb: 2 }} />}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {isEditing ? 'Actualizar' : 'Agregar'}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Tabla de Egresos */}
          <Typography variant="h5" gutterBottom>
            Lista de Egresos
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay egresos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  motions.map((motion) => (
                    <TableRow key={motion.id}>
                      <TableCell>{motion.concept}</TableCell>
                      <TableCell>${parseFloat(motion.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(motion.date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>{motion.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(motion)}
                          disabled={loading}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(motion.id)}
                          disabled={loading}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && <MotionList />}
    </Box>
  );
};

export default MotionComponent;