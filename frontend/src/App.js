import React from "react";
import { LoginForm } from "./Components/Security/Loginform";
import  RegistrationForm  from "./Components/Registration/Registrationform";
import  Home  from "./Components/Dashboard/Home/Home";
import  Account  from "./Components/Dashboard/Account/Account";
import { Route, Routes } from "react-router-dom";
import { LayoutWithNavbar, LayoutWithoutNavbar } from './Layout';

import PrivateRoute from "./Components/PrivateRoute"; // Importuj strażnika autoryzacji
import "./App.css";
import "./Components/styles/style.css";
import "./Components/styles/warranties.css";
import "./Components/styles/account.css";
import Warranties from "./Components/Warranties/Warranties";
import WarrantiesContainer from './Components/Warranties/WarrantiesContainer'
import { RequireAuth } from "react-auth-kit";

function App() {
  return (
    <>
        <Routes>
        <Route path="/" element={<RequireAuth loginPath="/loginform"><LayoutWithNavbar><Home /></LayoutWithNavbar></RequireAuth>} />
        <Route path="/account" element={<PrivateRoute><LayoutWithNavbar><Account /></LayoutWithNavbar></PrivateRoute>} />
        <Route path="/warranties" element={<PrivateRoute><LayoutWithNavbar><WarrantiesContainer /></LayoutWithNavbar></PrivateRoute>} />

        {/* Trasy używające LayoutWithoutNavbar */}
        <Route path="/loginform" element={<LayoutWithoutNavbar><LoginForm /></LayoutWithoutNavbar>} />
        <Route path="/signinform" element={<LayoutWithoutNavbar><RegistrationForm /></LayoutWithoutNavbar>} />
        </Routes>
    </>
  );
}

export default App;