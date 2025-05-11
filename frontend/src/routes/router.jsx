import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageNotification from '../pages/notification/PageNotification';
import PageMotion from '../pages/motion/PageMotion';
import NavBar from '../components/NavBar/NavBar';
import PageReport from '../pages/report/PageReport';
import SharesPage from './pages/share/PageShare';

function Router() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<div></div>} />

        <Route path="/movimientos" element={<PageMotion />} />

        <Route path="/notifications" element={<PageNotification />} />
        <Route path="/reports" element={<PageReport/>} />

        <Route path="/shares" element={<SharesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;