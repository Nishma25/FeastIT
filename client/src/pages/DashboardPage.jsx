import { React, useState } from 'react';
import '../assets/css/DashboardPage.css'; // Import the CSS file
import '../assets/css/Main.css'; 
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
 

function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar State
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle Sidebar 
  };

  return (
    <div className="main-container">
      {/* Top Mini Container (Header) */}
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div className="content-layout">
        {/* Sidebar */}
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        {/* Main Content */}
        <div className={`content ${isSidebarOpen ? "compact" : "expanded"}`}>
          {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

          <h2>Customer Activity & Vendor Performance</h2>


          <div className="data-container">

            {/* Left Data Section */}
            <div className="data-section">
              <div className="data-card">
                <div className="data-label">Total Number of Customers</div>
                <div className="data-value">645</div>
              </div>
              <div className="data-card">
                <div className="data-label">Total Number of Orders Received</div>
                <div className="data-value">98</div>
              </div>
              <div className="data-card">
                <div className="data-label">Average Order Value</div>
                <div className="data-value">$17.44</div>
              </div>
              <div className="data-card">
                <div className="data-label">Average Customer Rating</div>
                <div className="data-value">3.9</div>
              </div>
            </div>

            {/* Right Data Section */}
            <div className="data-section">
              <div className="data-card">
                <div className="data-label">Total Number of Vendors</div>
                <div className="data-value">459</div>
              </div>
              <div className="data-card">
                <div className="data-label">Total Sales & Revenue</div>
                <div className="data-value">$323,000</div>
              </div>
              <div className="data-card">
                <div className="data-label">Avg Customer Feedback Score</div>
                <div className="data-value">3.7</div>
              </div>
              <div className="data-card">
                <div className="data-label">Popular Menu Item</div>
                <div className="data-value">pizza</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

  );
}

export default DashboardPage;
