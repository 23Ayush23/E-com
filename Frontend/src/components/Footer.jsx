import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="mt-40 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14">
        {/* Logo and Description */}
        <div>
          <img className="mb-5 w-32" src={assets.logo} alt="Logo" />
          <p className="w-full md:w-2/3 text-gray-600">

          </p>
        </div>

        {/* Company Section */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-medium">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-medium">Get in touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 6354089***</li>
            <li>ayu****@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
            Copyright 2025@ E-com.com - ALL Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
