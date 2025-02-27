import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem("unreadNotifications") || 0;
    setUnreadCount(parseInt(storedCount, 10));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCount = parseInt(localStorage.getItem("unreadNotifications") || "0", 10);
      setUnreadCount(updatedCount);
    };
  
    // Listen to both storage event & custom event
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("unreadCountUpdated", (e) => setUnreadCount(e.detail));
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("unreadCountUpdated", (e) => setUnreadCount(e.detail));
    };
  }, []);
  

  const handleNotificationClick = () => {
    navigate("/notifications");
    setUnreadCount(0);
    localStorage.setItem("unreadNotifications", 0);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 md:py-5 bg-white shadow-md h-16 md:h-20">
      <img className="w-[70px] sm:w-[90px] md:w-[110px] h-auto" src={assets.logo} alt="Logo" />
      <div className="flex items-center gap-4">
        <button onClick={handleNotificationClick} className="relative">
          <img 
            className="w-6 sm:w-8 md:w-10 h-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            src={assets.notification} 
            alt="Notifications" 
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
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
