import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentContext } from '../../context/student/StudentContext';
import { toast } from 'react-toastify';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const NewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, createStudent, updateStudent } = useContext(StudentContext);
  const [student, setStudent] = useState({
    lastname: '',
    name: '',
    dni: '',
  });

  useEffect(() => {
    if (id) {
      const studentToEdit = students.find((s) => s.id.toString() === id);
      if (studentToEdit) {
        setStudent({
          lastname: studentToEdit.lastName || studentToEdit.lastname || '', // Maneja ambas propiedades
          name: studentToEdit.name || '',
          dni: studentToEdit.dni || '',
        });
      }
    }
  }, [id, students]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student.lastname || !student.name || !student.dni) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      if (id) {
        await updateStudent(id, student);
        toast.success('Estudiante actualizado exitosamente');
      } else {
        await createStudent(student);
        toast.success('Estudiante registrado exitosamente');
      }
      navigate('/students');
    } catch (err) {
      toast.error(`Error al guardar el estudiante: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  return (
    <Box
      className="new-student-container"
      sx={{
        backgroundColor: '#e8f5e9 !important',
        height: 'auto !important',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: { xs: 1, md: 1.5 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450, // Más pequeño
          width: '100%',
          borderRadius: '10px !important',
          backgroundColor: '#ffffff !important',
          p: { xs: 1.5, md: 2 },
          mx: 'auto',
          boxShadow: '0 3px 10px rgba(0, 128, 0, 0.1) !important',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 5px 14px rgba(0, 128, 0, 0.15) !important',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1b5e20 !important',
              letterSpacing: '0.05em',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
            }}
          >
            {id ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
            <TextField
              label="Apellido"
              name="lastname"
              value={student.lastname}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px !important',
                  backgroundColor: '#f5f5f5 !important',
                  '&:hover': { backgroundColor: '#e8f5e9 !important' },
                },
                '& .MuiInputLabel-root': {
                  color: '#2e7d32 !important',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20 !important' },
              }}
            />
            <TextField
              label="Nombre"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px !important',
                  backgroundColor: '#f5f5f5 !important',
                  '&:hover': { backgroundColor: '#e8f5e9 !important' },
                },
                '& .MuiInputLabel-root': {
                  color: '#2e7d32 !important',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20 !important' },
              }}
            />
            <TextField
              label="DNI"
              name="dni"
              value={student.dni}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px !important',
                  backgroundColor: '#f5f5f5 !important',
                  '&:hover': { backgroundColor: '#e8f5e9 !important' },
                },
                '& .MuiInputLabel-root': {
                  color: '#2e7d32 !important',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20 !important' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon sx={{ fontSize: { xs: 14, md: 16 } }} />}
              onClick={() => navigate('/students')}
              sx={{
                color: '#2e7d32 !important',
                borderColor: '#2e7d32 !important',
                borderRadius: '14px !important',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                px: { xs: 1.5, md: 2 },
                py: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.1) !important',
                  borderColor: '#1b5e20 !important',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon sx={{ fontSize: { xs: 14, md: 16 } }} />}
              sx={{
                backgroundColor: '#2e7d32 !important',
                color: '#ffffff !important',
                borderRadius: '14px !important',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                px: { xs: 1.5, md: 2 },
                py: 0.5,
                '&:hover': {
                  backgroundColor: '#1b5e20 !important',
                },
              }}
            >
              {id ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate(-1)}
          sx={{
            color: '#2e7d32 !important',
            borderColor: '#2e7d32 !important',
            borderRadius: '14px !important',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            px: { xs: 1.5, md: 2 },
            py: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.1) !important',
              borderColor: '#1b5e20 !important',
            },
          }}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default NewStudent;