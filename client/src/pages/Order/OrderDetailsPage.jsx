import React, { useEffect, useState } from 'react';
import { MapPin, Phone, ArrowLeft } from 'lucide-react';
import '../../assets/css/OrderDetailsPage.css';
import '../../assets/css/Main.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [order, setOrder] = useState(state?.order || null);
    const [items, setItems] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, itemsRes] = await Promise.all([
                    !order ? axios.get(`/orders/${orderId}`) : Promise.resolve({ data: order }),
                    axios.get(`/orders/${orderId}/items`)
                ]);

                const orderData = orderRes.data;
                setOrder(orderData);
                setItems(itemsRes.data);

                const vendorId = state?.vendor_id || orderData.vendor_id;
                const customerId = state?.customer_id || orderData.customer_id;

                const [vendorRes, customerRes] = await Promise.all([
                    axios.get(`/vendors/${vendorId}`),
                    axios.get(`/customers/${customerId}`)
                ]);

                setVendor(vendorRes.data);
                setCustomer(customerRes.data);
            } catch (error) {
                console.error("Error loading order details:", error);
            }
        };

        fetchData();
    }, [orderId, state, order]);

    if (!order || !vendor || !customer) return <p>Loading order details...</p>;

    return (
        <div className="main-container">
            <div className="top-header">
                <Header toggleSidebar={toggleSidebar} />
            </div>

            <div className="content-layout">
                {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

                <div className={`content ${isSidebarOpen ? 'compact' : 'expanded'}`}>
                    <div className="order-card">
                        <div className="order-header">
                            <div className="header-left">
                                <h2>Order #{order.order_id}</h2>
                                <p className="status-text">Status: <span className={`badge ${order.order_status}`}>{order.order_status}</span></p>
                            </div>
                            <button className="back-button" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" /> Go Back
                            </button>
                        </div>

                        <div className="order-section">
                            <h4>Customer Details</h4>
                            <p><strong>Name:</strong> {customer.customer_name}</p>
                            <p><strong>ID:</strong> {customer.customer_id}</p>
                            <p><strong>Email:</strong> {customer.customer_email}</p>
                        </div>

                        <div className="order-section">
                            <h4>Vendor Details</h4>
                            <p><strong>Name:</strong> {vendor.business_name}</p>
                            <p><strong>ID:</strong> {vendor.vendor_id}</p>
                            <p><strong>Email:</strong> {vendor.vendor_email}</p>
                        </div>

                        <div className="order-section">
                            <h4>Order Items</h4>
                            {items.length === 0 ? <p>No items found.</p> : (
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item ID</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Offer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.order_item_id}>
                                                <td>{item.item_id}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.item_price.toFixed(2)}</td>
                                                <td>{item.has_offer ? 'Yes' : 'No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="order-section">
                            <h4>Order Summary</h4>
                            <p><strong>Total:</strong> ${order.total_amount.toFixed(2)}</p>
                            <p><strong>Placed At:</strong> {new Date(order.order_date).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
