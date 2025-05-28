import { useEffect } from 'react';
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
} from '@mui/material';
import { useMotions } from '../../context/motion/MotionContext';

const MotionList = () => {
  const { motions, loading, error, fetchMotions } = useMotions();

  useEffect(() => {
    fetchMotions(); // Fetch all motions (incomes and expenses)
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
      </Typography>

      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {motions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay movimientos registrados
                </TableCell>
              </TableRow>
            ) : (
              motions.map((motion) => (
                <TableRow key={motion.id}>
                  <TableCell>{motion.concept}</TableCell>
                  <TableCell>${parseFloat(motion.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(motion.date).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>{motion.paymentMethod || 'N/A'}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        motion.incomeType === 'ingreso' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {motion.incomeType === 'ingreso' ? 'Ingreso' : 'Egreso'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MotionList;