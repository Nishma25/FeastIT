import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/css/AdminLoginPage.css";
import logo from "../../assets/images/logo.png";
import MessagePopup from "../../components/MessagePopup"; // ✅ Import your Popup

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ visible: false, type: "info", message: "" }); // ✅ Popup State
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/adminLogin', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.token); // ✅ Save token
        setPopup({ visible: true, type: "success", message: "Login successful!" });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500); // Delay navigation to allow popup to show
      }
    } catch (error) {
      setPopup({
        visible: true,
        type: "error",
        message: error.response?.data?.message || "Login failed, try again."
      });
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="orange-line">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ margin: "10px", marginRight: '20px', marginLeft: '20px' }} />
            <span className='brand'>Feast-IT</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="background-box">
            <span>
              <p className='h1'>Welcome back!</p>
              <p className='h2'>Enter your credentials to access your account</p>
            </span>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Admin ID</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Link to="/forgotPassword" className="link">Forgot password?</Link>
              </div>

              <button type="submit">Login</button>

              <div className='signup-link'>
                Don't have an account?
                <Link to="/adminSignUp" className="link"> Sign Up</Link>
              </div>
            </form>

          </div>
        </div>
      </div>

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

export default AdminLoginPage;
