import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { NotificationProvider } from "./context/notification/notificationContext";
import Router from './routes/router.jsx';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router/>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;