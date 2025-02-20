import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className="w-[70%] sm:w-[50%] md:w-[18%] min-h-screen border-r bg-gray-50 flex flex-col items-center md:items-start p-4 transition-all duration-300">
      <div className="flex flex-col gap-4 w-full">
        
        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 w-full"
          to="/add"
        >
          <img className="w-6 h-6" src={assets.add_icon} alt="Add" />
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">Add items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 w-full"
          to="/list"
        >
          <img className="w-6 h-6" src={assets.order_icon} alt="List" />
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">List items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 w-full"
          to="/orders"
        >
          <img className="w-6 h-6" src={assets.order_icon} alt="Orders" />
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">Orders</p>
        </NavLink>
        
      </div>
    </div>
  );
};

export default Sidebar;
