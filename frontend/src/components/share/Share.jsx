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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
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
}
// Función para formatear fecha a YYYY-MM-DD (elimina hora y zona)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0]; // Toma solo la parte YYYY-MM-DD
};

const Share = () => {
  const { studentsWithShares, loading, error, fetchStudentsWithShares, createMassShare, updateStudentStatus } = useContext(SharesContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMassShareDialog, setOpenMassShareDialog] = useState(false);
  const [massShareData, setMassShareData] = useState({
    quotaName: '',
    amount: '',
    dueDate: '', // Cambiamos paymentDate por dueDate
    year: new Date().getFullYear(),
  });
  const [studentStatuses, setStudentStatuses] = useState({}); // Estado local para el Switch
  const navigate = useNavigate();

  // Obtener lista de alumnos únicos y ordenarlos alfabéticamente
  const students = [
    ...new Map(
      studentsWithShares.map((item) => [
        item.student_id,
        {
          id: item.student_id,
          name: item.name,
          lastName: item.lastName,
          dni: item.dni || 'N/A',
          student_status: item.student_status || 'Activo'
        },
      ])
    ).values(),
  ].sort((a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`));

  // Sincronizar estados locales al cargar datos
  useEffect(() => {
    const initialStatuses = {};
    students.forEach(student => {
      initialStatuses[student.id] = student.student_status === 'Activo';
    });
    setStudentStatuses(initialStatuses);
  }, [studentsWithShares]);

  // Filtrar alumnos según la búsqueda
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.lastName} ${student.dni}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Cargar todos los estudiantes al montar el componente
  useEffect(() => {
    fetchStudentsWithShares().then(() => {
      console.log('Datos iniciales de studentsWithShares:', studentsWithShares); // Depuración
    });
  }, []);

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Manejar la redirección al hacer clic en "Ver Cuotas"
  const handleViewShares = (studentId) => {
    navigate(`/shares/student/${studentId}`);
  };

  // Manejar el pop-up de cuota masiva
  const handleOpenMassShareDialog = () => {
    setOpenMassShareDialog(true);
  };

  const handleCloseMassShareDialog = () => {
    setOpenMassShareDialog(false);
    setMassShareData({
      quotaName: '',
      amount: '',
      dueDate: '',
      year: new Date().getFullYear(),
    });
  };

  const handleMassShareInputChange = (e) => {
    const { name, value } = e.target;
    setMassShareData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMassShareSubmit = async (e) => {
    e.preventDefault();
    if (!massShareData.quotaName || !massShareData.amount || !massShareData.dueDate) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    try {
      await createMassShare({
        quotaName: massShareData.quotaName,
        amount: parseFloat(massShareData.amount),
        dueDate: massShareData.dueDate,
        year: massShareData.year,
      });
      toast.success('Cuota masiva creada exitosamente');
      handleCloseMassShareDialog();
    } catch (err) {
      toast.error('Error al crear la cuota masiva');
      console.error(err);
    }
  };

  // Manejar el cambio de estado del alumno
  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    const isActive = !studentStatuses[studentId]; // Toggle local state
    setStudentStatuses((prev) => ({ ...prev, [studentId]: isActive }));
    const newStatus = isActive ? 'Activo' : 'Inactivo';
    try {
      await updateStudentStatus(studentId, newStatus);
      toast.success(`Estado del alumno actualizado a ${newStatus}`);
      fetchStudentsWithShares(); // Refrescar la lista de alumnos
    } catch (err) {
      // Revertir el estado local si falla
      setStudentStatuses((prev) => ({ ...prev, [studentId]: !isActive }));
      toast.error('Error al actualizar el estado del alumno');
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          sx={{ width: '70%' }}
          label="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpenMassShareDialog}>
          Crear Cuota Masiva
        </Button>
      </Box>

      {/* Tabla de alumnos */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Estado del Alumno</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  No se encontraron alumnos
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.dni}</TableCell>
                  <TableCell>
                    <Switch
                      checked={studentStatuses[student.id] || false} // Estado local
                      onChange={() => handleToggleStudentStatus(student.id, student.student_status)}
                      color="success" // Verde para Activo
                      disabled={loading} // Deshabilitar mientras carga
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50', // Verde para el thumb cuando está checked
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#4caf50', // Verde para la pista cuando está checked
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#f44336', // Rojo para la pista cuando está unchecked
                        },
                      }}
                    />
                    {studentStatuses[student.id] ? 'Activo' : 'Inactivo'} {/* Estado basado en el Switch */}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewShares(student.id)}
                      disabled={loading}
                    >
                      Ver Cuotas
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
      <Box />


      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select
              name="year"
              value={massShareData.year}
              onChange={handleMassShareInputChange}
              label="Año"
            >
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Cuota"
            name="quotaName"
            value={massShareData.quotaName}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Ej: Cuota Masiva - Semestre 1 - 2025"
          />
          <TextField
            label="Monto"
            name="amount"
            type="number"
            value={massShareData.amount}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fecha de Vencimiento"
            name="dueDate"
            type="date"
            value={massShareData.dueDate}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMassShareDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleMassShareSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensajes de carga o error */}
      {
        loading && (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
            Cargando datos...
          </Typography>
        )
      }
      {
        error && (
          <Typography variant="body1" color="error" sx={{ textAlign: 'center', my: 2 }}>
            {error}
          </Typography>
        )
      }
    </Box >
  );
};

export default Share;