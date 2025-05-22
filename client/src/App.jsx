import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/Navigation";
import MobileNavbar from "./components/MobileNavbar"; // ✅ fixed path

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PatternEditor from "./pages/PatternEditor";

import RegisterForm from "./components/Auth/RegisterForm";
import Login from "./components/Auth/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <header>
        <div className="desktop-nav">
          <Navigation />
        </div>
        <div className="mobile-nav">
          <MobileNavbar />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <PatternEditor />
            </RequireAuth>
          }
        />
        <Route path="/pattern-editor/:beatId" element={<PatternEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
