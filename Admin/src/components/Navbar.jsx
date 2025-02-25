import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 md:py-5 bg-white shadow-md h-16 md:h-20">
      <img className="w-[70px] sm:w-[90px] md:w-[110px] h-auto" src={assets.logo} alt="Logo" />
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/notifications")}>
          <img className="w-6 sm:w-8 md:w-10 h-auto cursor-pointer" src={assets.notification} alt="Notifications" />
        </button>
        <button 
          onClick={() => setToken("")} 
          className="bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base cursor-pointer hover:bg-gray-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
