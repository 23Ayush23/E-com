import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className='bg-[#f4f4f6]'>
      {/* Title Section */}
      <div className="text-2xl text-center pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <Title text1={'About '} text2={'Us'} />
      </div>

      {/* About Content Section */}
      <div className="my-10 flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8">
        <img
          className="w-full md:max-w-[450px] rounded-lg shadow-md"
          src={assets.about_img}
          alt="About Us"
        />
        <div className="flex flex-col gap-6">
          <p className="text-gray-700 leading-relaxed">
            Welcome to e-com Website, your one-stop destination for all things
            in fashion. We are committed to bringing you a seamless shopping
            experience, combining quality, convenience, and affordability.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Founded in 2020 with a vision to transform online shopping,
            E-com-website has grown into a trusted platform that caters to
            millions of customers across the globe. From our carefully curated
            product selections to our top-notch customer service, everything we
            do revolves around making your shopping journey as enjoyable as
            possible.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to connect people with the products they love, all
            while embracing innovation and sustainability. We source items
            directly from reputable manufacturers and artisans, ensuring that
            every purchase you make supports a broader ecosystem of ethical
            practices and community development.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Thank you for choosing Our e-com-website. We're more than just a
            store – we're your partner in discovering, creating, and living the
            life you’ve always envisioned.
          </p>

          {/* Mission Section */}
          <div className="mt-8">
            <b className="text-gray-800 text-lg">Our Mission</b>
          </div>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li className="text-gray-700">
              <b>Offering Unmatched Quality:</b> We carefully curate our
              products to ensure that every item meets the highest standards of
              quality and craftsmanship.
            </li>
            <li className="text-gray-700">
              <b>Ensuring Affordability:</b> We believe that great products
              should be accessible to everyone, which is why we strive to offer
              competitive prices without compromising on value.
            </li>
            <li className="text-gray-700">
              <b>Providing Exceptional Service:</b> Your satisfaction is our top
              priority. From quick and reliable deliveries to responsive
              customer support, we’re here to make your shopping journey
              seamless and enjoyable.
            </li>
            <li className="text-gray-700">
              <b>Building Trust and Transparency:</b> We aim to foster long-term
              relationships with our customers by maintaining honest and
              transparent business practices.
            </li>
          </ul>
        </div>
      </div>

      {/* Why Us Section */}
      <div className='text-xl text-center py-12 px-4 sm:px-6 lg:px-8'>
        <Title text1={'Why '} text2={'Us'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 px-4 sm:px-6 lg:px-8 gap-6'>
        <div className='border px-6 md:px-8 py-8 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className="text-gray-800">Quality Assurance</b>
          <p className='text-gray-600'>
            Quality is our top priority. We meticulously select and test every product to ensure it meets the highest standards of craftsmanship and durability.
          </p>
        </div>
        <div className='border px-6 md:px-8 py-8 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className="text-gray-800">Convenience</b>
          <p className='text-gray-600'>
            We understand the value of your time, which is why we’ve designed a platform that makes shopping easy and hassle-free. From intuitive navigation and a user-friendly interface to secure payment options and fast delivery, everything is built around your convenience.
          </p>
        </div>
        <div className='border px-6 md:px-8 py-8 flex flex-col gap-5 rounded-lg shadow-md bg-white'>
          <b className="text-gray-800">Exceptional Customer Service</b>
          <p className='text-gray-600'>
            Your happiness is at the heart of everything we do. Our dedicated customer service team is here to assist you at every step, ensuring your questions are answered promptly and your concerns are addressed effectively.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;