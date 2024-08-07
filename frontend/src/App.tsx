import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";


import { LoginForm } from "./Components/Security/Loginform";
import  Unauthorized  from "./Components/Security/Unauthorized";
import  RegistrationForm  from "./Components/Registration/Registrationform";
import  Home  from "./Components/Dashboard/Home/Home";
import  Account  from "./Components/Dashboard/Account/Account";
import  WarrantiesContainer from './Components/Warranties/WarrantiesContainer'
import  AddProduct from './Components/Dashboard/Home/AddProduct'
import  AddWarranty from "./Components/Warranties/AddWarranty";
import  EditWarranty from "./Components/Warranties/EditWarranty";
import { LayoutWithNavbar, LayoutWithoutNavbar } from './Layout';
import "./App.css";
import "./Components/styles/style.css";
import "./Components/styles/warranties.css";
import "./Components/styles/account.css";
import RoleProtectedRoute from './RoleProtectedRoute';
import InspectOpinionsPanel from './Components/Moderator/InspectOpinionsPanel';
import ApproveNewProducts from './Components/Moderator/ApproveNewProducts';

function App() {
  return (
    <>
    <Routes>
      <Route path="/account" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><Account /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/warranties" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><WarrantiesContainer /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/add_product" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><AddProduct /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/add_warranty" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><AddWarranty /></LayoutWithNavbar></RequireAuth>} />
      <Route path="/edit_warranty/:warrantyId" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><EditWarranty /></LayoutWithNavbar></RequireAuth>} />
      
      <Route path="/*" element={<LayoutWithNavbar><Home /></LayoutWithNavbar>} />

      <Route path="/loginform" element={<LayoutWithoutNavbar><LoginForm /></LayoutWithoutNavbar>} />
      <Route path="/signinform" element={<LayoutWithoutNavbar><RegistrationForm /></LayoutWithoutNavbar>} />

      <Route element={<RoleProtectedRoute roles={['ROLE_MODERATOR']} />}>
        <Route path="/inspect_opinions" element={<LayoutWithNavbar><InspectOpinionsPanel/></LayoutWithNavbar>} />
        <Route path="/approve_products" element={<LayoutWithNavbar><ApproveNewProducts/></LayoutWithNavbar>} />
      </Route>

      <Route path="/unauthorized" element={<LayoutWithNavbar><Unauthorized /></LayoutWithNavbar>} />
    </Routes>
    </>
  )
}

export default App;
