// ProtectedLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const ProtectedLayout = ({ token, setToken }) => {
  // If no token exists, redirect to the login page ("/")
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar setToken={setToken} />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-500 text-base">
          {/* Nested routes will render here */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
