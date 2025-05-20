import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import defaultProfilePic from "/public/assets/images/default-profile.png";
import { Sun, Moon } from "lucide-react"; // ✅ outlined icons

const Navigation = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, token, logout } = useContext(AuthContext);

  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileTimeout = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${theme}-theme`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="lognav-logo">
            BeatMVP
          </Link>
        </div>

        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-button">
                Dashboard
              </Link>
              <Link to="/editor" className="nav-button">
                Editor
              </Link>

              {/* ✅ Outlined theme toggle icon */}
              <button
                className="theme-toggle-button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              >
                {theme === "dark" ? (
                  <Sun size={20} strokeWidth={1.5} />
                ) : (
                  <Moon size={20} strokeWidth={1.5} />
                )}
              </button>

              <div
                className="account-dropdown"
                ref={profileRef}
                onMouseEnter={() => {
                  clearTimeout(profileTimeout.current);
                  setProfileDropdownVisible(true);
                }}
                onMouseLeave={() => {
                  profileTimeout.current = setTimeout(() => {
                    setProfileDropdownVisible(false);
                  }, 200);
                }}
              >
                <img
                  src={user?.profilePic || defaultProfilePic}
                  alt="Profile"
                  className="account-avatar"
                />

                {profileDropdownVisible && (
                  <div className="account-dropdown-menu show" role="menu" aria-label="Account Options">
                    <Link to="/account" className="dropdown-link">
                      Account
                    </Link>
                    <Link to="/account/orders" className="dropdown-link">
                      Order History
                    </Link>
                    <Link to="/account/saved" className="dropdown-link">
                      Saved
                    </Link>

                    {user?.user_role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-link">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="dropdown-link logout-button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
