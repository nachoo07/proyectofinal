import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { SharesContext } from '../../context/share/ShareContext';
import { toast } from 'react-toastify';
import { calculateDueDate } from '../../utils/dateUtils';

const Share = () => {
  const {
    studentsWithShares,
    loading,
    error,
    fetchStudentsWithShares,
    createMassShare,
  } = useContext(SharesContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [openMassShareDialog, setOpenMassShareDialog] = useState(false);
  const [massShareData, setMassShareData] = useState({
    quotaName: '',
    amount: '',
    date: '', // Nuevo campo para la fecha
    year: new Date().getFullYear(),
  });
  const [filters, setFilters] = useState({
    all: true, // Nuevo checkbox "Todos"
    pendiente: true,
    vencido: true,
    pagado: true,
    sinCuotas: true,
  });
  const navigate = useNavigate();

  // Obtener la última cuota de cada alumno
  const getLatestShareStatus = (studentId) => {
    const studentShares = studentsWithShares.filter((share) => share.student_id === studentId);
    if (studentShares.length === 0) return 'Sin Cuota';
    const latestShare = studentShares.reduce((latest, current) =>
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
    return latestShare.state || 'Sin Cuota';
  };

  const students = [
    ...new Map(
      studentsWithShares.map((item) => [
        item.student_id,
        {
          id: item.student_id,
          name: item.name,
          lastName: item.lastName,
          dni: item.dni || 'N/A',
        },
      ])
    ).values(),
  ].sort((a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`));

  const filteredStudents = students.filter((student) => {
    const status = getLatestShareStatus(student.id);
    const matchesSearch = `${student.name} ${student.lastName} ${student.dni}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      (filters.all || filters.pendiente && status === 'Pendiente') ||
      (filters.all || filters.vencido && status === 'Vencido') ||
      (filters.all || filters.pagado && status === 'Pagado') ||
      (filters.all || filters.sinCuotas && status === 'Sin Cuota');
    return matchesSearch && matchesFilter;
  });

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
      date: '',
      year: new Date().getFullYear(),
    });
  };

  const handleMassShareInputChange = (e) => {
    const { name, value } = e.target;
    setMassShareData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMassShareSubmit = async (e) => {
    e.preventDefault();
    const { quotaName, amount, date, year } = massShareData;
    if (!quotaName || !amount || !date || !year) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    try {
      const dueDate = calculateDueDate(date); // Calcular fecha de vencimiento desde la fecha ingresada
      const payload = { quotaName, amount: parseFloat(amount), date, dueDate, year };
      await createMassShare(payload);
      toast.success('Cuota masiva creada exitosamente');
      await fetchStudentsWithShares();
      handleCloseMassShareDialog();
    } catch (err) {
      toast.error('Error al crear la cuota masiva: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'all') {
      setFilters({
        all: checked,
        pendiente: checked,
        vencido: checked,
        pagado: checked,
        sinCuotas: checked,
      });
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: checked };
        newFilters.all = Object.values(newFilters).slice(1).every((value) => value); // Actualiza "all" si todos están checked
        return newFilters;
      });
    }
  };

  return (

    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Panel de Cuotas
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>

    <Box sx={{}}>
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
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={filters.all} onChange={handleFilterChange} name="all" />}
            label="Todos"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.pendiente} onChange={handleFilterChange} name="pendiente" />}
            label="Pendiente"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.vencido} onChange={handleFilterChange} name="vencido" />}
            label="Vencido"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.pagado} onChange={handleFilterChange} name="pagado" />}
            label="Pagado"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.sinCuotas} onChange={handleFilterChange} name="sinCuotas" />}
            label="Sin Cuotas"
          />
        </Box>
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
                  <TableCell>{getLatestShareStatus(student.id)}</TableCell>
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
              {[2023, 2024, 2025, 2026, 2027].map((year) => (
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
            required
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
            required
          />
          <TextField
            label="Fecha de Inicio"
            name="date"
            type="date"
            value={massShareData.date}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2 }}
            required
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