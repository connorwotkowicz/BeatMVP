import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend API URL
  withCredentials: true, // Enables credentials (cookies, etc.) to be sent along with requests
});

// Request interceptor to add the Authorization header with the JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to headers if available
  }
  return config; // Proceed with the request
});

// Response interceptor to handle errors globally if needed
API.interceptors.response.use(
  (response) => response, // If the response is successful, return the response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., token expired or not present)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page if not authenticated
      window.location.href = '/login'; 
    }
    return Promise.reject(error); // Reject any other errors
  }
);

export default API; // Export API instance
