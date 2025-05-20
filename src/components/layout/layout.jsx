// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />    {/* renders matching child route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
