import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className='bg-[#f4f4f6]'>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'Contact '} text2={'Us'} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-[300px] md:w-[400px] mx-auto md:mx-0"
          src={assets.contact_img}
          alt="Contact Us"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            58952, near ST station
            <br />
            Surat, Gujarat
          </p>
          <p className="text-gray-500">
            Contact: (+91) 99874598520
            <br />
            Email: xyz@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Career</p>
          <p className="text-gray-500">Learn more about our team and Jobs</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
