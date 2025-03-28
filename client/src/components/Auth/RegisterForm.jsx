import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setError(null);
     
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

 
        setToken(result.token);
        setUser(result.user);

      
        alert("Registration successful! You are now logged in.");

      
        navigate("/dashboard");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-wrapper">
        <Link to="/" className="lognav-logo">
          MVPBeats
        </Link>
      </div>
      <div className="register-container">
        <div className="my-beat">
          <h3>myBeats</h3>
        </div>
        <div className="inner-content">
          <div className="logreg-title">
            <h2> Register </h2>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="login-instr">
            <h4>Enter your email and set a password to create your MVPBeats account.</h4>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Set password"
              />
            </div>
            <button type="submit" className="reg-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
