import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { NotificationProvider } from "./context/notification/notificationContext";
import Router from './routes/router.jsx';
import { SharesProvider } from './context/share/ShareContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <SharesProvider>
          <Router />
          <ToastContainer />
        </SharesProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;