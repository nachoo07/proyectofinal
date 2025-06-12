import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { NotificationProvider } from "./context/notification/notificationContext";
import Routing from './routes/Routing';
import { SharesProvider } from './context/share/ShareContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/user/UserContext';
import { StudentProvider } from './context/student/StudentContext';

//NO SE TOCA, POR QUE SINO NO ANDA LA NAVEGACION!!!!! 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <UserProvider>
          <StudentProvider>
            <SharesProvider>
              <Routing />
              <ToastContainer />
            </SharesProvider>
          </StudentProvider>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;