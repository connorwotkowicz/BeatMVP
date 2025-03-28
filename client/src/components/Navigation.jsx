import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      {!user ? (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link> |{" "}
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/editor">Editor</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navigation;
