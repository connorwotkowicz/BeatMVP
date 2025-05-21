import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to fetch user from /me:", errorData);
          setToken("");
          setUser(null);
          localStorage.removeItem("token");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.id) {
          setUser(data);
        } else {
          setToken("");
          setUser(null);
          localStorage.removeItem("token");
        }
      })
      .catch((err) => {
        console.error("AuthContext fetch error:", err);
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
      });
  }, [token]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
