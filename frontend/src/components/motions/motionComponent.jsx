import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useMotions } from '../../context/motion/MotionContext';
import MotionList from './motionList.jsx';
import Formulario from './formulario.jsx';

const MotionComponent = () => {
  const {
    loading,
    error,
    createMotion,
    updateMotion,
  } = useMotions();

  const [formData, setFormData] = useState({
    id: null,
    concept: '',
    amount: '',
    paymentMethod: '',
    incomeType: '',
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData((prev) => ({
      ...prev,
      incomeType: newValue === 0 ? 'egreso' : newValue === 2 ? 'ingreso' : prev.incomeType,
    }));
  };

  const handleSubmit = async (motion) => {
    console.log("AAAAAAAAAAAAAAAAAAAAA")
    try {
      const formattedData = {
        ...motion,
        date: formatDateToYYYYMMDD(new Date()),
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
    } catch (err) {
      console.error(err);
      setLocalError(err.message || "Error al guardar el movimiento");
    }
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

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </Box>
      <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom color='#007F5F'>
          Gestión de Movimientos
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="Crear" />
          <Tab label="Todos los Movimientos" />
        </Tabs>

        {tabValue === 0 && (
          <>
            <Formulario
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isEditing={isEditing}
              handleCancel={handleCancel}
            />
            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error || localError}
              </Alert>
            )}
            {loading && <CircularProgress sx={{ mb: 2 }} />}
          </>
        )}

        {tabValue === 1 && <MotionList />}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ height: 300 }}>
            {/* Aquí irá el chart si confirmas */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MotionComponent;