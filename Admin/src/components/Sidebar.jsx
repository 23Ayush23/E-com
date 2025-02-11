import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className="w-full md:w-[18%] min-h-screen border-r bg-gray-50 flex flex-col items-center md:items-start">
      <div className="flex flex-col gap-4 pt-6 px-4 text-[15px] w-full">

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 transition duration-200 w-full"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="Add" />
          <p className="block">Add items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 transition duration-200 w-full"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="List" />
          <p className="block">List items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 transition duration-200 w-full"
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Orders" />
          <p className="block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
