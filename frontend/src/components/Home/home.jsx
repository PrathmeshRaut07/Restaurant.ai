import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Image, PenBox } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // Make sure this matches your backend URL

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For general loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading state
  const [error, setError] = useState('');

  // Retrieve token securely - consider context or state management for real apps
  const token = localStorage.getItem('access_token');

  // --- Fetch Menu Items ---
  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        headers: {
          // Only include Authorization header if token exists
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json', // Good practice, though GET might not need it
        },
      });
      if (!response.ok) {
         // Handle specific errors like 401 Unauthorized
        if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
            // Consider redirecting to login page here
        }
        throw new Error(`Failed to fetch menu items (Status: ${response.status})`);
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Fetch error:", err); // Log detailed error
      setError(err.message || 'An unexpected error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on component mount

  // --- Form Input Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
        setError("Authentication error: No token found. Please log in.");
        return;
    }
    setIsSubmitting(true); // Use separate loading state for submission
    setError('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/menu/`, {
        method: 'POST',
        headers: {
          // FormData sets Content-Type automatically, DO NOT set it manually here
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (jsonError) {
            // Handle cases where the error response isn't valid JSON
            throw new Error(`Failed to create menu item (Status: ${response.status})`);
        }
         // Check for specific backend validation errors if available
        const errorMessage = errorData?.detail || `Failed to create menu item (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      const newItem = await response.json();
      setMenuItems(prev => [...prev, newItem]); // Add new item to the list

      // Clear the form fields
      setFormData({ name: '', description: '', price: '' });
      setImageFile(null);
      // Reset file input visually
      if (e.target.querySelector('input[type="file"]')) {
        e.target.querySelector('input[type="file"]').value = '';
      }

    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete Menu Item ---
  const handleDelete = async (id) => {
     if (!token) {
        setError("Authentication error: No token found. Please log in.");
        return;
    }
    // Optional: Confirmation dialog
    if (!window.confirm("Are you sure you want to delete this item?")) {
       return;
    }

    setIsLoading(true); // Use general loading as it affects the list display
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: Cannot delete item.');
        }
         if (response.status === 404) {
            throw new Error('Item not found.');
        }
        throw new Error(`Failed to delete menu item (Status: ${response.status})`);
      }
      // No content expected on successful DELETE (status 204 usually)
      setMenuItems(prev => prev.filter(item => item.id !== id)); // Remove item from list
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || 'An unexpected error occurred while deleting.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Component ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8"> {/* More padding on larger screens */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b border-gray-200 pb-3">
          Restaurant Menu Management
        </h1>

        {/* --- Error Display Area --- */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* --- Add Menu Item Form --- */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
          <div className="flex items-center mb-4">
            <Plus className="mr-2 text-green-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-700">Add New Menu Item</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="e.g., Margherita Pizza"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01" // Allow cents
                  min="0" // Prevent negative prices
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder="e.g., 12.99"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                rows="3"
                placeholder="e.g., Classic pizza with tomato sauce, mozzarella, and basil"
                required
                aria-required="true"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
                <Image className="inline-block mr-1 text-gray-600" size={16} />
                Upload Image (Optional)
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/gif" // Be more specific with accepted types
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-describedby="image-file-description"
              />
               <p id="image-file-description" className="mt-1 text-xs text-gray-500">
                {imageFile ? `Selected: ${imageFile.name}` : "Max file size 2MB. JPG, PNG, WEBP, GIF accepted."}
               </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting} // Disable during submission
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Menu Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* --- Menu Items List Section --- */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-4">
            <PenBox className="mr-2 text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-700">Current Menu</h2>
          </div>

          {/* Loading State for List */}
          {isLoading && (
             <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading Menu...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && menuItems.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Image size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">No menu items found.</p>
              <p>Add your first delicious item using the form above!</p>
            </div>
          )}

          {/* Menu Grid */}
          {!isLoading && menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col" // Flex column for layout
                  role="listitem"
                >
                  {/* Image Container */}
                  <div className="h-40 w-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"> {/* Fixed Height, background for consistency */}
                    {item.image_base64 || item.image_url ? (
                      <img
                        // Prefer base64 if available, otherwise use URL
                        src={item.image_base64 ? `data:image/jpeg;base64,${item.image_base64}` : (item.image_url ? `${API_BASE_URL}${item.image_url}` : '')} // Construct full URL if using relative path from backend
                        alt={item.name || 'Menu item image'} // Provide default alt text
                        // *** USE object-fill TO FORCE EXACT SIZE (MAY DISTORT) ***
                        // *** OR use object-cover TO MAINTAIN ASPECT RATIO (MAY CROP) ***
                        className="w-full h-full object-fill" // <--- THIS IS THE CHANGED LINE
                        loading="lazy" // Lazy load images for performance
                        onError={(e) => { // Basic error handling for broken image links
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.style.display = 'none'; // Hide broken image
                           // Optionally show a placeholder div instead
                           const parent = e.target.parentElement;
                           if (parent) parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><Image size={40} /></div>';
                        }}
                      />
                    ) : (
                       // Placeholder if no image provided
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image size={40} /> {/* Placeholder icon */}
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="p-4 flex flex-col flex-grow"> {/* Flex-grow allows this section to fill space */}
                    <div className="flex justify-between items-start mb-2 gap-2"> {/* Added gap */}
                      <h3 className="text-lg font-bold text-gray-800 break-words">{item.name}</h3> {/* Allow long names to wrap */}
                      <span className="text-lg text-green-700 font-semibold whitespace-nowrap ml-2">
                        ${/* Ensure price is a number before formatting */}
                        {typeof item.price === 'number' ? item.price.toFixed(2) : (parseFloat(item.price) || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 flex-grow min-h-[3rem]"> {/* Ensure min-height for description */}
                        {item.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex justify-end mt-auto pt-2 border-t border-gray-100"> {/* mt-auto pushes button to bottom */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isLoading} // Disable button while any global loading is happening
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> {/* End Menu Items List Section */}

      </div> {/* End Main Card */}
    </div> // End Container
  );
};

export default Home;