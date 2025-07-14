import { Routes, Route, Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from '../routes/protectRoutes/ProtectedRoute';
import PageLogin from '../components/login/Login';
import PageHomeAdmin from '../pages/homeAdmin/PageHomeAdmin';
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

const Routing = () => {
  return (
    <ErrorBoundary>
      <Routes>
        

        <Route path="/login" element={<PageLogin />} />

        {/* Rutas admin sin NavBar para '/' */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/" element={<PageHomeAdmin />} />
        </Route>

        {/* Rutas admin con NavBar */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* Poner NavBar en estas rutas */}
          <Route
            element={
              <>
                <NavBar />
                <Outlet />
              </>
            }
          >
            <Route path="/user" element={<PageUser />} />
            <Route path="/motions" element={<PageMotion />} />
            <Route path="/students" element={<PageStudent />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/students/:id/edit" element={<PageEditStudent />} />
            <Route path="/teachers" element={<PageTeacher />} />
            <Route path="/reports" element={<PageReport />} />
            <Route path="/settings" element={<PageSettings />} />
            <Route path="/shares" element={<SharesPage />} />
          </Route>
        </Route>

        {/* Rutas para usuarios normales con NavBar */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route
            element={
              <>
                <NavBar />
                <Outlet />
              </>
            }
          >
            <Route path="/homeuser" element={<PageUser />} />
            <Route path="/notifications" element={<PageNotification />} />
            <Route path="/shares/student/:studentId" element={<PageStudentShares />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default Routing;
