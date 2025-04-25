// MessagePopup.jsx
import React, { useEffect } from "react";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import "../assets/css/MessagePopup.css"; // Import your CSS file for styling

const iconMap = {
  success: <CheckCircle className="icon success" />, 
  error: <XCircle className="icon error" />, 
  warning: <AlertTriangle className="icon warning" />, 
  info: <Info className="icon info" />
};

const MessagePopup = ({ type = "info", message, visible, onClose, autoHide = true, duration = 3000 }) => {
  useEffect(() => {
    if (visible && autoHide) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`popup-container ${type}`}>
      <div className="popup-icon">{iconMap[type]}</div>
      <div className="popup-message">{message}</div>
      <button className="popup-close" onClick={onClose}>✕</button>
    </div>
  );
};

export default MessagePopup;
