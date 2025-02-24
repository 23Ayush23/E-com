import React from 'react';
import { Link } from 'react-router-dom';
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
           <Link to='/'><li>Home</li></Link> 
          <Link to='/about'><li>About Us</li></Link>  
          <Link to='/delivery-policy'> <li>Delivery</li></Link>
           <Link to='/privacy-policy'> <li>Privacy Policy</li></Link>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-medium">Get in touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 6354089000</li>
            <li>ayush@gmail.com</li>
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
