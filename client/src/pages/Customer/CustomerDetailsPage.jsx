import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import '../../assets/css/CustomerDetailPage.css';
import '../../assets/css/Main.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const { state } = useLocation();
    const [customer, setCustomer] = useState(state?.customer || null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (!customer) {
            axios.get(`/customers/${customerId}`)
                .then(res => setCustomer(res.data))
                .catch(err => console.error("Error fetching customer:", err));
        }
    }, [customer, customerId]);

    if (!customer) return <p>Loading customer details...</p>;

    return (
        <div className="main-container">
            <div className="top-header">
                <Header toggleSidebar={toggleSidebar} />
            </div>
            <div className="content-layout">
                {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}
                <div className={`content ${isSidebarOpen ? 'compact' : 'expanded'}`}>
                    <div className="vendor-card">
                        <div className="vendor-header">
                            <div>
                                <h2>{customer.customer_name}</h2>
                                <p className="status-text">Customer ID: <span className="badge approved">{customer.customer_id}</span></p>
                            </div>
                            <button className="back-button" onClick={() => navigate(-1)}>
                                <ArrowLeft className="mr-2" /> Back
                            </button>
                        </div>

                        <div className="vendor-section">
                            <h4>Contact Details</h4>
                            <p><Phone size={16} /> {customer.customer_phone || 'N/A'}</p>
                            <p><Mail size={16} /> {customer.customer_email}</p>
                        </div>

                        <div className="vendor-section">
                            <h4>Address</h4>
                            <p><MapPin size={16} /> {customer.customer_address || 'N/A'}</p>
                        </div>

                        <div className="vendor-section">
                            <h4>Registered On</h4>
                            <p>{customer.registration_date || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;