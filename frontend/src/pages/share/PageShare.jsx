// src/pages/SharesPage.jsx
import React, { useContext } from 'react';
import { SharesContext } from '../../context/share/ShareContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';

const SharesPage = () => {
  const { studentsWithShares, loading, error, updateShare } = useContext(SharesContext);

  // Marcar una cuota como pagada
  const handleMarkAsPaid = async (shareId, studentId) => {
    try {
      const updatedData = {
        student_id: studentId,
        date: new Date().toISOString().split('T')[0], // Fecha actual
        amount: studentsWithShares.find((item) => item.share_id === shareId)?.amount || 0,
        state: 'Pagado',
        paymentmethod: 'Efectivo',
        paymentdate: new Date().toISOString().split('T')[0], // Fecha actual
      };
      await updateShare(shareId, updatedData);
      toast.success('Cuota marcada como pagada');
    } catch (err) {
      toast.error('Error al marcar la cuota');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Listado de Alumnos y Estado de Cuotas
      </Typography>

      {/* Mensajes de carga o error */}
      {loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
          Cargando cuotas...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', my: 2 }}>
          {error}
        </Typography>
      )}

      {/* Tabla de cuotas */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Fecha Cuota</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Fecha de Pago</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsWithShares.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                    No hay cuotas para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                studentsWithShares.map((item) => (
                  <TableRow key={`${item.student_id}-${item.share_id || 'no-share'}`}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.date || 'Sin cuota'}</TableCell>
                    <TableCell>{item.amount ? `$${item.amount}` : '-'}</TableCell>
                    <TableCell>{item.state || 'Sin cuota'}</TableCell>
                    <TableCell>{item.paymentmethod || '-'}</TableCell>
                    <TableCell>{item.paymentdate || '-'}</TableCell>
                    <TableCell>
                      {item.state === 'Pendiente' || item.state === 'Vencido' ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleMarkAsPaid(item.share_id, item.student_id)}
                        >
                          Marcar como Pagado
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SharesPage;