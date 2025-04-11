import React, { useState } from "react"; // ✅ Import useState
import { FaBars } from "react-icons/fa"; // Import Hamburger Icon
import logo from "../assets/images/logo.png";
import "../assets/css/Header.css"; // Ensure the CSS file exists

function Header({ toggleSidebar }) {
  const [isClicked, setIsClicked] = useState(false); // ✅ Fix: Import useState

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle color state
    toggleSidebar(); // Call function to toggle sidebar
  };

  return (
    <div className="orange-line">
      <div className="header-content">
        {/* Sidebar Toggle Button */}
        <FaBars 
          className={`hamburger-icon ${isClicked ? "clicked" : ""}`} 
          onClick={handleClick} 
        /> 
        {/* Logo and Brand Name */}
        <img src={logo} alt="Feast-IT Logo" className="logo" />
        <span className="brand">Feast-IT</span>
      </div>
    </div>
  );
}

export default Header;

