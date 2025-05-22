import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || "Login failed");

     
      login(loginData.token, loginData.user);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
  
      <div className="login-container">
        <div className="my-book">
          <h3>myBeats</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Enter your email to continue</h2>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="login-instr">
            <h4>
              Log in to BeatMVP with your email. If you don't have an account,
              click the link below to create one.
            </h4>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                autoFocus
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="sign-button">
             <p> Sign in </p>
            </button>
          </form>
        </div>

        <div className="login-instr">
          <h4>New to BeatMVP?</h4>
          <div className="sign-up-link">
            <Link to="/register">
              <h4>Sign up</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
