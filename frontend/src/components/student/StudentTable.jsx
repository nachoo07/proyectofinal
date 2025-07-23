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
import { LoginContext } from '../../context/login/LoginContext';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import './student.css';

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const StudentTable = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  const { auth } = useContext(LoginContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const isAdmin = auth === 'admin';
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
          textAlign: 'center ',
        }}
      >
        <Typography variant="h6" color="#1b5e20">
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

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

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
          width: '80%',
          mb: 2,
          p: 1,
          borderRadius: '16px',
          background: '#e8f5e9'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            color: 'rgba(32, 129, 38, 1) !important', // Verde oscuro para consistencia
            letterSpacing: '0.08rem',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            letterSpacing: '0.08rem',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            
          }}
        >
          Gestión de Estudiantes
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
            label="Buscar por Nombre, Apellido o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size={window.innerWidth < 768 ? "small" : "medium"}
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
          <TextField
            select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{ native: true }}
            size={window.innerWidth < 768 ? "small" : "medium"}
            sx={{ minWidth: { xs: 100, md: 120 }, flexShrink: 0 }}
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexDirection: 'row', width: { xs: '100%', md: 'auto' } }}>
          {isAdmin && (
            <Button
              component={Link}
              to="/students/new"
              variant="contained"
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
          )}
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
                DNI
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
                Estado
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
            {currentStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: 'center',
                    color: '#1b5e20',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1.1rem' },
                    p: { xs: 1.5, md: 4 },
                  }}
                >
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
                  <TableCell
                    sx={{
                      color: '#1b5e20',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {student.name}
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
                    {student.lastName}
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
                    {student.dni}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', p: { xs: 0.5, md: 2 } }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '12px',
                        backgroundColor:
                          student.state?.trim().toLowerCase() === 'activo' ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: { xs: '0.7rem', md: '0.9rem' },
                        textTransform: 'uppercase',
                      }}
                    >
                      {capitalizeFirstLetter(student.state)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', p: { xs: 0.25, md: 2 } }}>
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Tooltip title="Ver estudiante">
                        <Button
                          component={Link}
                          to={`/students/${student.id}`}
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            borderRadius: '50%',
                            minWidth: { xs: 28, md: 40 },
                            height: { xs: 28, md: 40 },
                            p: 0,
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: { xs: 14, md: 20 } }} />
                        </Button>
                      </Tooltip>
                      {isAdmin && (
                        <>
                          <Tooltip title="Editar estudiante">
                            <Button
                              component={Link}
                              to={`/students/${student.id}?edit=true`}
                              variant="contained"
                              color="info"
                              size="small"
                              sx={{
                                borderRadius: '50%',
                                minWidth: { xs: 28, md: 40 },
                                height: { xs: 28, md: 40 },
                                p: 0,
                              }}
                            >
                              <EditIcon sx={{ fontSize: { xs: 14, md: 20 } }} />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Ver cuotas">
                            <Button
                              component={Link}
                              to={`/shares/student/${student.id}`}
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                borderRadius: '50%',
                                minWidth: { xs: 28, md: 40 },
                                height: { xs: 28, md: 40 },
                                p: 0,
                                fontSize: { xs: '0.7rem', md: '1rem' },
                              }}
                            >
                              $
                            </Button>
                          </Tooltip>
                          <Tooltip title="Eliminar estudiante">
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleOpenDeleteDialog(student.id)}
                              sx={{
                                borderRadius: '50%',
                                minWidth: { xs: 28, md: 40 },
                                height: { xs: 28, md: 40 },
                                p: 0,
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: { xs: 14, md: 20 } }} />
                            </Button>
                          </Tooltip>
                        </>
                      )}
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
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          size={window.innerWidth < 768 ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 2 } }}
        >
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
            background: '#e8f5e9', // Fondo sólido suave
            color: '#1b5e20', // Verde oscuro
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
          <Typography sx={{ color: '#1b5e20', textAlign: 'center' }}>
            ¿Estás seguro de que quieres eliminar este estudiante? Esta acción no se puede deshacer.
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

export default StudentTable;