import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const handleSignup = (e) => {
    e.preventDefault();
    // Add your signup logic here
    alert('Signup successful!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Restaurant Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter Restaurant Name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter Password"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter Address"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter Phone Number"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
