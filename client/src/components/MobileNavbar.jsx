import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="mobile-navbar">
      <div className="navbar-header">
        <h1 className="logo">BeatSeq</h1>
        <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </div>
      </div>

      <ul className={`nav-links ${isOpen ? "show" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>

        {token ? (
          <>
            <li><Link to="/editor" onClick={closeMenu}>Sequencer</Link></li>
            <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
            <li><button onClick={handleLogout} className="signout-button">Sign out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
            <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
