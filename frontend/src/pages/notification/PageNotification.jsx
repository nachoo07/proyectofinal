import { Box, Container, Typography } from '@mui/material';
import NotificationComponent from '../../components/notification/notificationComponent.jsx';
import { NotificationProvider } from '../../context/notification/notificationContext.jsx';
import ErrorBoundary from '../../components/ErrorBoundary/errorBoundary.jsx'; // Crear este componente

const PageNotification = () => {
  return (
    <NotificationProvider>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
          </Typography>
          <ErrorBoundary>
            <NotificationComponent />
          </ErrorBoundary>
        </Box>
      </Container>
    </NotificationProvider>
  );
};

export default PageNotification;