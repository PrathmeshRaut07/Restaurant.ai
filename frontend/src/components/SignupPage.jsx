import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

// Define the API base URL (replace with your actual backend URL if different)
const API_BASE_URL = 'http://localhost:8000'; // Make sure this matches your backend port

const SignupPage = () => {
  // --- State Variables ---
  const [formData, setFormData] = useState({
    restaurant_name: '',
    email: '',
    password: '',
    address: '',
    phone_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // To store backend error messages
  const [successMessage, setSuccessMessage] = useState(''); // To store success message
  const navigate = useNavigate(); // Hook for navigation

  // --- Handle Input Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Use input's 'name' attribute to update the correct state field
    }));
  };

  // --- Handle Form Submission ---
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default page reload
    setIsLoading(true);
    setError(null); // Clear previous errors
    setSuccessMessage(''); // Clear previous success message

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if required (e.g., CSRF token if implemented)
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json(); // Always try to parse JSON, even for errors

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 422, 500)
        // FastAPI often sends error details in a 'detail' field
        const errorMessage = data.detail || `Signup failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // --- Signup Successful ---
      setSuccessMessage(data.message || 'Signup successful! Please check your email to verify your account.');
      // Optionally clear the form
      setFormData({
        restaurant_name: '',
        email: '',
        password: '',
        address: '',
        phone_number: '',
      });
      // Optionally navigate the user after a short delay or prompt
      // setTimeout(() => navigate('/login'), 3000); // Example: Navigate to login after 3 seconds

    } catch (err) {
      // Handle network errors or errors thrown from the response check
      console.error("Signup error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Ensure loading state is turned off
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* --- Display Success Message --- */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* --- Display Error Message --- */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* --- Input Fields (Added name, value, onChange) --- */}
          <div className="mb-4">
            <label htmlFor="restaurant_name" className="block mb-1 font-medium">Restaurant Name</label>
            <input
              type="text"
              id="restaurant_name"
              name="restaurant_name" // Matches backend UserCreate model field
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Restaurant Name"
              value={formData.restaurant_name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email" // Matches backend UserCreate model field
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password" // Matches backend UserCreate model field
              required
              minLength={6} // Basic frontend validation
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              id="address"
              name="address" // Matches backend UserCreate model field
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone_number" className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number" // Matches backend UserCreate model field
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Phone Number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* --- Submit Button --- */}
          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* --- Link to Login --- */}
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