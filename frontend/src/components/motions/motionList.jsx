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

const MotionList = ({ onEdit, onDelete }) => {
  const { motions, loading, error, fetchMotions, count } = useMotions();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    await fetchMotions({ page: currentPage, pageSize });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box className="motion-list-container" sx={{ maxWidth: 1200, mx: 'auto' }}>
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
          <TableContainer className="motion-list-table-container" component={Paper} sx={{ mb: 3, boxShadow: 3, overflow: 'auto', padding: 0 }}>
            <Table className="motion-list-table" sx={{ minWidth: { xs: 320, sm: 650 } }}>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>Monto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' }, display: { xs: 'none', md: 'table-cell' } }}>Método de Pago</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}>Acciones</TableCell>
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
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, wordBreak: 'break-word' }}>
                      {motion.concept}
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500', fontSize: { xs: '0.75rem', md: '1rem' } }}>
                      ${parseFloat(motion.amount).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', md: '1rem' }, display: { xs: 'none', sm: 'table-cell' } }}>
                      {new Date(motion.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {motion.paymentMethod === 'efectivo' ? (
                        <Box
                          component="span"
                          sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            px: { xs: 1, md: 1.5 },
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: '500',
                            fontSize: { xs: '0.7rem', md: '0.875rem' },
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
                            px: { xs: 1, md: 1.5 },
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: '500',
                            fontSize: { xs: '0.7rem', md: '0.875rem' },
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
                        fontSize: { xs: '0.7rem', md: '0.875rem' },
                      }}
                    >
                      {motion.incomeType === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </TableCell>
                    <TableCell>
                      <Box className="motion-list-actions" sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => onEdit(motion)}
                          title="Editar"
                          size={window.innerWidth < 600 ? 'small' : 'medium'}
                          sx={{ minWidth: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => onDelete(motion.id)}
                          title="Eliminar"
                          size={window.innerWidth < 600 ? 'small' : 'medium'}
                          sx={{ minWidth: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.8rem', md: '1rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
           
              
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems="center"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 100 } }}>
                <InputLabel>Por página</InputLabel>
                <Select value={pageSize} label="Por página" onChange={handlePageSizeChange}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>

              <Pagination
                count={Math.ceil(count / pageSize)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton={window.innerWidth >= 600}
                showLastButton={window.innerWidth >= 600}
                siblingCount={window.innerWidth >= 600 ? 1 : 0}
                boundaryCount={1}
                size={window.innerWidth < 600 ? 'small' : 'medium'}
              />
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MotionList;
