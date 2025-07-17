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
import CancelIcon from '@mui/icons-material/Cancel'; // Importado para el botón Cancelar
import { calculateDueDate } from '../../utils/dateUtils';

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
        paymentdate_actual: editData.paymentdate_actual || '',
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
      
      const { amount } = getShareStatusAndAmount(share, today);

      const updatedData = {
        student_id: parseInt(studentId),
        date: share.date,
        amount: amount,
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
      className="student-shares-container"
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
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#00335c',
            textShadow: '2px 2px 6px rgba(56, 249, 215, 0.15)',
            letterSpacing: '0.08rem',
          }}
        >
          Cuotas de {student?.name} {student?.lastName}
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
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            flexGrow: 1,
            width: '100%',
            minWidth: '260px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
            p: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Año</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Año"
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            >
              {[2023, 2024, 2025, 2026, 2027].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenCreateDialog}
            sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' }, flex: 1 }}
          >
            Crear Nueva Cuota
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' }, px: { xs: 3, md: 5 }, py: { xs: 1.5, md: 2 }, minWidth: { xs: '180px', md: '220px' }, color: '#00335c', borderColor: '#00335c', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' } }}
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
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopLeftRadius: '16px', textAlign: 'center' }}>Cuota</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Monto</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Fecha de Pago</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Método de Pago</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Estado</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentShares.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  Sin Cuota
                </TableCell>
              </TableRow>
            ) : (
              studentShares.map((share) => (
                <TableRow
                  key={share.share_id}
                  sx={{
                    background: studentShares.indexOf(share) % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{share.quota_name || '-'}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>${(Number(share.amount) || 0).toFixed(2)}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{share.paymentdate_actual || '-'}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{share.paymentmethod || '-'}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{share.state}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => handleEditShare(share)}
                      sx={{ mr: 1, borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                    >
                      ✎
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(share.share_id)}
                      sx={{ mr: 1, borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                    >
                      ✗
                    </Button>
                    {share.state !== 'Pagado' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOpenPayDialog(share.share_id)}
                        sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0 }}
                      >
                        ✔
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          Crear Nueva Cuota
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            label="Nombre de la Cuota"
            name="quotaName"
            value={newShareData.quotaName}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, quotaName: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
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
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
          />
          <TextField
            label="Fecha de Inicio"
            name="date"
            type="date"
            value={newShareData.date}
            onChange={(e) => setNewShareData((prev) => ({ ...prev, date: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}>
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
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNewShare}
            variant="contained"
            sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          Editar Cuota
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            label="Nombre de la Cuota"
            name="quotaName"
            value={editData.quotaName}
            onChange={(e) => setEditData((prev) => ({ ...prev, quotaName: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
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
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
          />
          <TextField
            label="Fecha de Pago"
            name="paymentdate_actual"
            type="date"
            value={editData.paymentdate_actual}
            onChange={(e) => setEditData((prev) => ({ ...prev, paymentdate_actual: e.target.value }))}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}>
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
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography sx={{ color: '#00335c', textAlign: 'center' }}>¿Estás seguro de que quieres eliminar esta cuota? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{ backgroundColor: '#d32f2f', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#b71c1c' }, fontWeight: 700 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPayDialog}
        onClose={handleClosePayDialog}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}
      >
        <DialogTitle
          sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}
        >
          Marcar como Pagado
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <FormControl fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}>
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
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleClosePayDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmPay}
            variant="contained"
            sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Cargando datos...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default StudentShares;