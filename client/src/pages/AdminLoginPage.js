import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/AdminLoginPage.css"; 
import logo from "../assets/images/logo.png"



function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for success/error messages

  const navigate = useNavigate();
  const handleNavigateToDashboard = () => {
    if (message == "Login successful") {
      navigate('/dashboard');
    }

  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/adminLogin', {
        email: email,
        password: password
      });
      if (response.ok) {
        setMessage(response.data.message);  // "Login successful"
        handleNavigateToDashboard();
        // Handle successful login (e.g., set user state, redirect)
      } else {
        setMessage(response.data.message);  // "Invalid credentials"
        // Handle login failure (e.g., show error message)
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(error.response.data.message);  // This should set "Invalid credentials"
        console.log("Login failed:", error.response.data);
      } else if (error.request) {
        setMessage('No response from server');
        console.log("No response:", error.request);
      } else {
        setMessage('Error setting up the request');
        console.log("Error:", error.message);
      }
    }

  }

return (
  <div>
    <div className="login-container">
      <div className="orange-line">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Description" style={{ margin: "10px", marginRight: '20px', marginLeft: '20px' }} />
          <span className='brand'>Feast-IT</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="background-box">
          <span>
            <p className='h1'>Welcome back!</p>
            <p className='h2'>Enter your Credentials to access your account</p>
          </span>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Admin ID</label>
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
              <Link to="/forgotPassword" className="link">forgot password?</Link>
            </div>
            <button type="submit" onClick={handleNavigateToDashboard} >Login</button>
            <div className='signup-link'>
              Don't have an account?
              <Link to="/signUp" className="link"> Sign Up</Link>
            </div>
          </form>
          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    </div>

  </div>
);
}


export default AdminLoginPage;
