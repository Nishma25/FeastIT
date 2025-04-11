import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle Logout Confirmation
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Clear any stored session (if applicable)
    navigate("/adminLogin"); // Redirect to vendor login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>Home Page</button>
        <button className="sidebar-btn" onClick={() => navigate("/vendors")}>Vendor Profile</button>
        <button className="sidebar-btn" onClick={() => navigate("/customers")}>Customer Profile</button>
        {/* <button className="sidebar-btn" onClick={() => navigate("/appearance")}>Appearance</button> */}
        <button className="sidebar-btn logout-btn"  onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-buttons">
              <button className="confirm-btn" onClick={handleLogout}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
