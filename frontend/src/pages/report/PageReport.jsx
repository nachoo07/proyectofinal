import { Box, Container, Typography } from '@mui/material';
import { MotionProvider } from '../../context/motion/MotionContext.jsx';
import ErrorBoundary from '../../components/ErrorBoundary/errorBoundary.jsx'; // Crear este componente
import ReportComponent from '../../components/report/reportComponent.jsx';

const PageReport = () => {
  return (
    <MotionProvider>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
          </Typography>
          <ErrorBoundary>
            <ReportComponent />
          </ErrorBoundary>
        </Box>
      </Container>
    </MotionProvider>
  );
};

export default PageReport;