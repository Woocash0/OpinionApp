import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import { LoginForm } from "./Components/Security/Loginform";
import  RegistrationForm  from "./Components/Registration/Registrationform";
import  Home  from "./Components/Dashboard/Home/Home";
import  Account  from "./Components/Dashboard/Account/Account";
import { LayoutWithNavbar, LayoutWithoutNavbar } from './Layout';
import "./App.css";
import "./Components/styles/style.css";
import "./Components/styles/warranties.css";
import "./Components/styles/account.css";
import WarrantiesContainer from './Components/Warranties/WarrantiesContainer'
import AddProduct from './Components/Dashboard/Home/AddProduct'


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><Home /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/account" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><Account /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/warranties" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><WarrantiesContainer /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/add_product" element={<RequireAuth loginPath="/add_product"><LayoutWithNavbar><AddProduct /></LayoutWithNavbar></RequireAuth>} />

    {/* Trasy używające LayoutWithoutNavbar */}
      <Route path="/loginform" element={<LayoutWithoutNavbar><LoginForm /></LayoutWithoutNavbar>} />
      <Route path="/signinform" element={<LayoutWithoutNavbar><RegistrationForm /></LayoutWithoutNavbar>} />
    </Routes>
    </>
  )
}

export default App;
