import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"; 

const Dashboard = ({ user, setUser, setToken }) => {
  const [userBeats, setUserBeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchUserBeats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setToken("");
          navigate("/login");
          return;
        }

        const response = await API.get("/beats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.beats) {
          setUserBeats(response.data.beats);
        } else {
          setUserBeats([]);
        }
      } catch (error) {
        console.error("Error fetching beats:", error);
      }
    };

    fetchUserBeats();
  }, [user?.id, navigate, setUser, setToken]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">🎛️ BeatMVP Dashboard</h1>

        <div className="account-section">
          <div className="section-header">
            <h3>myBeatMVP</h3>
          </div>
          <div className="info-cont">
            <p className="user-label">Email</p>
            <p className="user-value">{user?.email || "N/A"}</p>
            <p className="user-label">Password</p>
            <p className="user-value">{"*".repeat(8)}</p>
          </div>
          <Link to="#" className="account-link-buddy">
            <span className="shiny-text">Manage myBeats</span>
          </Link>
        </div>

        <div className="account-section">
          <div className="section-header">
            <h3>Your Beats</h3>
          </div>
          <div className="checked-books-container">
            <p className="check-title">Saved Patterns</p>
        
            <div className="beats-list">
              {userBeats.length > 0 ? (
                userBeats.map((beat) => (
                  <div key={beat.id} className="beat-item">
                    <p>{beat.title}</p>
               
                  </div>
                ))
              ) : (
                <p>No saved beats found.</p>
              )}
            </div>
          </div>
        </div>

        <Link to="#" className="logout-link" onClick={handleLogout}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
