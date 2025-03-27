
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#eee", marginBottom: "1rem" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/editor">Editor</Link>
    </nav>
  );
};

export default Navigation;
