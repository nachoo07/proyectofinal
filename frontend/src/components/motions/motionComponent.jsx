import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
    deleteMotion, 
    fetchMotions
  } = useMotions();

  const [formData, setFormData] = useState({
    id: null,
    concept: '',
    amount: '',
    date: null,
    paymentMethod: '',
    incomeType: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState('');
  const [tabValue, setTabValue] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [motionToDelete, setMotionToDelete] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

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
    try {
      const formattedData = {
        ...motion,
        date: formatDateToYYYYMMDD(new Date()),
      };

      if (motion.id) {
        await updateMotion(motion.id, formattedData);
      } else {
        await createMotion(formattedData);
      }

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
      setOpenModal(false);
      setSuccessDialogOpen(true); // Mostrar modal de éxito
    } catch (err) {
      console.error(err);
      setLocalError('');
      setOpenModal(false);
      setErrorDialogOpen(true); // Mostrar modal de error
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
    setOpenModal(false);
  };

  const handleEditMotion = (motion) => {
    setFormData(motion);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDeleteMotion = (id) => {
    setMotionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMotion(motionToDelete);
      setDeleteDialogOpen(false);
      setMotionToDelete(null);
      await fetchMotions();
    } catch (err) {
      console.error('Error al eliminar movimiento', err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setMotionToDelete(null);
  };

  const closeSuccessDialog = async () => {
    setSuccessDialogOpen(false);
    setTabValue(1); // Ir a "Todos los Movimientos"
    await fetchMotions();
  };

  return (
    <>
      

      <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
         <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mb: 4,
          p: 2,
          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(67, 233, 123, 0.15)',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.01)' },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#00335c',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            letterSpacing: '0.08rem',
          }}
        >
          Gestión de Movimientos
        </Typography>
      </Box>

       <Tabs
  value={tabValue}
  onChange={handleTabChange}
  sx={{
    mb: 2,
    '& .MuiTab-root': {
      color: '#007F5F',
      fontWeight: 'bold',
      textTransform: 'none',
      borderRadius: 2,
      mx: 1,
    },
    '& .Mui-selected': {
      backgroundColor: '#007F5F',
      color: '#fff',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: 'transparent',
    },
  }}
>
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

        {tabValue === 1 && (
  <>
    {/* Botón para crear un nuevo movimiento */}
    <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
  {/* Botón Volver */}
  <Button
    variant="outlined"
    startIcon={<ArrowBackIcon />}
    onClick={() => window.history.back()}
    sx={{
      borderColor: '#007F5F',
      color: '#007F5F',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#007F5F',
        borderColor: '#007F5F',
      },
    }}
  >
    Volver
  </Button>

  {/* Botón Nuevo Movimiento */}
  <Button
    variant="contained"
    onClick={() => {
      setFormData({
        id: null,
        concept: '',
        amount: '',
        date: null,
        paymentMethod: '',
        incomeType: 'ingreso',
      });
      setIsEditing(false);
      setOpenModal(true);
    }}
    sx={{
      backgroundColor: '#007F5F',
      color: 'white',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#005F47',
      },
    }}
  >
    Nuevo Movimiento
  </Button>
</Box>


    {/* Lista de movimientos */}
    <MotionList
      onEdit={handleEditMotion}
      onDelete={handleDeleteMotion}
    />
  </>
)}

      </Box>

      {/* Modal para editar */}
      <Modal open={openModal} onClose={handleCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxWidth: 600,
            width: "100%",
          }}
        >
          <Formulario
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isEditing={isEditing}
            handleCancel={handleCancel}
          />
        </Box>
      </Modal>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>¿Estás segura/o?</DialogTitle>
        <DialogContent>
          Esta acción eliminará el movimiento de forma permanente.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de éxito */}
      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle>Movimiento guardado</DialogTitle>
        <DialogContent>
          El movimiento se creó o actualizó correctamente.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} autoFocus sx={{
            color: '#007F5F',
            fontWeight: 'bold'
          }}>
            Ver lista
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de error */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Error al guardar</DialogTitle>
        <DialogContent>
          Ocurrió un error al intentar guardar el movimiento.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} autoFocus sx={{
            color: '#007F5F',
            fontWeight: 'bold'
          }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MotionComponent;