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
import { calculateDueDate } from '../../utils/dateUtils';

// Función para determinar el estado y recargos basada en la fecha de vencimiento
const getShareStatusAndAmount = (share, today) => {
  if (!share.date) return { state: 'Sin Cuota', amount: 0 };
  const dueDate = new Date(calculateDueDate(share.date));
  const originalAmount = Number(share.amount) || 0;
  if (share.state === 'Pagado') {
    return { state: 'Pagado', amount: originalAmount };
  }
  const shareYear = dueDate.getFullYear();
  const shareMonth = dueDate.getMonth();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  if (shareYear > todayYear || (shareYear === todayYear && shareMonth > todayMonth)) {
    return { state: 'Pendiente', amount: originalAmount };
  }
  if (today < dueDate) {
    return { state: 'Pendiente', amount: originalAmount };
  } else if (today >= dueDate && today.getDate() <= 20) {
    const surcharge = originalAmount * 0.20;
    return { state: 'Vencido', amount: originalAmount + surcharge };
  } else {
    const surcharge = originalAmount * 0.30;
    return { state: 'Vencido', amount: originalAmount + surcharge };
  }
};

const StudentShares = ({ studentId, onBack }) => {
  const { studentsWithShares, loading, error, createShare, updateShare, deleteShare, fetchSharesByStudent } = useContext(SharesContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [newShareData, setNewShareData] = useState({
    quotaName: '',
    amount: '',
    date: '',
    state: 'Pendiente',
    paymentmethod: '',
    year: new Date().getFullYear(),
  });
  const [editingShare, setEditingShare] = useState(null);
  const [shareToDelete, setShareToDelete] = useState(null);
  const [payShareId, setPayShareId] = useState(null);
  const [payMethod, setPayMethod] = useState('Efectivo');
  const [editData, setEditData] = useState({
    quotaName: '',
    amount: '',
    date: '',
    paymentmethod: 'Efectivo',
    year: new Date().getFullYear(),
    paymentdate_actual: '',
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (studentId) {
      fetchSharesByStudent(studentId);
    }
  }, [studentId, fetchSharesByStudent]);

  const today = new Date();
  const studentShares = studentsWithShares
    .filter((share) => share.student_id === parseInt(studentId))
    .filter((share) => share.date && share.amount && share.quota_name)
    .map((share) => {
      const dueDate = new Date(calculateDueDate(share.date));
      const { state, amount } = getShareStatusAndAmount(share, today);
      return { ...share, state, amount: Number(amount) || 0, year: dueDate.getFullYear() };
    })
    .filter((share) => share.year === selectedYear)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const student = studentsWithShares.find((share) => share.student_id === parseInt(studentId)) || studentsWithShares[0];

  const handleOpenCreateDialog = () => {
    setNewShareData({
      quotaName: '',
      amount: '',
      date: '',
      state: 'Pendiente',
      paymentmethod: '',
      year: new Date().getFullYear(),
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const handleSaveNewShare = async (e) => {
    e.preventDefault();
    if (!newShareData.quotaName.trim() || !newShareData.amount || !newShareData.date) {
      toast.error('Por favor, completa el nombre de la cuota, el monto y la fecha');
      return;
    }
    const amountValue = parseFloat(newShareData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }
    try {
      const dueDate = calculateDueDate(newShareData.date);
      const shareData = {
        student_id: parseInt(studentId),
        date: newShareData.date,
        amount: amountValue,
        state: 'Pendiente',
        paymentdate: '',
        quotaName: newShareData.quotaName.trim(),
        paymentmethod: '',
      };

      await createShare(shareData);
      toast.success('Cuota registrada exitosamente');
      await fetchSharesByStudent(studentId);
      handleCloseCreateDialog();
    } catch (err) {
      toast.error(`Error al crear la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
      console.error(err);
    }
  };

  const handleEditShare = (share) => {
    setEditingShare(share.share_id);
    setEditData({
      quotaName: share.quota_name || '',
      amount: (Number(share.amount) || 0).toString(),
      date: share.date || '',
      paymentmethod: share.paymentmethod,
      year: new Date(calculateDueDate(share.date)).getFullYear(),
      paymentdate_actual: share.paymentdate_actual || '',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingShare(null);
    setEditData({ quotaName: '', amount: '', date: '', paymentmethod: 'Efectivo', year: new Date().getFullYear() });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editData.quotaName.trim() || !editData.amount || !editData.date) {
      toast.error('Por favor, completa el nombre de la cuota, el monto y la fecha');
      return;
    }
    const amountValue = parseFloat(editData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }
    try {
      const share = studentsWithShares.find((s) => s.share_id === editingShare);
      const updatedData = {
                student_id: parseInt(studentId),
                date: editData.date,
                amount: amountValue,
                state: share.state,
                quotaName: editData.quotaName.trim(),
                paymentmethod: editData.paymentmethod || 'Efectivo',
                paymentdate_actual: editData.paymentdate_actual || '', // <- Esto es clave
              };


      await updateShare(editingShare, updatedData);
      toast.success('Cuota actualizada exitosamente');
      await fetchSharesByStudent(studentId);
      handleCloseEditDialog();
    } catch (err) {
      toast.error(`Error al actualizar la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
      console.error(err);
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
      console.error(err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleOpenPayDialog = (shareId) => {
    setPayShareId(shareId);
    setOpenPayDialog(true);
  };

  const handleClosePayDialog = () => {
    setOpenPayDialog(false);
    setPayShareId(null);
    setPayMethod('Efectivo');
  };

  const handleConfirmPay = async () => {
  if (!payShareId) return;
  try {
    const share = studentsWithShares.find((s) => s.share_id === payShareId);
    const dueDate = calculateDueDate(share.date);
    
    const { amount } = getShareStatusAndAmount(share, today); // 👈 monto con recargo si corresponde

    const updatedData = {
      student_id: parseInt(studentId),
      date: share.date,
      amount: amount, // 👈 monto final con posible recargo
      state: 'Pagado',
      paymentdate: dueDate,
      quotaName: share.quota_name,
      paymentmethod: payMethod,
      paymentdate_actual: new Date().toISOString().split('T')[0],
    };

    await updateShare(payShareId, updatedData);
    toast.success('Cuota marcada como pagada');
    await fetchSharesByStudent(studentId);
    handleClosePayDialog();
  } catch (err) {
    toast.error(`Error al marcar como pagado: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    console.error(err);
  }
};


  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Cuotas de {student?.name} {student?.lastName}
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Año</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Año"
          >
            {[2023, 2024, 2025, 2026, 2027].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              <TableCell>Fecha de Pago</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentShares.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  Sin Cuota
                </TableCell>
              </TableRow>
            ) : (
              studentShares.map((share) => (
                <TableRow key={share.share_id}>
                  <TableCell>{share.quota_name || '-'}</TableCell>
                  <TableCell>${(Number(share.amount) || 0).toFixed(2)}</TableCell>
                  <TableCell>{share.paymentdate_actual || '-'}</TableCell>
                  <TableCell>{share.paymentmethod || '-'}</TableCell>
                  <TableCell>{share.state}</TableCell>
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
                      sx={{ mr: 1 }}
                    >
                      Eliminar
                    </Button>
                    {share.state !== 'Pagado' && (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleOpenPayDialog(share.share_id)}
                      >
                        Pagado
                      </Button>
                    )}
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
            label="Nombre de la Cuota"
            name="quotaName"
            value={newShareData.quotaName}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, quotaName: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
            placeholder="Ej: Cuota Escuela 2025"
          />
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
            label="Fecha de Inicio"
            name="date"
            type="date"
            value={newShareData.date}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, date: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select
              name="year"
              value={newShareData.year}
              onChange={(e) => setNewShareData((prev) => ({ ...prev, year: e.target.value }))}
              label="Año"
            >
              {[2023, 2024, 2025, 2026, 2027].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
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
      {/* Diálogo de edición */}
<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
  <DialogTitle>Editar Cuota</DialogTitle>
  <DialogContent>
    <TextField
      label="Nombre de la Cuota"
      name="quotaName"
      value={editData.quotaName}
      onChange={(e) => setEditData((prev) => ({ ...prev, quotaName: e.target.value }))}
      fullWidth
      sx={{ mb: 2 }}
      required
      placeholder="Ej: Cuota Escuela 2025"
    />
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
      label="Fecha de Pago"
      name="paymentdate_actual"
      type="date"
      value={editData.paymentdate_actual}
      onChange={(e) => setEditData((prev) => ({ ...prev, paymentdate_actual: e.target.value }))}
      fullWidth
      sx={{ mb: 2 }}
      required
      InputLabelProps={{ shrink: true }}
    />
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Método de Pago</InputLabel>
      <Select
        name="paymentmethod"
        value={editData.paymentmethod}
        onChange={(e) => setEditData((prev) => ({ ...prev, paymentmethod: e.target.value }))}
        label="Método de Pago"
        required
      >
        <MenuItem value="Efectivo">Efectivo</MenuItem>
        <MenuItem value="Tarjeta">Tarjeta</MenuItem>
        <MenuItem value="Transferencia">Transferencia</MenuItem>
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

      {/* Diálogo de pago */}
      <Dialog open={openPayDialog} onClose={handleClosePayDialog}>
        <DialogTitle>Marcar como Pagado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Método de Pago</InputLabel>
            <Select
              name="paymentmethod"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              label="Método de Pago"
              required
            >
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Tarjeta">Tarjeta</MenuItem>
              <MenuItem value="Transferencia">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePayDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmPay} color="primary">
            Confirmar
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