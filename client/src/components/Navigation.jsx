import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navigation = ({ token, setUser, setToken }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link> |{" "}
      {!token ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/editor">Editor</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {" | "}
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </nav>
  );
};

export default Navigation;
