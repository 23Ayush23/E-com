import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className="bg-[#f4f4f6] px-4 py-10">
      {/* Page Title */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'Contact '} text2={'Us'} />
      </div>

      {/* Contact Section */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-10 mb-28">
        {/* Image on the Left with Zoom Out Hover Effect */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            className="w-[300px] md:w-[450px] rounded-lg shadow-md transition-transform duration-500 hover:scale-95"
            src={assets.contact_img}
            alt="Contact Us"
          />
        </div>

        {/* Content on the Right */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 px-4 md:px-0">
          <p className="font-semibold text-xl text-gray-700">Our Store</p>
          <p className="text-gray-600">
            58952, near ST station
            <br />
            Surat, Gujarat
          </p>
          <p className="text-gray-600">
            Contact: (+91) 99874598520
            <br />
            Email: ayushdpatel2372003@gmail.com
          </p>

          <p className="font-semibold text-xl text-gray-700">Career</p>
          <p className="text-gray-600">Learn more about our team and Jobs</p>

          {/* Button with medium width on large screens and full width on small screens */}
          <button className="w-40 md:w-40 border border-black px-6 py-3 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-md">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default Contact;
