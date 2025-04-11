import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaAngleDown, FaAngleUp } from "react-icons/fa";
import "../assets/css/VendorsPage.css";
import '../assets/css/Main.css';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { XCircle, CheckCircle } from "lucide-react";

function VendorsPage() {

  const [isOpen, setIsOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");


  useEffect(() => {
    const fetchvendors = async () => {
      try {
        const response = await axios.get('/vendors',{params:{'status':selectedStatus}}); // Adjust the base URL if needed
        setVendors(response.data); // Save the response data to state
      } catch (error) {
        console.error('Error fetching pending vendors:', error);
      }
    };

    fetchvendors();
  }, [selectedStatus]); // Empty dependency array ensures this runs only once
  console.log(vendors)

  const filteredVendors = vendors.filter(vendor => {
    const vendorId = vendor.vendor_id.toString(); // Convert vendor_id to string to ensure compatibility
    return (
      (vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) || vendorId.includes(searchTerm)) &&
      (selectedStatus === "" || vendor.status === selectedStatus)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "approved": return "status approved";
      case "pending": return "status pending";
      case "rejected": return "status rejected";
      default: return "status";
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar State

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle Sidebar 

  };

  // Function to sort vendors by date
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order state
  const sortByDate = () => {
    const sortedVendors = [...vendors].sort((a, b) => {
      const dateA = new Date(a.applied_date);
      const dateB = new Date(b.applied_date);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setVendors(sortedVendors);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle order
  };

  const updateStatus = async (vendorId, newStatus) => {
    try {
      const response = await axios.post('/vendor/update_status', {
        id: vendorId,
        status: newStatus,
      });

      // Update local state after successful API update
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.vendor_id === vendorId ? { ...vendor, status: newStatus } : vendor
        )
      );

      alert(`Status updated to: ${newStatus}`);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to update status");
    }
  };



  return (
    <div className="main-container">
      {/* Top Mini Container (Header) */}
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Layout */}
      <div className="content-layout">

        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        {/* Order Management Content */}
        <div className={`content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <h2 >Vendor Profile Management</h2>

          {/* Search Bar */}
          <div className="search-status-container">
          <div className="custom-select">
              {/* <label className="block text-gray-700 font-semibold mb-2">Status:</label> */}

              <div className="select-wrapper">
                <select
                  className="custom-dropdown"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  onFocus={() => setIsOpen(true)}  // Opens dropdown
                  onBlur={() => setIsOpen(false)}  // Closes dropdown
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Icon for dropdown */}
                {isOpen ? (
                  <FaAngleUp className="dropdown-icon" />
                ) : (
                  <FaAngleDown className="dropdown-icon" />
                )}
              </div>
            </div>
            <div className=" flex search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search vendors using vendor_id or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>


          {/* Order Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Vendor Name</th>
                  <th>Vendor EmailID</th>
                  <th onClick={sortByDate} style={{ cursor: "pointer", }}>
                    Applied Date {sortOrder === "asc" ? <><FaFilter className="filter-icon" /> <span>↑</span> </> : <><FaFilter className="filter-icon" /> <span>↓</span> </>}
                  </th>
                  <th>
                    <div className="status-header">
                      Status
                      {/* This filter feature on status */}
                      {/* <FaFilter className="filter-icon" onClick={() => setShowFilter(!showFilter)} />
                      {showFilter && (
                        <div className="status-filter">
                          <button onClick={() => { setSelectedStatus(""); setShowFilter(false); }}>All</button>
                          <button onClick={() => { setSelectedStatus("approved"); setShowFilter(false); }}>Approved</button>
                          <button onClick={() => { setSelectedStatus("pending"); setShowFilter(false); }}>Pending</button>
                          <button onClick={() => { setSelectedStatus("rejected"); setShowFilter(false); }}>Rejeceted</button>
                        </div>
                      )} */}
                    </div>
                  </th>
                  <th>Approve / Reject</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, index) => (
                  <tr key={index}>
                    <td>{vendor.vendor_id}</td>
                    <td>{vendor.vendor_name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.applied_date}</td>
                    {/* <td>${order.unitPrice.toFixed(2)}</td>
                    <td>${(order.qty * order.unitPrice).toFixed(2)}</td> */}
                    <td className={getStatusClass(vendor.status)}>{vendor.status}</td>
                    <td>
                      {vendor.status === "pending" && (
                        <div className="flex flex-row space-x-0.5">
                          <button className="button-green flex items-center justify-center focus:outline-none" onClick={() => updateStatus(vendor.vendor_id, "approved")}>
                            <CheckCircle />
                          </button>
                          <button className="button-red flex items-center justify-center focus:outline-none" onClick={() => updateStatus(vendor.vendor_id, "rejected")}>
                            <XCircle />
                          </button>
                        </div>
                      )}
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

export default VendorsPage;
