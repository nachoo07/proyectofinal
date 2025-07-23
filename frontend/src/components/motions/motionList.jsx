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
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMotions } from '../../context/motion/MotionContext';

const MotionList = ({ onEdit, onDelete }) => {
  const { motions, loading, error, fetchMotions, count } = useMotions();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // fijo a 5, como en StudentTable

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    await fetchMotions({ page: currentPage, pageSize });
  };
  

  return (
    <Box
      sx={{
       
        minHeight: '100vh',
        p: { xs: 1, md: 2, lg: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        width: '100%',
      }}
      className="main-container"
    >
     

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, width: '100%' }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 1200 }}>
          Error al cargar los movimientos: {error}
        </Alert>
      )}

      {!loading && !error && motions.length === 0 && (
        <Alert severity="info" sx={{ mb: 3, width: '100%', maxWidth: 1200 }}>
          No hay movimientos registrados
        </Alert>
      )}

      {!loading && motions.length > 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mb: 4,
              borderRadius: '16px',
              boxShadow: '0 6px 24px rgba(67, 233, 123, 0.10)',
              overflow: 'auto',
              width: '100%',
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            <Table sx={{ minWidth: { xs: 320, md: 650 } }}>
              <TableHead>
                <TableRow
                  sx={{
                    background: 'rgba(32, 129, 38, 1) !important',
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#ffffffff',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '1.1rem' },
                      borderTopLeftRadius: '16px',
                      textAlign: 'center',
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    Descripción
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffffff',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '1.1rem' },
                      textAlign: 'center',
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    Monto
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffffff',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '1.1rem' },
                      textAlign: 'center',
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffffff',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '1.1rem' },
                      textAlign: 'center',
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    Método de Pago
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffffff',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '1.1rem' },
                      textAlign: 'center',
                      p: { xs: 0.5, md: 2 },
                    }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffffff',
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
                {motions.map((motion, index) => (
                  <TableRow
                    key={motion.id}
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
                        wordBreak: 'break-word',
                      }}
                    >
                      {motion.concept}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#00335c',
                        fontWeight: 700,
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', md: '1rem' },
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      ${parseFloat(motion.amount).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#00335c',
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', md: '1rem' },
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      {new Date(motion.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#00335c',
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', md: '1rem' },
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
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
                        textAlign: 'center',
                        fontSize: { xs: '0.7rem', md: '0.875rem' },
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      {motion.incomeType === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        p: { xs: 0.5, md: 2 },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(motion)}
                            size={window.innerWidth < 600 ? 'small' : 'medium'}
                            sx={{ minWidth: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            color="error"
                            onClick={() => onDelete(motion.id)}
                            size={window.innerWidth < 600 ? 'small' : 'medium'}
                            sx={{ minWidth: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 0.5, md: 1 },
              mb: 4,
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: 1200,
            }}
          >
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
          </Box>
        </>
      )}
    </Box>
  );
};

export default MotionList;
