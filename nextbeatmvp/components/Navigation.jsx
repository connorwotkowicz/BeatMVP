'use client';

import React, { useContext, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import defaultProfilePic from "/public/assets/images/default-profile.png";
import { Sun, Moon } from "lucide-react";

const Navigation = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, token, logout } = useContext(AuthContext);

  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    router.push("/");
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
          <Link href="/" className="lognav-logo">
            BeatMVP
          </Link>
        </div>

        <div className="nav-right">
          {!token ? (
            <>
              <Link href="/login" className="nav-button">Login</Link>
              <Link href="/register" className="nav-button">Register</Link>
            </>
          ) : (
            <>
              <Link href="/editor" className="nav-button">Sequencer</Link> 

              <div
                className="account-dropdown"
                ref={profileRef}
                onMouseEnter={() => {
                  clearTimeout(hideTimeoutRef.current);
                  setProfileDropdownVisible(true);
                }}
                onMouseLeave={() => {
                  hideTimeoutRef.current = setTimeout(() => {
                    setProfileDropdownVisible(false);
                  }, 200);
                }}
              >
                <Link href="/dashboard">
                  <Image
                    src={user?.profilePic || defaultProfilePic}
                    alt="Profile"
                    className="account-avatar"
                    width={40}
                    height={40}
                  />
                </Link>

                <div
                  className={`account-dropdown-menu ${profileDropdownVisible ? "show" : ""}`}
                  role="menu"
                  aria-label="Account Options"
                  data-theme="light"
                >
                  <Link href="/dashboard" className="dropdown-link">Dashboard</Link>
                  {/* {user?.user_role === "admin" && (
                    <Link href="/admin/dashboard" className="dropdown-link">Admin Dashboard</Link>
                  )} */}
                  <button onClick={handleLogout} className="dropdown-link logout-button">Logout</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
