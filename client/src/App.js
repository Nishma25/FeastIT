import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminSignUpPage from "./pages/Admin/AdminSignUpPage";
import DashboardPage from "./pages/DashboardPage";
import VendorsPage from "./pages/Vendor/VendorsPage";
import CustomersPage from "./pages/Customer/CustomersPage";
import OrderDetailsPage from "./pages/Order/OrderDetailsPage";
import OrdersPage from "./pages/Order/OrdersPage";
import VendorDetailPage from "./pages/Vendor/VendorDetailPage";
import CustomerDetailsPage from "./pages/Customer/CustomerDetailsPage";
import PrivateRoute from "./components/PrivateRoute"; // ✅ Use this version

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/adminLogin" element={<AdminLoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/adminSignUp" element={<AdminSignUpPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/vendors" element={<PrivateRoute><VendorsPage /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/orderDetails/:orderId" element={<PrivateRoute><OrderDetailsPage /></PrivateRoute>} />
        <Route path="/vendorDetail/:vendorId" element={<PrivateRoute><VendorDetailPage /></PrivateRoute>} />
        <Route path="/customerDetails/:customerID" element={<PrivateRoute><CustomerDetailsPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
