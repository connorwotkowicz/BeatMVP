//BASIC APP.JSX TEMPLATE


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/main.scss'; // Import your global styles

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
// import SingleBeatPage from './pages/SingleBeatPage'; // Example page for a single beat

// Authentication utility (you can replace this with your actual logic)
import { checkAuth } from './utils/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate a check for user authentication (replace with actual JWT check)
    const checkIfAuthenticated = async () => {
      const isLoggedIn = await checkAuth(); // You'll implement this function
      setIsAuthenticated(isLoggedIn);
    };

    checkIfAuthenticated();
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Navigation bar */}
        <Navigation isAuthenticated={isAuthenticated} />

        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/account" element={isAuthenticated ? <AccountPage /> : <LoginPage />} />
            <Route path="/beat/:id" element={<SingleBeatPage />} /> {/* Example of a dynamic route */}
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
