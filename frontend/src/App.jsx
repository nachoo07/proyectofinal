import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import lightTheme from './lighttheme';
import darkTheme from './darktheme';
import { NotificationProvider } from './context/notification/notificationContext';
import Routing from './routes/Routing';
import { SharesProvider } from './context/share/ShareContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/user/UserContext';
import { StudentProvider } from './context/student/StudentContext';
import { SettingsProvider, useSettings } from './context/settings/settingsContext';
import { LoginProvider } from './context/login/LoginContext';
import { TeacherProvider } from './context/teacher/TeacherContext';
import { AttendanceProvider } from './context/attendance/AttendanceContext';

// Componente interno para usar el hook correctamente
function AppContent() {
  const { themeMode, fontSize, getFontSize } = useSettings();

  const remValue = getFontSize(fontSize); // ej. "1rem", "1.125rem"
  const fontSizeNumber = parseFloat(remValue) * 16; // pasa rem a px base 16

  const appliedTheme = themeMode === 'dark'
    ? darkTheme(fontSizeNumber)
    : lightTheme(fontSizeNumber);

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <LoginProvider>
        <NotificationProvider>
          <UserProvider>
            <StudentProvider>
              <TeacherProvider>
                <SharesProvider>
                  {/* Contenedor global para layout centrado y responsive */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '100vh',
                      width: '100%',
                      margin: 0,
                      padding: 0,
                      boxSizing: 'border-box',
                    }}
                    className="app-container"
                  >
                    <AttendanceProvider>
                      <Routing />
                      <ToastContainer />
                    </AttendanceProvider>
                  </Box>
                </SharesProvider>
              </TeacherProvider>
            </StudentProvider>
          </UserProvider>
        </NotificationProvider>
      </LoginProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
