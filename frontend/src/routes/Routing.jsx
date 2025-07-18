import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from '../routes/protectRoutes/ProtectedRoute';
import PageLogin from '../components/login/Login';
import PageHomeAdmin from '../pages/homeAdmin/PageHomeAdmin';
import PageHomeUser from '../pages/homeUser/PageHomeUser';
import PageUser from '../pages/user/PageUser';
import PageMotion from '../pages/motion/PageMotion';
import PageNotification from '../pages/notification/PageNotification';
import PageReport from '../pages/report/PageReport';
import SharesPage from '../pages/share/PageShare';
import PageStudent from '../pages/student/PageStudent';
import PageSettings from '../pages/settings/PageSettings';
import PageTeacher from '../pages/teacher/PageTeacher';
import PageStudentShares from '../pages/share/PageStudentShares';
import PageEditStudent from '../pages/student/PageEditStudent';
import StudentDetail from '../pages/student/StudentDetail';
import NavBar from '../components/navbar/Navbar'; // Lo usaremos solo en algunas rutas

import PageAttendance from '../pages/attendance/PageAttendance';
import NotFound from '../pages/notFound/NotFound';

const Routing = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname.includes('login')
  return (
    <ErrorBoundary>
      {
        !isLoginRoute && <NavBar />
      }
      <Routes>
        <Route path="/login" element={<PageLogin />} />
        
        {/* Rutas para Administradores */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/" element={<PageHomeAdmin />} />
          <Route path="/user" element={<PageUser />} />
          <Route path="/motions" element={<PageMotion />} />
          <Route path="/students/:id/edit" element={<PageEditStudent />} />
          <Route path="/teachers" element={<PageTeacher />} />
          <Route path="/reports" element={<PageReport />} />
          <Route path="/settings" element={<PageSettings />} />
          <Route path="/shares" element={<SharesPage />} />
          <Route path="/shares/student/:studentId" element={<PageStudentShares />} />
        </Route>

        {/* Rutas para Usuarios No Admin */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/homeuser" element={<PageHomeUser />} />
        </Route>

        {/* Rutas Compartidas (Admin y User) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
          <Route path="/students" element={<PageStudent />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/notifications" element={<PageNotification />} />
          <Route path="/attendance" element={<PageAttendance />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default Routing;
