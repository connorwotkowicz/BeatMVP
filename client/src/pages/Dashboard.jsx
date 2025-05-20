import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [userBeats, setUserBeats] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!user) return; 

    if (!user.id) {
      navigate("/login");
      return;
    }

    const fetchUserBeats = async () => {
      try {
        const response = await API.get("/beats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Beat response:", response);

        const beats = response?.data?.beats || [];
        setUserBeats(beats);
      } catch (error) {
        console.error("Error fetching beats:", error);
      }
    };

    fetchUserBeats();
  }, [user, token, navigate]);
console.log("User in Dashboard:", user);


  const handleLogout = () => {
    logout();
    localStorage.removeItem("user"); 
    navigate("/");
  };

  if (!user) return <p>Loading user info...</p>;


  
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
      

    <div className="account-section">
       <h1 className="dashboard-title">BeatDash</h1>
          <div className="section-header">
            <h3>Your Beats</h3>
          </div>
           <p className="sub-title">Saved Patterns</p>
          <div className="checked-books-container">
      <div className="beats-list">
  {userBeats.length > 0 ? (
    userBeats.map((beat) => (
      <Link
        to={`/pattern-editor/${beat.id}`}
        key={beat.id}
        className="beat-item-link"
      >
        <div className="beat-item">
          <p>{beat.title}</p>
        </div>
      </Link>
    ))
  ) : (
    <p>No saved beats found.</p>
  )}

        

                 <Link to="#" className="account-link-buddy">
            <span className="shiny-text">Manage myBeats</span>
          </Link> 
            </div>
          </div>
        </div>

        <div className="account-section">
          <div className="section-header">
            <h3>Manage Account</h3>
          </div>
          <div className="info-cont">
            <p className="user-label">Email</p>
            <p className="user-value">{user.email || "N/A"}</p>
            <p className="user-label">Password</p>
            <p className="user-value">{"*".repeat(8)}</p>
          </div>
        <Link to="#" className="logout-link" onClick={handleLogout}>
          Logout
        </Link>
        </div>

    

  
      </div>
    </div>
  );
}
