import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PatternEditor from "./pages/PatternEditor";

import RegisterForm from "./components/Auth/RegisterForm";
import Login from "./components/Auth/Login";

import Navigation from "./components/Navigation";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
  
      <Navigation token={token} setToken={setToken} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<RegisterForm />} />

       
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard user={user} setUser={setUser} setToken={setToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/editor"
          element={
            token ? <PatternEditor user={user} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
