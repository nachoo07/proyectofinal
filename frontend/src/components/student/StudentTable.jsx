import { useState, useContext, useEffect } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/student/StudentContext';
import { toast } from 'react-toastify';
import SchoolIcon from '@mui/icons-material/School';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import './student.css';

const StudentTable = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const navigate = useNavigate();

  if (!students) {
    return (
      <Box
        sx={{
          mt: 8,
          backgroundColor: '#E6F9EC',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="#00335c">
          Cargando estudiantes...
        </Typography>
      </Box>
    );
  }

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      student.name.toLowerCase().startsWith(search) ||
      student.lastName.toLowerCase().startsWith(search) ||
      student.dni.toLowerCase().startsWith(search);

    const matchesStatus =
      statusFilter === 'Todos' ||
      student.state?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Paginación: calcular total páginas
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Obtener estudiantes para la página actual
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Cambiar página cuando cambie filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleOpenDeleteDialog = (studentId) => {
    setStudentToDelete(studentId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStudent(studentToDelete);
      toast.success('Estudiante eliminado exitosamente');
    } catch (err) {
      toast.error(`Error al eliminar el estudiante: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Funciones paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
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
      className="main-container"
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
        <SchoolIcon sx={{ fontSize: 48, color: '#00335c', mr: 2 }} />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#00335c',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            letterSpacing: '0.08rem',
          }}
        >
          Gestión de Alumnos
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
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flexGrow: 1,
            maxWidth: '900px',
            minWidth: '260px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
            p: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            label="Buscar por Nombre, Apellido o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ minWidth: 120 }}
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/students/new" variant="contained" color="success" sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' } }}>
            Crear Nuevo
          </Button>
          <Button variant="outlined" color="success" onClick={() => navigate(-1)} sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' } }}>
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
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopLeftRadius: '16px', textAlign: 'center' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Apellido</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>DNI</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Estado</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  No se encontraron estudiantes.
                </TableCell>
              </TableRow>
            ) : (
              currentStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.name}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.lastName}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.dni}</TableCell>
                  <TableCell sx={{ color: student.state === 'Activo' ? '#388e3c' : '#d32f2f', fontWeight: 700, textAlign: 'center' }}>{student.state}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Ver estudiante">
                        <Button
                          component={Link}
                          to={`/students/${student.id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          <SchoolIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Editar estudiante">
                        <Button
                          component={Link}
                          to={`/students/${student.id}?edit=true`}
                          variant="contained"
                          color="info"
                          size="small"
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Ver cuotas">
                        <Button
                          component={Link}
                          to={`/shares/student/${student.id}`}
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          $ {/* Puedes cambiar por un ícono de dinero si lo prefieres */}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar estudiante">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(student.id)}
                          sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                        >
                          <DeleteIcon />
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

      {/* Controles de paginación */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          mb: 0,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </Button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'contained' : 'outlined'}
              onClick={() => handlePageClick(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button variant="outlined" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
          Siguiente
        </Button>
      </Box>

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
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography sx={{ color: '#00335c', textAlign: 'center' }}>
            ¿Estás seguro de que quieres eliminar este estudiante? Esta acción no se puede deshacer.
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

export default StudentTable;
