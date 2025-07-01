import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useMotions } from '../../context/motion/MotionContext';
import MotionList from './motionList.jsx';
import Formulario from './formulario.jsx';

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

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchMotions({ type: 'egreso' });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData((prev) => ({
      ...prev,
      incomeType: newValue === 0 ? 'egreso' : newValue === 2 ? 'ingreso' : prev.incomeType,
    }));
    if (newValue === 0) {
      fetchMotions({ type: 'egreso' });
    } else if (newValue === 2) {
      fetchMotions({ type: 'ingreso' });
    } else {
      fetchMotions();
    }
  };

  const handleSubmit = async (motion) => {
    console.log("AAAAAAAAAAAAAAAAAAAAA")
  try {
    const formattedData = {
      ...motion,
      date: formatDateToYYYYMMDD(motion.date),
    };
    console.log(formattedData)
    if (motion.id) {
      await updateMotion(motion.id, formattedData);
    } else {
      await createMotion(formattedData);
    }
    setFormData({
      id: null,
      concept: "",
      amount: "",
      date: null,
      paymentMethod: "",
      incomeType: tabValue === 0 ? "egreso" : "ingreso",
    });
    setIsEditing(false);
    setLocalError("");
    fetchMotions({ type: tabValue === 0 ? "egreso" : "ingreso" });
  } catch (err) {
    console.error(err);
    setLocalError(err.message || "Error al guardar el movimiento");
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteMotion(id);
      fetchMotions({ type: tabValue === 0 ? 'egreso' : 'ingreso' });
    } catch (err) {
      console.error(err);
      setLocalError('Error al eliminar el movimiento');
    }
  };

  const handleEdit = (motion) => {
    setFormData({
      id: motion.id,
      concept: motion.concept,
      amount: motion.amount,
      date: new Date(motion.date),
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
      incomeType: tabValue === 0 ? 'egreso' : 'ingreso',
    });
    setIsEditing(false);
    setLocalError('');
  };

  const renderTable = (title, motions) => (
    <>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {motions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay {title.toLowerCase()} registrados
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
                  <TableCell>{motion.incomeType === 'ingreso' ? 'Ingreso' : 'Egreso'}</TableCell>
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
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Movimientos
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Egresos" />
        <Tab label="Todos los Movimientos" />
        <Tab label="Ingresos" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Formulario
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            incomeType="egreso"
            isEditing={isEditing}
            handleCancel={handleCancel}
          />
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}
          {loading && <CircularProgress sx={{ mb: 2 }} />}
          {renderTable('Lista de Egresos', motions)}
        </>
      )}

      {tabValue === 1 && <MotionList />}

      {tabValue === 2 && (
        <>
          <Formulario
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            incomeType="ingreso"
            isEditing={isEditing}
            handleCancel={handleCancel}
          />
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}
          {loading && <CircularProgress sx={{ mb: 2 }} />}
          {renderTable('Lista de Ingresos', motions)}
        </>
      )}
      <Box sx={{ mt: 4 }}>
 
  {/* Placeholder para el chart, reemplazar con confirmación */}
  <Box sx={{ height: 300 }}>
    {/* Aquí irá el chart si confirmas */}
  </Box>
</Box>
    </Box>
    
  );
};

export default MotionComponent;