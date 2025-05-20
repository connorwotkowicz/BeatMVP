import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Failed to fetch user from /me:", errorData);
            setUser(null);
            return;
          }

          return res.json();
        })
        .then((data) => {
          if (data?.id) {
            console.log("User loaded from token:", data);
            setUser(data);
          } else {
            console.warn("Invalid user data:", data);
            setUser(null);
          }
        })
        .catch((err) => {
          console.error("AuthContext fetch error:", err);
          setUser(null);
        });
    }
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
