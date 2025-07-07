import React from 'react';
import { Box, Typography } from '@mui/material';
import Share from '../../components/share/Share'; // Ajusta la ruta según la ubicación de Share.jsx

const SharesPage = () => {
  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Estado de Cuotas
      </Typography>
      <Share />
    </Box>
  );
};

export default SharesPage;