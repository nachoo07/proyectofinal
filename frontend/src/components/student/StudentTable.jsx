import React, { useState, useContext } from 'react';
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
import EditIcon from '@mui/icons-material/Edit'; // Importación añadida
import CancelIcon from '@mui/icons-material/Cancel';
import './student.css';

const StudentTable = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.address} ${student.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

  return (
    <Box
      sx={{
        mt: 8, // Espacio para el NavBar fijo
        backgroundColor: '#E6F9EC',
        minHeight: '100vh',
      }}
      className="main-container"
    >
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
          Gestión de Alumnos
        </Typography>
      </Box>

      <Box sx={{ mb: 4, maxWidth: '300px' }}>
        <TextField
          label="Buscar por nombre, dirección o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#00335c' },
              '&:hover fieldset': { borderColor: '#8eeab1' },
              '&.Mui-focused fieldset': { borderColor: '#8eeab1' },
            },
            '& .MuiInputLabel-root': { color: '#00335c' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#8eeab1' },
          }}
        />
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
              <TableCell>Dirección</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow sx={{ '&:hover': { backgroundColor: '#37fa82' } }}>
                <TableCell colSpan={4} className="table-cell" sx={{ textAlign: 'center' }}>
                  No se encontraron estudiantes.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="table-body-row"
                  sx={{
                    '&:hover': { backgroundColor: '#85E655' },
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell className="table-cell">{student.name}</TableCell>
                  <TableCell className="table-cell">{student.address}</TableCell>
                  <TableCell className="table-cell">{student.category}</TableCell>
                  <TableCell className="table-cell">
                    <Tooltip title="Ver estudiante">
                      <Button
                        component={Link}
                        to={`/students/${student.id}`}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minWidth: 'auto', mr: 1, cursor: 'pointer' }}
                      >
                        Ver
                      </Button>
                    </Tooltip>
                    <Tooltip title="Editar estudiante">
                      <Button
                        component={Link}
                        to={`/students/${student.id}?edit=true`}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minWidth: 'auto', mr: 1, cursor: 'pointer' }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Ver cuotas">
                      <Button
                        component={Link}
                        to={`/students/${student.id}/shares`}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minWidth: 'auto', mr: 1, cursor: 'pointer' }}
                      >
                        Cuotas
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar estudiante">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(student.id)}
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

      <Box sx={{ display: ' arquita', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          component={Link}
          to="/students/new"
          variant="contained"
          color="success"
          sx={{ cursor: 'pointer' }}
        >
          Crear Nuevo Estudiante
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate(-1)}
          sx={{ cursor: 'pointer' }}
        >
          Volver
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