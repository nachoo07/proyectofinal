
import { UserProvider } from './context/user/UserContext';
import Routing from './routes/Routing';
import { LoginProvider } from './context/login/LoginContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { NotificationProvider } from "./context/notification/notificationContext";
import { SharesProvider } from './context/share/ShareContext';
import { TeacherProvider } from './context/teacher/TeacherContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <>
      
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginProvider>
          <UserProvider>
          <NotificationProvider>
            <SharesProvider>
              <TeacherProvider>
                <Routing />
              <ToastContainer />
              </TeacherProvider> 
            </SharesProvider>
          </NotificationProvider>
          </UserProvider>
        </LoginProvider>
      </ThemeProvider>
    </>
  );
}

export default App;