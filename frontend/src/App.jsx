
<<<<<<< HEAD
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
=======

const App = () => {
  return (
>>>>>>> 49a6e17c4dc982d7477b854156224fdd17ca150d

  );
};

// Vista principal con la tabla
const Home = () => {
  const { students, deleteStudent } = useContext(StudentContext);
  return <StudentTable students={students} onDelete={deleteStudent} />;
};

export default App;
