import { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMotions } from '../../context/motion/MotionContext';
import FiltersBar
 from './filtersBar';
const MotionList = ({ onEdit, onDelete }) => {
  const { motions, loading, error, fetchMotions, count, filters, 
    setFilters   } = useMotions();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMotions({ page: currentPage, pageSize });
      if (motions) {
        setTotalPages(Math.ceil(count / pageSize));
        setTotalItems(count);
      }
    };
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los movimientos: {error}
        </Alert>
      )}

      {!loading && !error && motions.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay movimientos registrados
        </Alert>
      )}

      {!loading && motions.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Método de Pago</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {motions.map((motion) => (
                  <TableRow
                    key={motion.id}
                    sx={{
                      '&:hover': {
                        backgroundColor:
                          motion.incomeType === 'ingreso'
                            ? 'rgba(25, 118, 210, 0.04)'
                            : 'rgba(211, 47, 47, 0.04)',
                      },
                    }}
                  >
                    <TableCell>{motion.concept}</TableCell>
                    <TableCell sx={{ fontWeight: '500' }}>
                      ${parseFloat(motion.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(motion.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {motion.paymentMethod === 'efectivo' ? (
                        <Box
                          component="span"
                          sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: '500',
                          }}
                        >
                          Efectivo
                        </Box>
                      ) : (
                        <Box
                          component="span"
                          sx={{
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: '500',
                          }}
                        >
                          Transferencia
                        </Box>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: motion.incomeType === 'ingreso' ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                      }}
                    >
                      {motion.incomeType === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(motion)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(motion.id)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalItems)} de {totalItems} movimientos
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Por página</InputLabel>
                <Select value={pageSize} label="Por página" onChange={handlePageSizeChange}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>

              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MotionList;
