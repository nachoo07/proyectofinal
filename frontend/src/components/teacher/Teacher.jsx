import{ useContext, useState, useEffect } from 'react';
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
// import Navigato from '../navbar/Navigato';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import './teacher.css';

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
        padding: { xs: '20px', md: '40px' },
        mt: 4,
        backgroundColor: '#E6F9EC',
      }}
      className="main-container"
    >
      {/* <Navigato /> */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6,
          p: 2,
          background: 'linear-gradient(90deg, #8eeab1, #007e32)',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, color: '#00335c', mr: 2 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#00335c',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            letterSpacing: '0.05rem',
          }}
        >
          Gestión de Profesores
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mb: 4,
          borderRadius: '8px',
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead className="table-head">
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow sx={{ '&:hover': { backgroundColor: '#37fa82' } }}>
                <TableCell colSpan={6} className="table-cell" sx={{ textAlign: 'center' }}>
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow sx={{ '&:hover': { backgroundColor: '#37fa82' } }}>
                <TableCell colSpan={6} className="table-cell" sx={{ textAlign: 'center', color: 'red' }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow sx={{ '&:hover': { backgroundColor: '#37fa82' } }}>
                <TableCell colSpan={6} className="table-cell" sx={{ textAlign: 'center' }}>
                  No hay profesores registrados
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher, index) => (
                <TableRow
                  key={teacher.id}
                  className="table-body-row"
                  sx={{
                    '&:hover': { backgroundColor: '#85E655' },
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell className="table-cell">{teacher.name}</TableCell>
                  <TableCell className="table-cell">{teacher.lastName}</TableCell>
                  <TableCell className="table-cell">{teacher.email}</TableCell>
                  <TableCell className="table-cell">{teacher.phone || '-'}</TableCell>
                  <TableCell className="table-cell">{new Date(teacher.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="table-cell">
                    <Tooltip title="Editar profesor">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEditTeacher(teacher)}
                        sx={{ minWidth: 'auto', mr: 1, cursor: 'pointer' }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar profesor">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(teacher.id)}
                        sx={{ minWidth: 'auto', cursor: 'pointer' }}
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

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreateDialog}
          sx={{ cursor: 'pointer' }}
        >
          Crear Nuevo Profesor
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={onBack}
          sx={{ cursor: 'pointer' }}
        >
          Volver
        </Button>
      </Box>

      {/* Diálogo de Creación */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#E6F9EC',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #8eeab1, #007e32)',
            color: '#00335c',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <SchoolIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Crear Nuevo Profesor
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}> {/* Aumentado pt de 3 a 4 */}
          <TextField
            label="Nombre"
            name="name"
            value={newTeacherData.name}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={newTeacherData.lastName}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={newTeacherData.email}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={newTeacherData.phone}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#00335c',
              borderColor: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#8eeab1',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNewTeacher}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#8eeab1',
              color: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#007e32',
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Edición */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#E6F9EC',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #8eeab1, #007e32)',
            color: '#00335c',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Editar Profesor
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}> {/* Aumentado pt de 3 a 4 */}
          <TextField
            label="Nombre"
            name="name"
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={editData.lastName}
            onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00335c' },
                '&:hover fieldset': { borderColor: '#8eeab1' },
                '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#00335c',
              borderColor: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#8eeab1',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#8eeab1',
              color: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#007e32',
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#E6F9EC',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #8eeab1, #007e32)',
            color: '#00335c',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 28, color: '#00335c' }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}> {/* Aumentado pt de 3 a 4 */}
          <Typography sx={{ color: '#00335c', textAlign: 'center' }}>
            ¿Estás seguro de que quieres eliminar este profesor? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#00335c',
              borderColor: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#8eeab1',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: '#d32f2f',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teacher;