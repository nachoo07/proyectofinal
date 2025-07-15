// src/components/student/NewStudent.jsx
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
        background: 'linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, md: 2, lg: 4 },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 700,
          width: '100%',
          borderRadius: '40px',
          background: 'rgba(255,255,255,0.7)',
          boxShadow: '0 12px 40px rgba(67, 233, 123, 0.18)',
          backdropFilter: 'blur(8px)',
          p: { xs: 2, md: 5 },
          mx: 'auto',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(67, 233, 123, 0.25)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
          <SchoolIcon sx={{ fontSize: 48, color: '#43e97b', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#00335c', letterSpacing: '0.07em' }}>
            {id ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <TextField
              label="Apellido"
              name="lastname"
              value={student.lastname}
              onChange={handleChange}
              required
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: 'rgba(232,245,233,0.7)',
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 8px rgba(67,233,123,0.08)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(67,233,123,0.15)' },
                },
                '& .MuiInputLabel-root': { color: '#43e97b', fontWeight: 700 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00335c' },
              }}
            />
            <TextField
              label="Nombre"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: 'rgba(232,245,233,0.7)',
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 8px rgba(67,233,123,0.08)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(67,233,123,0.15)' },
                },
                '& .MuiInputLabel-root': { color: '#43e97b', fontWeight: 700 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00335c' },
              }}
            />
            <TextField
              label="DNI"
              name="dni"
              value={student.dni}
              onChange={handleChange}
              required
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: 'rgba(232,245,233,0.7)',
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 8px rgba(67,233,123,0.08)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(67,233,123,0.15)' },
                },
                '& .MuiInputLabel-root': { color: '#43e97b', fontWeight: 700 },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00335c' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/students')}
              sx={{
                color: '#00335c',
                borderColor: '#43e97b',
                borderRadius: '32px',
                fontWeight: 800,
                fontSize: { xs: '1.2rem', md: '1.3rem' },
                px: { xs: 4, md: 6 },
                py: { xs: 2, md: 2.5 },
                minWidth: { xs: '150px', md: '200px' },
                boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(67, 233, 123, 0.12)',
                  borderColor: '#00335c',
                  boxShadow: '0 4px 16px rgba(67,233,123,0.18)',
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
                background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                color: '#00335c',
                borderRadius: '32px',
                fontWeight: 800,
                fontSize: { xs: '1.2rem', md: '1.3rem' },
                px: { xs: 4, md: 6 },
                py: { xs: 2, md: 2.5 },
                minWidth: { xs: '150px', md: '200px' },
                boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                  boxShadow: '0 4px 16px rgba(67,233,123,0.18)',
                },
              }}
            >
              {id ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: '32px',
            fontWeight: 800,
            fontSize: { xs: '1.2rem', md: '1.3rem' },
            px: { xs: 4, md: 6 },
            py: { xs: 2, md: 2.5 },
            minWidth: { xs: '150px', md: '200px' },
            boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
            transition: 'box-shadow 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(67, 233, 123, 0.12)',
              boxShadow: '0 4px 16px rgba(67,233,123,0.18)',
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
