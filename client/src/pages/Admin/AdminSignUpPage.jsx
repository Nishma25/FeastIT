import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../assets/css/AdminLoginPage.css';
import MessagePopup from '../../components/MessagePopup'; 
import { CheckCircle } from 'lucide-react'; // ✅ Icon import
import logo from '../../assets/images/logo.png';

function AdminSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popup, setPopup] = useState({ visible: false, type: 'info', message: '' });
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false); // ✅ State for checkmark

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPopup({ visible: true, type: 'warning', message: 'Passwords do not match' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/adminSignup', {
        name,
        email,
        password
      });

      setPopup({ visible: true, type: 'success', message: response.data.message });

      if (response.status === 201) {
        setSuccessAnimation(true);
        setShowSuccessIcon(true);
        setTimeout(() => {
          navigate('/adminLogin');
        }, 2500); 
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred. Please try again.';
      setPopup({ visible: true, type: 'error', message: msg });
    }
  };

  return (
    <div className="login-container">
      <div className="orange-line">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ margin: '10px 20px' }} />
          <span className='brand'>FeastIT - Admin</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={`background-box ${successAnimation ? 'success-glow' : ''}`}>

          {/* ✅ Show Big Checkmark on success */}
          {showSuccessIcon && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={48} color="#22c55e" />
            </div>
          )}

          <p className='h1'>Create your account</p>
          <p className='h2'>Fill in the details below to get started</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                placeholder="FirstName and LastName"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="email@feast.com"
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
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Sign Up</button>

            <div className='signup-link'>
              Already have an account? <Link to="/adminLogin" className="link">Login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Popup */}
      <MessagePopup
        visible={popup.visible}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, visible: false })}
      />
    </div>
  );
}

export default AdminSignupPage;
