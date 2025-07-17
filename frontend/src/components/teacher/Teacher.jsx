import { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from '@mui/material';
import { TeacherContext } from '../../context/teacher/TeacherContext';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';

const Teacher = ({ onBack }) => {
  const { teachers, loading, error, fetchTeachers, createTeacher, updateTeacher, deleteTeacher } = useContext(TeacherContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleOpenCreateDialog = () => {
    setNewTeacherData({ name: '', lastName: '', email: '', phone: '' });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleSaveNewTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacherData.name || !newTeacherData.lastName || !newTeacherData.email) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      await createTeacher(newTeacherData);
      toast.success('Profesor registrado exitosamente');
      await fetchTeachers();
      handleCloseCreateDialog();
    } catch (err) {
      toast.error(`Error al crear el profesor: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher.id);
    setEditData({
      name: teacher.name,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || '',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingTeacher(null);
    setEditData({ name: '', lastName: '', email: '', phone: '' });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editData.name || !editData.lastName || !editData.email) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      await updateTeacher(editingTeacher, editData);
      toast.success('Profesor actualizado exitosamente');
      await fetchTeachers();
      handleCloseEditDialog();
    } catch (err) {
      toast.error(`Error al actualizar el profesor: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  const handleOpenDeleteDialog = (teacherId) => {
    setTeacherToDelete(teacherId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTeacherToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTeacher(teacherToDelete);
      toast.success('Profesor eliminado exitosamente');
      await fetchTeachers();
    } catch (err) {
      toast.error(`Error al eliminar el profesor: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%)',
        minHeight: '100vh',
        p: { xs: 1, md: 2, lg: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
      }}
      className="teacher-container"
    >
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
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, color: '#00335c', mr: 2 }} />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#00335c',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            letterSpacing: '0.08rem',
          }}
        >
          Gestión de Profesores
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          mb: { xs: 2, md: 4 },
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreateDialog}
          sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' }, flex: 1 }}
        >
          Crear Nuevo Profesor
        </Button>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' }, color: '#00335c', borderColor: '#00335c', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' } }}
        >
          Volver
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(67, 233, 123, 0.10)',
          overflow: 'auto',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopLeftRadius: '16px', textAlign: 'center' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Apellido</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Email</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Teléfono</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Fecha Creación</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'red', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  No hay profesores registrados
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher, index) => (
                <TableRow
                  key={teacher.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{teacher.name}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{teacher.lastName}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{teacher.email}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{teacher.phone || '-'}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{new Date(teacher.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Tooltip title="Editar profesor">
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handleEditTeacher(teacher)}
                        sx={{ mr: 1, borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar profesor">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(teacher.id)}
                        sx={{ mr: 1, borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          <SchoolIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Crear Nuevo Profesor
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            label="Nombre"
            name="name"
            value={newTeacherData.name}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={newTeacherData.lastName}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={newTeacherData.email}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={newTeacherData.phone}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNewTeacher}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Editar Profesor
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            label="Nombre"
            name="name"
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={editData.lastName}
            onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography sx={{ color: '#00335c', textAlign: 'center' }}>¿Estás seguro de que quieres eliminar este profesor? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{ backgroundColor: '#d32f2f', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#b71c1c' }, fontWeight: 700 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teacher;