import React, { useContext, useState } from 'react';
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
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { SharesContext } from '../../context/share/ShareContext';
import { toast } from 'react-toastify';

// Función para obtener los últimos tres meses
const getLastThreeMonths = () => {
  const today = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7)); // Formato YYYY-MM
  }
  return months;
};

const Share = () => {
  const { studentsWithShares, loading, error, createShare, updateShare, deleteShare, fetchStudentsWithShares } = useContext(SharesContext);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentdate: '',
    paymentmethod: '',
    state: 'Pagado',
  });
  const [editingShare, setEditingShare] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [shareToDelete, setShareToDelete] = useState(null);

  // Obtener lista de alumnos únicos
  const students = [
    ...new Map(
      studentsWithShares.map((item) => [
        item.student_id,
        { id: item.student_id, name: item.name, lastName: item.lastName },
      ])
    ).values(),
  ];

  // Filtrar alumnos según la búsqueda
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Filtrar cuotas de los últimos tres meses para el alumno seleccionado
  const lastThreeMonths = getLastThreeMonths();
  const filteredShares = studentsWithShares
    .filter(
      (share) =>
        share.student_id === selectedStudent &&
        share.date &&
        lastThreeMonths.includes(share.date.slice(0, 7))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Manejar la selección de un alumno
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    setSearchQuery('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // Iniciar edición de una cuota
  const handleEditShare = (share) => {
    setEditingShare(share.share_id);
    setPaymentData({
      amount: share.amount.toString(),
      paymentdate: share.paymentdate ? share.paymentdate.split('T')[0] : '',
      paymentmethod: share.paymentmethod || '',
      state: share.state || 'Pagado',
    });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingShare(null);
    setPaymentData({ amount: '', paymentdate: '', paymentmethod: '', state: 'Pagado' });
  };

  // Manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error('Por favor, selecciona un alumno');
      return;
    }
    if (!paymentData.amount || !paymentData.paymentdate || !paymentData.paymentmethod || !paymentData.state) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    if (isNaN(parseFloat(paymentData.amount)) || parseFloat(paymentData.amount) <= 0) {
      toast.error('El monto debe ser un número mayor a 0');
      return;
    }

    try {
      const shareData = {
        student_id: parseInt(selectedStudent),
        date: editingShare
          ? studentsWithShares.find((s) => s.share_id === editingShare)?.date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        amount: parseFloat(paymentData.amount),
        state: paymentData.state,
        paymentmethod: paymentData.paymentmethod,
        paymentdate: paymentData.paymentdate,
      };
      console.log('Datos enviados:', shareData);

      if (editingShare) {
        await updateShare(editingShare, shareData);
        toast.success('Cuota actualizada exitosamente');
        setEditingShare(null);
      } else {
        await createShare(shareData);
        toast.success('Pago registrado exitosamente');
      }

      setPaymentData({ amount: '', paymentdate: '', paymentmethod: '', state: 'Pagado' });
    } catch (err) {
      console.error('Error al procesar la cuota:', err.response?.data || err.message);
      toast.error(`Error al procesar la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    }
  };

  // Abrir diálogo de confirmación para eliminar
  const handleOpenDeleteDialog = (shareId) => {
    console.log('ID de cuota a eliminar:', shareId);
    setShareToDelete(shareId);
    setOpenDeleteDialog(true);
  };

  // Cerrar diálogo de confirmación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setShareToDelete(null);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      await fetchStudentsWithShares(); // Recargar datos para asegurar sincronización
      await deleteShare(shareToDelete);
      toast.success('Cuota eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar la cuota:', err.response?.data || err.message);
      toast.error(`Error al eliminar la cuota: ${err.response?.data?.error || err.message || 'Desconocido'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar Alumno (Nombre o Apellido)"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
        />
        {searchQuery && (
          <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
            <List>
              {filteredStudents.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No se encontraron alumnos" />
                </ListItem>
              ) : (
                filteredStudents.map((student) => (
                  <ListItem
                    key={student.id}
                    button={true}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <ListItemText primary={`${student.name} ${student.lastName}`} />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        )}
      </Box>

      {/* Mostrar nombre del alumno seleccionado */}
      {selectedStudent && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Alumno seleccionado:{' '}
          {students.find((s) => s.id === selectedStudent)?.name}{' '}
          {students.find((s) => s.id === selectedStudent)?.lastName}
        </Typography>
      )}

      {/* Tabla de cuotas */}
      {selectedStudent && (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mes</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha de Pago</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShares.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                      No hay cuotas para los últimos tres meses
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShares.map((share) => (
                    <TableRow key={share.share_id}>
                      <TableCell>{share.date.slice(0, 7)}</TableCell>
                      <TableCell>${share.amount}</TableCell>
                      <TableCell>{share.state}</TableCell>
                      <TableCell>{share.paymentdate || '-'}</TableCell>
                      <TableCell>{share.paymentmethod || '-'}</TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Formulario de pago o edición */}
          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px' }}>
            <Typography variant="h6" gutterBottom>
              {editingShare ? 'Editar Cuota' : 'Registrar Pago'}
            </Typography>
            <TextField
              label="Monto"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Fecha de Pago"
              name="paymentdate"
              type="date"
              value={paymentData.paymentdate}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                name="paymentmethod"
                value={paymentData.paymentmethod}
                onChange={handleInputChange}
                label="Método de Pago"
                required
              >
                <MenuItem value="Efectivo">Efectivo</MenuItem>
                <MenuItem value="Transferencia">Transferencia</MenuItem>
                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                name="state"
                value={paymentData.state}
                onChange={handleInputChange}
                label="Estado"
                required
              >
                <MenuItem value="Pagado">Pagado</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Vencido">Vencido</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                {editingShare ? 'Actualizar' : 'Registrar'}
              </Button>
              {editingShare && (
                <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Diálogo de confirmación para eliminar */}
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

      {/* Mensajes de carga o error */}
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

export default Share;