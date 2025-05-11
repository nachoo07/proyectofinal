// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SharesProvider } from './context/share/ShareContext';
import SharesPage from './pages/share/PageShare';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <SharesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/shares" />} />
          <Route path="/shares" element={<SharesPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </SharesProvider>
  );
}

export default App;