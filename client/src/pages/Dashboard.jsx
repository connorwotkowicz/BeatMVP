import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"; // assuming you have a centralized API file
import SavedBeats from "../components/SavedBeats";



const Dashboard = ({ user, setUser, setToken }) => {
  const [userBeats, setUserBeats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
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
            <Link
              to="#"
              className="view-books-btn"
              onClick={() => setShowPopup(true)}
            >
              View Patterns
            </Link>
          </div>
          {showPopup && (
            <SavedBeats
              userBeats={userBeats}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>

        <Link to="#" className="logout-link" onClick={handleLogout}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
