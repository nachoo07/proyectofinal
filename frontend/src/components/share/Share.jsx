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
import CancelIcon from '@mui/icons-material/Cancel'; // Importación añadida
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
    date: '',
    year: new Date().getFullYear(),
  });
  const [filters, setFilters] = useState({
    all: true,
    pendiente: true,
    vencido: true,
    pagado: true,
    sinCuotas: true,
  });
  const navigate = useNavigate();

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
      const dueDate = calculateDueDate(date);
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
        newFilters.all = Object.values(newFilters).slice(1).every((value) => value);
        return newFilters;
      });
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
      className="share-container"
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
          Panel de Cuotas
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
          <TextField
            label="Buscar por nombre, apellido o DNI"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flex: 2,
              minWidth: '250px',
              maxWidth: { xs: '100%', md: '350px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mx: { xs: 0, md: 2 }, flex: 3, justifyContent: { xs: 'flex-start', md: 'center' } }}>
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
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenMassShareDialog}
            sx={{ borderRadius: '32px', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' },   flex: 1 }}
          >
            Crear Cuota Masiva
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
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopLeftRadius: '16px', textAlign: 'center' }}>#</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Apellido</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>DNI</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'center' }}>Estado del Alumno</TableCell>
              <TableCell sx={{ color: '#00335c', fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, borderTopRightRadius: '16px', textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#00335c', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, py: 4 }}>
                  No se encontraron alumnos
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell sx={{ color: '#00335c', fontWeight: 600, textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.name}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.lastName}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{student.dni}</TableCell>
                  <TableCell sx={{ color: '#00335c', fontWeight: 500, textAlign: 'center' }}>{getLatestShareStatus(student.id)}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleViewShares(student.id)}
                      disabled={loading}
                      sx={{ borderRadius: '50%', minWidth: 40, height: 40, p: 0, fontWeight: 700 }}
                    >
                      💲
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openMassShareDialog} onClose={handleCloseMassShareDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', backgroundColor: '#E6F9EC' } }}>
        <DialogTitle sx={{ background: 'linear-gradient(90deg, #8eeab1, #007e32)', color: '#00335c', fontWeight: 700, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', p: 2 }}>
          Crear Cuota Masiva
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select
              name="year"
              value={massShareData.year}
              onChange={handleMassShareInputChange}
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
          <TextField
            label="Cuota"
            name="quotaName"
            value={massShareData.quotaName}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
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
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
          />
          <TextField
            label="Fecha de Inicio"
            name="date"
            type="date"
            value={massShareData.date}
            onChange={handleMassShareInputChange}
            fullWidth
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#38f9d7' }, '&:hover fieldset': { borderColor: '#43e97b' }, '&.Mui-focused fieldset': { borderColor: '#43e97b' } }, '& .MuiInputLabel-root': { color: '#00335c' }, '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' } }}
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleCloseMassShareDialog} variant="outlined" startIcon={<CancelIcon />} sx={{ color: '#00335c', borderColor: '#00335c', cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(142, 234, 177, 0.1)', borderColor: '#8eeab1' }, fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button onClick={handleMassShareSubmit} variant="contained" sx={{ backgroundColor: '#43e97b', color: '#ffffff', cursor: 'pointer', '&:hover': { backgroundColor: '#38f9d7' }, fontWeight: 700 }}>
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