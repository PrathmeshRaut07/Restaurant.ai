import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import Home from '../components/Home/home'; // Import Home component

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Home />} /> {/* New home route */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
