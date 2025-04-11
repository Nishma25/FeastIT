import React, { useState, useEffect } from "react";
import "../assets/css/Main.css";
import "../assets/css/CustomersPage.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";


function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/customers");
        setCustomers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customers/${id}`);
      setCustomers(customers.filter(customer => customer.id !== id));
      alert("Customer successfully removed");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const filteredCustomers = customers.filter(customer =>{
    const customerID = customer.customer_id.toString(); // Convert vendor_id to string to ensure compatibility
    return (customer.email.toLowerCase().includes(searchTerm.toLowerCase())) || customerID.toLowerCase().includes(searchTerm.toLowerCase())
  });

  return (
    <div className="main-container">
      {/* Top Header */}
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        <div className={`content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <h2>Customer Profile Management</h2>

          {/* Search Bar */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers by id or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Customer Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Edit / Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.customer_name}</td>
                    <td>{customer.email}</td>
                    <td>
                      <div className="flex flex-row space-x-0.5">
                        <button className="button flex items-center justify-center focus:outline-none">
                          <FaEdit size={20} />
                        </button>
                        <button className="button flex items-center justify-center focus:outline-none">
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
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

export default CustomersPage;