import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import '../../assets/css/VendorDetailPage.css';
import '../../assets/css/Main.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MessagePopup from '../../components/MessagePopup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VendorDetailPage = () => {
  const { vendorId } = useParams();
  const { state } = useLocation();
  const [vendor, setVendor] = useState(state?.vendor || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [popup, setPopup] = useState({
    visible: false,
    type: 'warning',
    message: '',
  });
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const showPopup = (message, type = 'info') => {
    setPopup({ visible: true, type, message });
  };

  useEffect(() => {
    if (!vendor) {
      axios
        .get(`/vendors/${vendorId}`)
        .then((res) => setVendor(res.data))
        .catch((err) => console.error('Error fetching vendor:', err));
    }
  }, [vendor, vendorId]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'rejected' && !rejectionMessage.trim()) {
      showPopup('Please enter a reason before rejecting.', 'warning');
      return;
    }
    try {
      await axios.post('/vendor/update_status', {
        id: vendor.vendor_id,
        status: newStatus,
        rejectionMessage: newStatus === 'rejected' ? rejectionMessage : null,
      });
      showPopup(`Status updated to '${newStatus}'`, 'success');
      setTimeout(() => navigate(`/vendors?status=${newStatus}`), 2000);
    } catch (error) {
      console.error('Error updating status:', error);
      showPopup('Update failed. Try again.', 'error');
    }
  };

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div className="content-layout">
        {isSidebarOpen && (
          <div className="sidebar-container">
            <Sidebar />
          </div>
        )}
        <div className={`content ${isSidebarOpen ? 'compact' : 'expanded'}`}>
          <div className="vendor-card">
            <div className="vendor-header">
              <div>
                <h2>{vendor.business_name}</h2>
                <p className="status-text">
                  Status:{' '}
                  <span className={`badge ${vendor.vendor_status}`}>
                    {vendor.vendor_status}
                  </span>
                </p>
              </div>
              <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2" /> Back
              </button>
            </div>

            <div className="vendor-section">
              <h4>General Information</h4>
              <p>
                <strong>Vendor ID:</strong> {vendor.vendor_id}
              </p>
              <p>
                <strong>Vendor Name:</strong> {vendor.vendor_name}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {vendor.vendor_description || 'N/A'}
              </p>
              <p>
                <strong>Tax ID:</strong> {vendor.vendor_taxId || 'N/A'}
              </p>
            </div>

            <div className="vendor-section">
              <h4>Contact Information</h4>
              <p>
                <MapPin size={16} /> {vendor.vendor_address}
              </p>
              <p>
                <Clock size={16} />{' '}
                {vendor.business_hours || 'Business hours not available'}
              </p>
              <p>
                <Phone size={16} /> {vendor.vendor_phone}
              </p>
              <p>
                <Mail size={16} /> {vendor.vendor_email}
              </p>
            </div>

            <div className="vendor-section">
              {vendor.vendor_rejectedmessage && (
                <p>
                  <strong>Rejection Reason:</strong>{' '}
                  {vendor.vendor_rejectedmessage}
                </p>
              )}
            </div>

            {vendor.vendor_status !== 'rejected' && (
              <div className="vendor-actions">
                <textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  required
                ></textarea>
                <div className="action-buttons">
                  {vendor.vendor_status === 'pending' && (
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange('approved')}
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                  )}
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusChange('rejected')}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
          <MessagePopup
            visible={popup.visible}
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ ...popup, visible: false })}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
