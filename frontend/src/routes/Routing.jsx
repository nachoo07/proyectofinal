import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageUser from '../pages/user/PageUser';
import PageHomeAdmin from '../pages/homeAdmin/PageHomeAdmin';
import PageLogin from '../pages/login/PageLogin';
import PageMotion from '../pages/motion/PageMotion';
import PageNotification from '../pages/notification/PageNotification';
import PageReport from '../pages/report/PageReport';
import SharesPage from '../pages/share/PageShare';
import PageTeacher from '../pages/teacher/PageTeacher';
import PageStudentShares from '../pages/share/PageStudentShares'; // Nueva página
import NavBar from '../components/NavBar/NavBar';

import PageStudent from '../pages/student/PageStudent';
import PageEditStudent from '../pages/student/PageEditStudent';
import StudentDetail from '../pages/student/StudentDetail';


const Routing =() => {
  return(
    <>
      <Routes>
        <Route path="/user" element={<PageUser/>}/>
        <Route path="/" element={<PageHomeAdmin/>}/>
        <Route path="/login" element={<PageLogin/>}/>
        <Route path="/motions" element={<PageMotion/>}/>
        <Route path="/notifications" element={<PageNotification/>}/>
        <Route path="/reports" element={<PageReport/>}/>
        <Route path="/shares" element={<SharesPage/>}/>
        <Route path="/shares/student/:studentId" element={<PageStudentShares />} /> {/* Actualizamos a la nueva página */}
        <Route path="/teachers" element={<PageTeacher />} /> 
        <Route path="/students" element={<PageStudent />} />
        <Route path="/students/:id/edit" element={<PageEditStudent />} />
        <Route path="/students/:id" element={<StudentDetail />} />


      </Routes>
    </>
  );
};


export default Routing;
