import { React} from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import AdminLoginPage from "./pages/AdminLoginPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage"
import VendorsPage from "./pages/VendorsPage"
import CustomersPage from "./pages/CustomersPage"



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path ="/adminLogin" element = {<AdminLoginPage/>}/>
      <Route path ="/dashboard" element = {<DashboardPage/>}/>
      <Route path ="/forgotPassword" element = {<ForgotPasswordPage/>}/>
      <Route path ="/signUp" element = {<SignUpPage/>}/>
      <Route path ="/vendors" element = {<VendorsPage/>}/>
      <Route path ="/customers" element = {<CustomersPage/>}/>
      
    </Routes>
    </BrowserRouter>

   )
}

export default App