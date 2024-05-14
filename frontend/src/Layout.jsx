import React from 'react';
import Navbar from './Components/Dashboard/Navigation/Navbar';
import Notification from './Components/Dashboard/Notification';

// Układ z navbar
const LayoutWithNavbar = ({ children }) => (
    <>
        <div className="base-container">
            <Navbar />
            <main>{children}</main>
        </div>
        <Notification/>
    </>
);

// Układ bez navbar
const LayoutWithoutNavbar = ({ children }) => (
    <>
        {children}
    </>
    

);

export { LayoutWithNavbar, LayoutWithoutNavbar };
