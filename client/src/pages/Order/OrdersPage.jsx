import React, { useState, useEffect } from "react";
import { FaSearch, FaAngleDown, FaAngleUp } from "react-icons/fa";
import "../../assets/css/Main.css";
import "../../assets/css/OrdersPage.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status") || "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredOrders = orders.filter(order => {
    const customerID = order.customer_id.toString();
    const matchesSearch = customerID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || order.order_status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "preparing": return "status preparing";
      case "delivered": return "status delivered";
      case "pending": return "status pending";
      case "confirmed": return "status confirmed";
      case "cancelled": return "status rejected";
      default: return "status";
    }
  };

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        <div className={`content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <h2>Active Orders</h2>

          <div className="search-status-container">
            <div className="custom-select">
              <div className="select-wrapper">
                <select
                  className="custom-dropdown"
                  value={selectedStatus}
                  onChange={(e) => setSearchParams({ status: e.target.value })}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setIsOpen(false)}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {isOpen ? (
                  <FaAngleUp className="dropdown-icon" />
                ) : (
                  <FaAngleDown className="dropdown-icon" />
                )}
              </div>
            </div>

            <div className="flex search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search customers by id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Vendor ID</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.customer_id}>
                    <td>
                      <button
                        onClick={() => navigate(`/orderDetails/${order.order_id}`, {
                          state: {
                            order,
                            customer_id: order.customer_id,
                            vendor_id: order.vendor_id
                          }
                        })}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {order.order_id}
                      </button>
                    </td>
                    <td>{order.customer_id}</td>
                    <td>{order.vendor_id}</td>
                    <td className={getStatusClass(order.order_status)}>{order.order_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
