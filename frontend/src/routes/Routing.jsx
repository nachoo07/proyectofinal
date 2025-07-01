import { Routes, Route } from 'react-router-dom'
import PageUser from '../pages/user/PageUser'
import PageHomeAdmin from '../pages/homeAdmin/PageHomeAdmin'
import PageLogin from '../pages/login/PageLogin'
import PageMotion from '../pages/motion/PageMotion'
import PageNotification from '../pages/notification/PageNotification'
import PageReport from '../pages/report/PageReport'
import SharesPage from '../pages/share/PageShare'
import NavBar from '../components/NavBar/NavBar'
import ErrorBoundary from '../components/ErrorBoundary/errorBoundary'
import PageStudent from '../pages/student/PageStudent'
import PageSettings from '../pages/settings/PageSettings'

const Routing = () => {
  return (
    <>
    <NavBar/>
    <ErrorBoundary>
      
      <Routes>
        <Route path="/user" element={<PageUser />} />
        <Route path="/" element={<PageHomeAdmin />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/motions" element={<PageMotion />} />
        <Route path="/students" element={<PageStudent/>}/>
        <Route path="/notifications" element={<PageNotification />} />
        <Route path="/reports" element={<PageReport />} />
        <Route path="/shares" element={<SharesPage />} />
        <Route path='/settings' element={<PageSettings/>}/>
      </Routes>
      </ErrorBoundary>
    </>
  )
}

export default Routing