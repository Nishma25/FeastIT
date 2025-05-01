import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";
import MessagePopup from "../components/MessagePopup"; // ✅ Import Popup

function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: "info", message: "" }); // ✅ Popup state
  const handleLogout = () => {
    // Clear token
    localStorage.removeItem("jwtToken");
  
    // Close the confirm modal
    setShowLogoutConfirm(false);
  
    // // Show popup
    // setPopup({ visible: true, type: "success", message: "Logged out successfully!" });
  
    // After a short delay, redirect
    navigate("/adminLogin");
    // setTimeout(() => {
  
    // }, 1500);
  };
  

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {/* <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>Home Page</button> */}
        <button className="sidebar-btn" onClick={() => navigate("/analytics")}>Dashboard</button>
        <button className="sidebar-btn" onClick={() => navigate("/vendors")}>Vendor Profile</button>
        <button className="sidebar-btn" onClick={() => navigate("/customers")}>Customer Profile</button>
        <button className="sidebar-btn" onClick={() => navigate("/orders")}>Orders</button>
        {/* <button className="sidebar-btn" onClick={() => navigate("/analytics")}>Analytics</button> */}

        <button className="sidebar-btn logout-btn" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>

      {/* ✅ Logout Confirmation Modal */}
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

      {/* ✅ Popup Component */}
      <MessagePopup
        visible={popup.visible}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, visible: false })}
      />
    </div>
  );
}

export default Sidebar;
