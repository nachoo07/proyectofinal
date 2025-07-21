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
  const [tabValue, setTabValue] = useState(0);
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
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{
            borderColor: '#007F5F',
            color: '#007F5F',
            // HOVER ELIMINADO - MANTENEMOS EL MISMO ESTILO
            '&:hover': {
              backgroundColor: 'transparent', // Fondo transparente en hover
              color: '#007F5F',               // Texto verde en hover
              borderColor: '#007F5F',          // Borde verde en hover
            },
          }}
        >
          Volver
        </Button>
      </Box>

      <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h2" gutterBottom color="#007F5F">
          Gestión de Movimientos
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              color: '#007F5F',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              mx: 1,
              // HOVER ELIMINADO PARA PESTAÑAS NO SELECCIONADAS
              '&:hover': {
                backgroundColor: 'transparent', // Fondo transparente en hover
                color: '#007F5F',               // Texto verde en hover
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#007F5F',
              color: '#fff',
              // HOVER ELIMINADO PARA PESTAÑAS SELECCIONADAS
              '&:hover': {
                backgroundColor: '#007F5F', // Mantiene fondo verde en hover
                color: '#fff',              // Mantiene texto blanco en hover
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'transparent',
            },
          }}
        >
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

        {tabValue === 1 && (
          <MotionList
            onEdit={handleEditMotion}
            onDelete={handleDeleteMotion}
          />
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