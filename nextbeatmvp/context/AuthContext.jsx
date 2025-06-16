'use client'

import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL|| "http://localhost:3001";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
         
            console.warn("Session expired - logging out");
            logout();
          }
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        if (data?.id) {
          setUser(data);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.error("AuthContext fetch error:", error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
   
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};