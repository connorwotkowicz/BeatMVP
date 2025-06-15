'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Registration failed.');

      login(data.token, data.user);
    setError('Registration successful! You are now logged in.');
setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-wrapper">
        <Link href="/" className="lognav-logo">
          BeatMVP
        </Link>
      </div>

      <div className="register-container">
        <div className="my-beat">
          <h3>myBeats</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
             <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Registration successful! Redirecting...</p>}
          </div>

          <div className="login-instr">
            <h4>
              Enter your email and set a password to create your BeatMVP account.
            </h4>
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
            <button type="submit" className="reg-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
