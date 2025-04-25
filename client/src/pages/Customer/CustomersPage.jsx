import React, { useState, useEffect } from "react";
import "../../assets/css/Main.css";
import "../../assets/css/CustomersPage.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 5;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchCustomers = async (page = 1) => {
    try {
      const response = await axios.get("/customers", {
        params: { page, limit }
      });
      setCustomers(response.data.customers);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customers/${id}`);
      setCustomers(customers.filter(customer => customer.customer_id !== id));
      alert("Customer successfully removed");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const customerID = customer.customer_id.toString();
    return (
      customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerID.includes(searchTerm)
    );
  });

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        <div className={`content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <h2>Customer Profile Management</h2>

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

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>
                      <button
                        onClick={() => navigate(`/customerDetails/${customer.customer_id}`, { state: { customer } })}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {customer.customer_id}
                      </button>
                    </td>
                    <td>{customer.customer_name}</td>
                    <td>{customer.customer_phone}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(currentPage - 1)}
            onNext={() => setCurrentPage(currentPage + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
