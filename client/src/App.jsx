
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PatternEditor from "./pages/PatternEditor";


import RegisterForm from "./components/Auth/RegisterForm";
import Login from "./components/Auth/Login";


import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<PatternEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
