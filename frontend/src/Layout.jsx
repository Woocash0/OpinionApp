import React from 'react';
import Navbar from './Components/Dashboard/Navigation/Navbar';

// Układ z navbar
const LayoutWithNavbar = ({ children }) => (
    <>
        <div className="base-container">
            <Navbar />
            <main>{children}</main>
        </div>
    </>
);

// Układ bez navbar
const LayoutWithoutNavbar = ({ children }) => (
    <>
        {children}
    </>
    

);

export { LayoutWithNavbar, LayoutWithoutNavbar };
