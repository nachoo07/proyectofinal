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
import SchoolIcon from '@mui/icons-material/School';

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
          lastname: studentToEdit.lastname,
          name: studentToEdit.name,
          dni: studentToEdit.dni,
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
      sx={{
        backgroundColor: '#e0f7f9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: '100%',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          p: { xs: 3, md: 5 },
          mx: 'auto',
          boxShadow: '0 8px 24px rgba(0, 128, 0, 0.1)',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0, 128, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
          <SchoolIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', letterSpacing: '0.05em' }}>
            {id ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <TextField
              label="Apellido"
              name="lastname"
              value={student.lastname}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e8f5e9' },
                },
                '& .MuiInputLabel-root': { color: '#2e7d32', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e8f5e9' },
                },
                '& .MuiInputLabel-root': { color: '#2e7d32', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e8f5e9' },
                },
                '& .MuiInputLabel-root': { color: '#2e7d32', fontWeight: 600 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1b5e20' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/students')}
              sx={{
                color: '#2e7d32',
                borderColor: '#2e7d32',
                borderRadius: '20px',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  borderColor: '#1b5e20',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: '#2e7d32',
                color: '#ffffff',
                borderRadius: '20px',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {id ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate(-1)}
          sx={{
            color: '#2e7d32',
            borderColor: '#2e7d32',
            borderRadius: '20px',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              borderColor: '#1b5e20',
            },
          }}
        >
          Volverrrrrrrr
        </Button>
      </Box>
    </Box>
  );
};

export default NewStudent;