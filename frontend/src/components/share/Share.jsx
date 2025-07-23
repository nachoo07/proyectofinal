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
} from '@mui/material';
import { SharesContext } from '../../context/share/ShareContext';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
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
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

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
      statusFilter === 'Todos' || status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
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
      className="main-container"
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
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            textAlign: 'center',
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
            flexDirection: 'row',
            gap: { xs: 1, md: 2 },
            flexGrow: 1,
            maxWidth: '900px',
            minWidth: '260px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(56, 249, 215, 0.08)',
            p: { xs: 1, md: 2 },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            label="Buscar por nombre, apellido o DNI"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          />
          <TextField
            select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{ native: true }}
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              minWidth: { xs: 100, md: 120 },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
              },
              '& .MuiInputLabel-root': { color: '#00335c' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Vencido">Vencido</option>
            <option value="Pagado">Pagado</option>
            <option value="Sin Cuota">Sin Cuotas</option>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexDirection: 'row', width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenMassShareDialog}
            sx={{
              borderRadius: '32px',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', md: '1.3rem' },
              px: { xs: 2, md: 5 },
              py: { xs: 1, md: 2 },
              minWidth: { xs: '140px', md: '220px' },
            }}
          >
            Crear Cuota Masiva
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '32px',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', md: '1.3rem' },
              px: { xs: 2, md: 5 },
              py: { xs: 1, md: 2 },
              minWidth: { xs: '140px', md: '220px' },
            }}
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
        <Table sx={{ minWidth: { xs: 320, md: 650 } }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}>
              <TableCell
                sx={{
                  color: '#00335c',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  borderTopLeftRadius: '16px',
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Nombre
              </TableCell>
              <TableCell
                sx={{
                  color: '#00335c',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Apellido
              </TableCell>
              <TableCell
                sx={{
                  color: '#00335c',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                DNI
              </TableCell>
              <TableCell
                sx={{
                  color: '#00335c',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Estado
              </TableCell>
              <TableCell
                sx={{
                  color: '#00335c',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '1.1rem' },
                  borderTopRightRadius: '16px',
                  textAlign: 'center',
                  p: { xs: 0.5, md: 2 },
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: 'center',
                    color: '#00335c',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1.1rem' },
                    p: { xs: 1.5, md: 4 },
                  }}
                >
                  No se encontraron alumnos
                </TableCell>
              </TableRow>
            ) : (
              currentStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  sx={{
                    background: index % 2 === 0 ? '#f8fafc' : '#e0f7fa',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#b2dfdb' },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#00335c',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {student.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#00335c',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {student.lastName}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#00335c',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {student.dni}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        getLatestShareStatus(student.id) === 'Pendiente'
                          ? '#ebeb34ff'
                          : getLatestShareStatus(student.id) === 'Vencido'
                          ? '#d32f2f'
                          : getLatestShareStatus(student.id) === 'Pagado'
                          ? '#388e3c'
                          
                          : '#1585fdff',
                      fontWeight: 700,
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    {getLatestShareStatus(student.id)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      p: { xs: 0.25, md: 2 },
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleViewShares(student.id)}
                      disabled={loading}
                      sx={{
                        borderRadius: '50%',
                        minWidth: { xs: 28, md: 40 },
                        height: { xs: 28, md: 40 },
                        p: 0,
                        fontSize: { xs: '0.7rem', md: '1rem' },
                      }}
                    >
                      $
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 0.5, md: 1 },
          mb: 0,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          size={window.innerWidth < 768 ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 2 }, minWidth: { xs: 32, md: 40 } }}
        >
          Anterior
        </Button>
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'contained' : 'outlined'}
              onClick={() => handlePageClick(pageNum)}
              size={window.innerWidth < 768 ? 'small' : 'medium'}
              sx={{
                fontSize: { xs: '0.75rem', md: '1rem' },
                minWidth: { xs: 32, md: 40 },
                px: { xs: 1, md: 2 },
              }}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          size={window.innerWidth < 768 ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 2 }, minWidth: { xs: 32, md: 40 } }}
        >
          Siguiente
        </Button>
      </Box>
      <Dialog
        open={openMassShareDialog}
        onClose={handleCloseMassShareDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#E6F9EC',
            m: { xs: 1, sm: 2 },
            maxWidth: { xs: '95vw', sm: '600px' },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #075324ff, #007e32)',
            color: '#00335c',
            fontWeight: 700,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            p: { xs: 1, md: 1.5 },
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Crear Cuota Masiva
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1.5, md: 2 }, pt: { xs: 1.5, md: 3 } }}>
          <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
            <InputLabel sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>Año</InputLabel>
            <Select
              name="year"
              value={massShareData.year}
              onChange={handleMassShareInputChange}
              label="Año"
              size={window.innerWidth < 768 ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#38f9d7' },
                  '&:hover fieldset': { borderColor: '#43e97b' },
                  '&.Mui-focused fieldset': { borderColor: '#43e97b' },
                },
                '& .MuiInputLabel-root': { color: '#00335c' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              }}
            >
              {[2023, 2024, 2025, 2026, 2027].map((year) => (
                <MenuItem key={year} value={year} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              },
              '& .MuiInputLabel-root': { color: '#00335c', fontSize: { xs: '0.8rem', md: '0.9rem' } },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
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
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              },
              '& .MuiInputLabel-root': { color: '#00335c', fontSize: { xs: '0.8rem', md: '0.9rem' } },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
            required
          />
          <TextField
            label="Fecha de Inicio"
            name="date"
            type="date"
            value={massShareData.date}
            onChange={handleMassShareInputChange}
            fullWidth
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#38f9d7' },
                '&:hover fieldset': { borderColor: '#43e97b' },
                '&.Mui-focused fieldset': { borderColor: '#43e97b' },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              },
              '& .MuiInputLabel-root': { color: '#00335c', fontSize: { xs: '0.8rem', md: '0.9rem' } },
              '& .MuiInputLabel-root.Mui-focused': { color: '#43e97b' },
            }}
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 1, md: 1.5 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Button
            onClick={handleCloseMassShareDialog}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              color: '#00335c',
              borderColor: '#00335c',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(142, 234, 177, 0.1)',
                borderColor: '#8eeab1',
              },
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.8rem', md: '0.9rem' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleMassShareSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#43e97b',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#38f9d7' },
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.8rem', md: '0.9rem' },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <Typography variant="h6" color="#00335c" sx={{ textAlign: 'center', mt: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
          Cargando datos...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', mt: 1, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Share;