import { Box, Container, Typography } from '@mui/material';
import MotionComponent from '../../components/motions/motionComponent.jsx';

const PageMotions = () => {
  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
        </Typography>
        <MotionComponent />
      </Box>
    </Container>
  );
};

export default PageMotions;