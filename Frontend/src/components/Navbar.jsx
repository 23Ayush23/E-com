import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    userData,
    adminUrl,
    logoutUser,
  } = useContext(ShopContext);

  const location = useLocation(); // Get current route

  const logout = () => {
    logoutUser();
  };

  const handleAdminClick = () => {
    window.open(adminUrl, "_blank");
    navigate("/");
  };

  const userInitials = userData?.name
    ? userData.name.substring(0,1).toUpperCase()
    : "";
    // console.log(getCartCount());
    

  return (
    <div className="flex items-center justify-between py-3 px-4 lg:px-8 font-medium border-b border-gray-300">
      {/* Logo */}
      <Link to={"/"}>
        <div className="flex items-center">
          <img
            src={assets.logo}
            className="w-32 lg:w-40 h-auto object-contain"
            alt="Logo"
          />
        </div>
      </Link>

      {/* Navigation Links */}
      <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 hover:text-gray-900 ${
              isActive ? "text-gray-900 font-semibold  text-md shadow-lg" : ""
            }`
          }
        >
          <p>Home</p>
        </NavLink>
        <NavLink
          to="/collection"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 hover:text-gray-900 ${
              isActive ? "text-gray-900 font-semibold  text-md shadow-lg" : ""
            }`
          }
        >
          <p>Collection</p>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 hover:text-gray-900 ${
              isActive ? "text-gray-900 font-semibold  text-md shadow-lg" : ""
            }`
          }
        >
          <p>About</p>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 hover:text-gray-900 ${
              isActive ? "text-gray-900 font-semibold  text-md shadow-lg" : ""
            }`
          }
        >
          <p>Contact</p>
        </NavLink>
      </ul>

      {/* Icons and Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Icon - Visible only on Collection Page */}
        {location.pathname === "/collection" && (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer transition-transform hover:scale-110"
            alt="Search"
          />
        )}

        {/* Admin Button - Visible only if user exists */}
        {userInitials && (
          <button
            onClick={handleAdminClick}
            className="hidden sm:block px-3 py-1 rounded-lg bg-gray-400 text-white hover:bg-gray-900 transition-all text-sm"
          >
            Admin
          </button>
        )}

        {/* Profile Icon with Dropdown */}
        <div className="group relative">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer shadow-sm transition-all hover:bg-gray-400">
            {userInitials || (
              <img
                src={assets.profile_icon}
                className="w-6 h-6"
                alt="Profile"
              />
            )}
          </div>

          {/* Logged-in Dropdown */}
          {userInitials ? (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/order")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          ) : (
            // Logged-out Dropdown
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div
                className="w-28 py-2 px-4 bg-slate-100 text-gray-500 rounded text-center cursor-pointer hover:text-black"
                onClick={() => navigate("/login")}
              >
                Login
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative flex items-center justify-center">
          <img
            src={assets.cart_icon}
            className="w-6 h-6 min-w-6 transition-transform duration-200 hover:scale-110"
            alt="Cart"
          />
          {getCartCount() > 0 && (
            <p className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow-md">
              {getCartCount()}
            </p>
          )}
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white transition-all ${
          visible ? "w-64 sm:w-80" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p className="cursor-pointer">Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Contact
          </NavLink>

          {userInitials && (
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