// src/components/share/StudentShares.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SharesContext } from '../../context/share/ShareContext';
import { toast } from 'react-toastify';
import Navbar from '../navbar/Navbar';

// Función para formatear fecha a YYYY-MM-DD (elimina hora y zona)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0]; // Toma solo la parte YYYY-MM-DD
};

// Función para parsear fecha de YYYY-MM-DD a DD-MM-YYYY (para mostrar)
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const StudentShares = ({ studentId, onBack }) => {
  const { studentsWithShares, loading, error, createShare, updateShare, deleteShare, fetchSharesByStudent } = useContext(SharesContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newShareData, setNewShareData] = useState({
    amount: '',
    dueDate: '',
    paymentDate: '',
    state: 'Pendiente',
  });
  const [editingShare, setEditingShare] = useState(null);
  const [shareToDelete, setShareToDelete] = useState(null);
  const [editData, setEditData] = useState({
    amount: '',
    dueDate: '',
    paymentDate: '',
    state: 'Pendiente',
  });

  useEffect(() => {
    if (studentId) {
      fetchSharesByStudent(studentId).then(() => {
        console.log('Datos iniciales de studentsWithShares:', studentsWithShares); // Depuración
      });
    }
  }, [studentId, fetchSharesByStudent]);

  const studentShares = studentsWithShares
    .filter((share) => share.student_id === parseInt(studentId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const student = studentsWithShares.find((share) => share.student_id === parseInt(studentId)) || studentsWithShares[0];

  const handleOpenCreateDialog = () => {
    setNewShareData({
      amount: '',
      dueDate: '',
      paymentDate: '',
      state: 'Pendiente',
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleSaveNewShare = async (e) => {
    e.preventDefault();
    if (!newShareData.amount || !newShareData.dueDate || !newShareData.state) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    if (isNaN(parseFloat(newShareData.amount)) || parseFloat(newShareData.amount) <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }

    try {
      const shareData = {
        student_id: parseInt(studentId),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        amount: parseFloat(newShareData.amount),
        state: newShareData.state,
        paymentdate: newShareData.dueDate, // Ya en YYYY-MM-DD desde el input
        paymentdate_actual: newShareData.paymentDate || null, // Ya en YYYY-MM-DD desde el input
      };

      await createShare(shareData);
      toast.success('Cuota registrada exitosamente');
      await fetchSharesByStudent(studentId);
      handleCloseCreateDialog();
    } catch (err) {
      toast.error(`Error al crear la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  const handleEditShare = (share) => {
    setEditingShare(share.share_id);
    setEditData({
      amount: share.amount.toString(),
      dueDate: share.paymentdate ? formatDateForInput(share.paymentdate) : '',
      paymentDate: share.paymentdate_actual ? formatDateForInput(share.paymentdate_actual) : '',
      state: share.state || 'Pendiente',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingShare(null);
    setEditData({ amount: '', dueDate: '', paymentDate: '', state: 'Pendiente' });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editData.amount || !editData.state) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }
    if (isNaN(parseFloat(editData.amount)) || parseFloat(editData.amount) <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }

    try {
      const originalShare = studentsWithShares.find((s) => s.share_id === editingShare);
      const updatedData = {
        student_id: parseInt(studentId),
        date: originalShare.date.split('T')[0], // Mantener el date original en YYYY-MM-DD
        amount: parseFloat(editData.amount),
        state: editData.state,
        paymentdate: originalShare.paymentdate ? formatDateForInput(originalShare.paymentdate) : null, // Corregir formato
        paymentdate_actual: editData.paymentDate || null, // Ya en YYYY-MM-DD desde el input
      };

      await updateShare(editingShare, updatedData);
      toast.success('Cuota actualizada exitosamente');
      await fetchSharesByStudent(studentId);
      handleCloseEditDialog();
    } catch (err) {
      toast.error(`Error al actualizar la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  const handleOpenDeleteDialog = (shareId) => {
    setShareToDelete(shareId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setShareToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteShare(shareToDelete);
      toast.success('Cuota eliminada exitosamente');
      await fetchSharesByStudent(studentId);
    } catch (err) {
      toast.error(`Error al eliminar la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleMarkAsPaid = async (shareId) => {
    try {
      const share = studentsWithShares.find((s) => s.share_id === shareId);
      const updatedData = {
        student_id: parseInt(studentId),
        date: share.date ? formatDateForInput(share.date) : new Date().toISOString().split('T')[0], // Asegurar YYYY-MM-DD
        amount: share.amount,
        state: 'Pagado',
        paymentdate: share.paymentdate ? formatDateForInput(share.paymentdate) : null, // Corregir formato
        paymentdate_actual: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };
      console.log('Datos enviados a update:', updatedData); // Depuración adicional
      await updateShare(shareId, updatedData);
      toast.success('Cuota marcada como pagada');
      await fetchSharesByStudent(studentId);
    } catch (err) {
      toast.error(`Error al marcar como pagado: ${err.response?.data?.error || err.message || 'Desconocido'}`);
      console.error('Error detallado:', err); // Depuración adicional
    }
  };

  return (
    <Box sx={{ }}>
      
      <Typography variant="h4" gutterBottom>
        Cuotas de {student?.name} {student?.lastName}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
          Crear Nueva Cuota
        </Button>
        <Button variant="outlined" onClick={onBack} sx={{ ml: 2 }}>
          Volver
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cuota</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Fecha de Vencimiento</TableCell>
              <TableCell>Fecha de Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentShares.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  No hay cuotas registradas para este alumno
                </TableCell>
              </TableRow>
            ) : (
              studentShares.map((share) => (
                <TableRow key={share.share_id}>
                  <TableCell>{share.date ? share.date.slice(0, 7) : '-'}</TableCell>
                  <TableCell>${share.amount || 0}</TableCell>
                  <TableCell>{share.paymentdate ? formatDateForDisplay(formatDateForInput(share.paymentdate)) : '-'}</TableCell>
                  <TableCell>{share.paymentdate_actual ? formatDateForDisplay(formatDateForInput(share.paymentdate_actual)) : '-'}</TableCell>
                  <TableCell>{share.state || 'Pendiente'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEditShare(share)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(share.share_id)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleMarkAsPaid(share.share_id)}
                      sx={{ ml: 1 }}
                    >
                      Pagado
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
        <DialogTitle>Crear Nueva Cuota</DialogTitle>
        <DialogContent>
          <TextField
            label="Monto"
            name="amount"
            type="number"
            value={newShareData.amount}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, amount: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Fecha de Vencimiento"
            name="dueDate"
            type="date"
            value={newShareData.dueDate}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, dueDate: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Fecha de Pago"
            name="paymentDate"
            type="date"
            value={newShareData.paymentDate}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, paymentDate: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              name="state"
              value={newShareData.state}
              onChange={(e) => setNewShareData((prev) => ({ ...prev, state: e.target.value }))}
              label="Estado"
              required
            >
              <MenuItem value="Pagado">Pagado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Vencido">Vencido</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveNewShare} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Cuota</DialogTitle>
        <DialogContent>
          <TextField
            label="Monto"
            name="amount"
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData((prev) => ({ ...prev, amount: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Fecha de Vencimiento"
            name="dueDate"
            type="date"
            value={editData.dueDate} // Ya en YYYY-MM-DD
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            required
          />
          <TextField
            label="Fecha de Pago"
            name="paymentDate"
            type="date"
            value={editData.paymentDate} // Ya en YYYY-MM-DD
            onChange={(e) => setEditData((prev) => ({ ...prev, paymentDate: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              name="state"
              value={editData.state}
              onChange={(e) => setEditData((prev) => ({ ...prev, state: e.target.value }))}
              label="Estado"
              required
            >
              <MenuItem value="Pagado">Pagado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Vencido">Vencido</MenuItem>
            </Select>
          </FormControl>
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
          <Typography>¿Estás seguro de que quieres eliminar esta cuota? Esta acción no se puede deshacer.</Typography>
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

      {loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
          Cargando datos...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', my: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default StudentShares;