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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import { SharesContext } from '../../context/share/ShareContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Share = () => {
  const {
    studentsWithShares,
    loading,
    error,
    fetchStudentsWithShares,
    createMassShare,
    updateStudentStatus,
  } = useContext(SharesContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [openMassShareDialog, setOpenMassShareDialog] = useState(false);
  const [massShareData, setMassShareData] = useState({
    quotaName: '',
    amount: '',
    dueDate: '',
    year: new Date().getFullYear(),
  });
  const [studentStatuses, setStudentStatuses] = useState({});
  const navigate = useNavigate();

  const students = [
    ...new Map(
      studentsWithShares.map((item) => [
        item.student_id,
        {
          id: item.student_id,
          name: item.name,
          lastName: item.lastName,
          dni: item.dni || 'N/A',
          student_status: item.student_status || 'Activo',
        },
      ])
    ).values(),
  ].sort((a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`));

  useEffect(() => {
    const initialStatuses = {};
    students.forEach((student) => {
      initialStatuses[student.id] = student.student_status === 'Activo';
    });
    setStudentStatuses(initialStatuses);
  }, [studentsWithShares]);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.lastName} ${student.dni}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchStudentsWithShares();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleViewShares = (studentId) => navigate(`/shares/student/${studentId}`);

  const handleOpenMassShareDialog = () => setOpenMassShareDialog(true);
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
    const { quotaName, amount, dueDate, year } = massShareData;
    if (!quotaName || !amount || !dueDate) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    try {
      await createMassShare({ quotaName, amount: parseFloat(amount), dueDate, year });
      toast.success('Cuota masiva creada exitosamente');
      handleCloseMassShareDialog();
    } catch (err) {
      toast.error('Error al crear la cuota masiva');
      console.error(err);
    }
  };

  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    const isActive = !studentStatuses[studentId];
    setStudentStatuses((prev) => ({ ...prev, [studentId]: isActive }));
    const newStatus = isActive ? 'Activo' : 'Inactivo';
    try {
      await updateStudentStatus(studentId, newStatus);
      toast.success(`Estado del alumno actualizado a ${newStatus}`);
      fetchStudentsWithShares();
    } catch (err) {
      setStudentStatuses((prev) => ({ ...prev, [studentId]: !isActive }));
      toast.error('Error al actualizar el estado del alumno');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          sx={{ flex: 1, minWidth: '250px' }}
          label="Buscar por nombre, apellido o DNI"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpenMassShareDialog}>
          Crear Cuota Masiva
        </Button>
      </Box>

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
                      checked={studentStatuses[student.id] || false}
                      onChange={() => handleToggleStudentStatus(student.id, student.student_status)}
                      color="success"
                    />
                    {studentStatuses[student.id] ? 'Activo' : 'Inactivo'}
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

      <Dialog open={openMassShareDialog} onClose={handleCloseMassShareDialog}>
        <DialogTitle>Crear Cuota Masiva</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select
              name="year"
              value={massShareData.year}
              onChange={handleMassShareInputChange}
              label="Año"
            >
              {[2025, 2024, 2023].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
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

export default Share;
