// src/components/teacher/Teacher.jsx
import React, { useContext, useState, useEffect } from 'react';
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
} from '@mui/material';
import { TeacherContext } from '../../context/teacher/TeacherContext';
import { toast } from 'react-toastify';
import Navigato from '../navbar/Navigato';

// Componente para gestionar profesores
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

  // Abrir diálogo de creación
  const handleOpenCreateDialog = () => {
    setNewTeacherData({ name: '', lastName: '', email: '', phone: '' });
    setOpenCreateDialog(true);
  };

  // Cerrar diálogo de creación
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Guardar nuevo profesor
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

  // Abrir diálogo de edición
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

  // Cerrar diálogo de edición
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingTeacher(null);
    setEditData({ name: '', lastName: '', email: '', phone: '' });
  };

  // Guardar cambios de edición
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

  // Abrir diálogo de eliminación
  const handleOpenDeleteDialog = (teacherId) => {
    setTeacherToDelete(teacherId);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTeacherToDelete(null);
  };

  // Confirmar eliminación
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
    <Box sx={{ padding: '20px' }}>
      <Navigato />
      <Typography variant="h4" gutterBottom>
        Gestión de Profesores
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
          Crear Nuevo Profesor
        </Button>
        <Button variant="outlined" onClick={onBack} sx={{ ml: 2 }}>
          Volver
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
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
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'error' }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  No hay profesores registrados
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.lastName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone || '-'}</TableCell>
                  <TableCell>{new Date(teacher.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEditTeacher(teacher)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(teacher.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de creación */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Crear Nuevo Profesor</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={newTeacherData.name}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={newTeacherData.lastName}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={newTeacherData.email}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={newTeacherData.phone}
            onChange={(e) => setNewTeacherData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveNewTeacher} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Profesor</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="name"
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Apellido"
            name="lastName"
            value={editData.lastName}
            onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este profesor? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teacher;