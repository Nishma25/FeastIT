import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../../assets/css/AdminLoginPage.css";
import logo from "../../assets/images/logo.png";
import MessagePopup from "../../components/MessagePopup";

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ visible: false, type: "info", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/adminLogin', {
        email,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.token);
        // setPopup({ visible: true, type: "success", message: "Login successful!" });
        navigate('/analytics');

        // setTimeout(() => {
        //   navigate('/dashboard');
        // }, 1500);
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
            <img src={logo} alt="Logo" style={{ margin: "10px 20px" }} />
            <span className='brand'>FeastIT - Admin</span>
          </span>
        </div>

        <div className="center-box">
          <div className="background-box">
            <span>
              <p className='h1'>Welcome back!</p>
              <p className='h2'>Enter your credentials to access your account</p>
            </span>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Admin ID</label>
                <input
                  type="text"
                  id="email"
                  placeholder="email@feastit.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }}
                  
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
