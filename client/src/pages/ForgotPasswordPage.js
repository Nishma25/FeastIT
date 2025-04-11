
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/AdminLoginPage.css"; // You'll need to create this CSS file
import logo from "../assets/images/logo.png"
import doneLogo from "../assets/images/doneLogo.png"

function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log('Login attempted with:', username, password);
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="login-container">
      <div className="image-container">
      <div className="orange-line">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Description"
            style={{ margin: "10px",marginRight:'20px',marginLeft:'20px' }} />
          <span className='brand'> 
            Feast-IT
          </span>
        </span>
      </div>
      <div className='content-wrapper'>
      <div className="background-box">
        <span>
          <p className='h2'>Forgot Password?</p>
        </span>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">*Enter Email Address</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send OTP</button>
        </form>

        {/* <form onSubmit={handleSubmit} className="login-form" style={{alignItems:'center'}}>
          <div className="center-contents"></div>
          <img
            src={doneLogo}
            alt="Description"
            style={{ margin: "10px",marginRight:'20px',marginLeft:'20px', height:'100px',width:'100px' }} />

          <div>
          <span>
          <p className='h1'>Password Changed!</p>
          <p className='h2'>Your Password has been changed sucessfully</p>
          </span>
          </div>
          <button type="submit" onClick={() => navigate('/adminLogin')}>Back to Login</button>
        </form> */}


        </div>
        </div>
        </div>
      </div>
    </div>

  );
}


export default ForgotPasswordPage;
