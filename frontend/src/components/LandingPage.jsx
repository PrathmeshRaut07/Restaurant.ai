import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold text-white mb-8">Welcome to My App</h1>
      <button
        onClick={handleGetStarted}
        className="px-8 py-4 bg-white text-blue-500 font-semibold rounded shadow hover:bg-gray-100"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
