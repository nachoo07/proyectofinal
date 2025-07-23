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
import { useNavigate } from 'react-router-dom';
import { TeacherContext } from '../../context/teacher/TeacherContext';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';

const Teacher = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Filtrar profesores según el término de búsqueda
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

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
      setCurrentPage(1); // Resetear página al crear un nuevo profesor
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
      // Ajustar página si es necesario después de eliminar
      if (filteredTeachers.length - 1 <= (currentPage - 1) * teachersPerPage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      toast.error(`Error al eliminar el profesor: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear página al cambiar el filtro
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  if (loading) {
    return (
      <Box
        sx={{
          mt: 8,
          backgroundColor: '#E6F9EC',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#1b5e20' }}>
          Cargando profesores...
        </Typography>
      </Box>
    );
  }

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
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          mb: 2,
          p: 1,
          borderRadius: '16px',
          background: '#e8f5e9',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: 'rgba(32, 129, 38, 1)',
            letterSpacing: '0.08rem',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: { xs: 1, md: 2 },
            flexGrow: 1,
            maxWidth: '900px',
            minWidth: '260px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
            p: { xs: 1, md: 2 },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            label="Buscar por Nombre o Apellido"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexDirection: 'row', width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="contained"
            onClick={handleOpenCreateDialog}
            color="success"
            sx={{
              borderRadius: '32px',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.5, md: 1 },
              minWidth: { xs: '120px', md: '160px' },
              flex: { xs: 1, md: 'none' },
            }}
          >
            Crear Nuevo
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '32px',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.5, md: 1 },
              minWidth: { xs: '120px', md: '160px' },
              flex: { xs: 1, md: 'none' },
            }}
          >
            Volver
          </Button>
        </Box>
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
        <Table sx={{ minWidth: { xs: 320, md: 650 } }}>
          <TableHead>
            <TableRow sx={{ background: '#208126ff' }}>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  borderTopLeftRadius: '16px',
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Nombre
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Apellido
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                  display: { xs: 'none', md: 'table-cell' },
                }}
              >
                Teléfono
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                  display: { xs: 'none', lg: 'table-cell' },
                }}
              >
                Fecha Creación
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  borderTopRightRadius: '16px',
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: 'center',
                    color: '#1b5e20',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1.1rem' },
                    p: { xs: 1.5, md: 4 },
                  }}
                >
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: 'center',
                    color: '#d32f2f',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1.1rem' },
                    p: { xs: 1.5, md: 4 },
                  }}
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : currentTeachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: 'center',
                    color: '#1b5e20',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1.1rem' },
                    p: { xs: 1.5, md: 4 },
                  }}
                >
                  No se encontraron profesores.
                </TableCell>
              </TableRow>
            ) : (
              currentTeachers.map((teacher, index) => (
                <TableRow
                  key={teacher.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {teacher.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {teacher.lastName}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                      wordBreak: 'break-word',
                    }}
                  >
                    {teacher.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {teacher.phone || '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                      display: { xs: 'none', lg: 'table-cell' },
                    }}
                  >
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', p: { xs: 0.25, md: 2 } }}>
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Tooltip title="Editar profesor">
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: '50%',
                            minWidth: { xs: 28, md: 40 },
                            height: { xs: 28, md: 40 },
                            p: 0,
                            backgroundColor: '#0288d1',
                            '&:hover': { backgroundColor: '#01579b' },
                          }}
                          size="small"
                          onClick={() => handleEditTeacher(teacher)}
                        >
                          <EditIcon sx={{ fontSize: { xs: 14, md: 20 } }} />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar profesor">
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: '50%',
                            minWidth: { xs: 28, md: 40 },
                            height: { xs: 28, md: 40 },
                            p: 0,
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' },
                          }}
                          size="small"
                          onClick={() => handleOpenDeleteDialog(teacher.id)}
                        >
                          <DeleteIcon sx={{ fontSize: { xs: 14, md: 20 } }} />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 0.5, md: 1 },
          mb: 0,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          size={window.innerWidth < 768 ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 2 } }}
        >
          Anterior
        </Button>
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handlePageClick(pageNum)}
              size={window.innerWidth < 768 ? 'small' : 'medium'}
              sx={{
                fontSize: { xs: '0.75rem', md: '1rem' },
                minWidth: { xs: 32, md: 40 },
                px: { xs: 1, md: 2 },
              }}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          size={window.innerWidth < 768 ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 2 } }}
        >
          Siguiente
        </Button>
      </Box>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
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
            background: '#e8f5e9',
            color: '#1b5e20',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <SchoolIcon sx={{ mr: 1, fontSize: 28, color: '#1b5e20' }} />
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={newTeacherData.lastName}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={newTeacherData.phone}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#1b5e20',
              borderColor: '#1b5e20',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#81c784',
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
              backgroundColor: '#4caf50',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
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
            background: '#e8f5e9',
            color: '#1b5e20',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 28, color: '#1b5e20' }} />
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={editData.lastName}
            onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            required
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#000000ff' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#1b5e20',
              borderColor: '#1b5e20',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#81c784',
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
              backgroundColor: '#4caf50',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
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
            background: '#e8f5e9',
            color: '#1b5e20',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: 2,
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 28, color: '#1b5e20' }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography sx={{ color: '#1b5e20', textAlign: 'center', fontWeight: 600 }}>
            ¿Estás seguro de que quieres eliminar este profesor? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#1b5e20',
              borderColor: '#1b5e20',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#81c784',
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