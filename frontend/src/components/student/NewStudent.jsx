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
        padding: { xs: '20px', md: '40px' },
        mt: 8,
        backgroundColor: '#E6F9EC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          padding: 4,
          borderRadius: '12px',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 30, color: '#00335c', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#00335c' }}>
            {id ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Apellido"
            name="lastname"
            value={student.lastname}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="Nombre"
            name="name"
            value={student.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="DNI"
            name="dni"
            value={student.dni}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/students')}
              sx={{
                color: '#00335c',
                borderColor: '#00335c',
                '&:hover': {
                  backgroundColor: 'rgba(142, 234, 177, 0.1)',
                  borderColor: '#8eeab1',
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
                backgroundColor: '#8eeab1',
                color: '#00335c',
                '&:hover': {
                  backgroundColor: '#007e32',
                },
              }}
            >
              {id ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Botón volver afuera */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default NewStudent;
