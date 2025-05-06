import { Box, Container, Typography } from '@mui/material';
import MotionComponent from '../../components/motions/motionComponent.jsx';
import { MotionProvider } from '../../context/motion/MotionContext.jsx';

const PageMotions = () => {
  return (
    <MotionProvider>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
          </Typography>
          <MotionComponent />
        </Box>
      </Container>
    </MotionProvider>
  );
};

export default PageMotions;