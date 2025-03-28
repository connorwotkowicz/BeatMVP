import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();
      if (!result.token) throw new Error("Invalid credentials");

      localStorage.setItem("token", result.token);
      setToken(result.token);

      const userResponse = await fetch(
        "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${result.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await userResponse.json();
      if (!userData?.id) throw new Error("Failed to fetch user data");

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/account");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isMounted) return null;

  return (
    
    
    <div className="login-page">
      
     <div className="logo-wrapper">
      <Link to="/books" className="lognav-logo">MVPBeats</Link>
    </div>
      <div className="login-container">
  
      <div className= "my-book">
        <h3>myBeats</h3>
        </div>

        <div className="inner-content">
        <div className="logreg-title">
          <h2>Enter your email to continue </h2>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className= "login-instr">
          <h4>Log in to MVPBeats with your email. If you don't have an account, click the link below to create one. </h4>
          </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="log-input-group">
            <input
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
          <button type="submit" className="sign-button">Sign in</button>
        </form>
        </div>

        
          <div className= "login-instr"> 

        
       <h4> New to MVPBeats?</h4> 
       <div className= "sign-up-link" ><Link to="/register"><h4>Sign up</h4></Link>
       </div>

      </div>
    </div>
    </div>
  );
}
