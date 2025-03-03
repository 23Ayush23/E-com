import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="w-full bg-[#212529] text-sm text-white">
      <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14">
        {/* Description */}
        <div>
          <h1 className="text-white font-bold text-3xl mb-3">
            BLACK WHITE Clothing Store
          </h1>
          <p className="w-full md:w-2/3 text-gray-300">
            Elevate your shopping experience with our high-quality products and seamless service.
          </p>
        </div>

        {/* Company Section */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-bold">Company</p>
          <ul className="flex flex-col gap-2 text-gray-300">
            <Link to='/' className="font-semibold hover:text-white transition w-max">Home</Link> 
            <Link to='/about' className="font-semibold hover:text-white transition w-max">About Us</Link>  
            <Link to='/delivery-policy' className="font-semibold hover:text-white transition w-max">Delivery</Link>
            <Link to='/privacy-policy' className="font-semibold hover:text-white transition w-max">Privacy Policy</Link>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-bold">Get in touch</p>
          <ul className="flex flex-col gap-2 text-gray-300">
            <li className="font-semibold">+91 6354089000</li>
            <li className="font-semibold">ayushdpatel2372003@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full">
        <hr className="border-gray-600" />
        <p className="py-5 text-sm text-center text-gray-300">
          Copyright 2025 © E-com.com - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
