import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const Navbar = () => {
  // State variable for visibility of menu items
  const [visible, setVisible] = useState(false);

  // Context values
  const { setShowSearch, getCartCount, navigate, token, settoken, setcartItems } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem('token');
    settoken('');
    setcartItems({});
    navigate('/login');
  };

  const handleAdminClick = () => {
    window.open('http://localhost:5173/', '_blank'); // Open Admin Panel in a new tab
    navigate('/'); // Navigate current tab to Home
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 font-medium border-b border-gray-300">
      {/* Logo */}
      <Link to={'/'}>
        <div className="flex items-center">
          <img src={assets.logo} className="w-40 h-auto object-contain" alt="Logo" />
        </div>
      </Link>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-gray-900">
          <p>Home</p>
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-gray-900">
          <p>Collection</p>
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-gray-900">
          <p>About</p>
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-gray-900">
          <p>Contact</p>
        </NavLink>
      </ul>

      {/* Icons and Admin Button */}
      <div className="flex items-center gap-6">
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="Search" />

        {/* Admin Button - Only visible if token exists */}
        {token && (
          <button
            onClick={handleAdminClick}
            className="px-3 py-1 rounded-lg bg-gray-400 text-white hover:bg-gray-900 transition-all text-sm"
          >
            Admin
          </button>
        )}

        <div className="group relative">
          <img onClick={() => (token ? null : navigate('/login'))} src={assets.profile_icon} className="w-5 cursor-pointer" alt="Profile" />

          {/* Dropdown  only when logged in */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={()=> navigate('/profile')} className="cursor-pointer hover:text-black">My Profile</p>
                <p onClick={() => navigate('/order')} className="cursor-pointer hover:text-black">Orders</p>
                <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-blue-200 text-black-800 aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="Menu" />
      </div>

      {/* Sidebar menu for small screen sizes */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <p className="cursor-pointer">Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
            Home
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            Collection
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            About
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            Contact
          </NavLink>

          {/* Admin Button in Sidebar - Only visible if token exists */}
          {token && (
            <button
              onClick={() => {
                handleAdminClick();
                setVisible(false);
              }}
              className="py-2 pl-6 border bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
