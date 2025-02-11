import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'About '} text2={'Us'} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="About Us"
        />
        <div>
          <p>
            Welcome to e-com Website, your one-stop destination for all things
            in fashion. We are committed to bringing you a seamless shopping
            experience, combining quality, convenience, and affordability.
          </p>
          <p>
            Founded in 2020 with a vision to transform online shopping,
            E-com-website has grown into a trusted platform that caters to
            millions of customers across the globe. From our carefully curated
            product selections to our top-notch customer service, everything we
            do revolves around making your shopping journey as enjoyable as
            possible.
          </p>
          <p>
            Our mission is to connect people with the products they love, all
            while embracing innovation and sustainability. We source items
            directly from reputable manufacturers and artisans, ensuring that
            every purchase you make supports a broader ecosystem of ethical
            practices and community development.
          </p>
          <p>
            Thank you for choosing Our e-com-website. We're more than just a
            store – we're your partner in discovering, creating, and living the
            life you’ve always envisioned.
          </p>

          <div className="mt-8">
            <b className="text-gray-800 text-lg">Our Mission</b>
          </div>
          <ul className="list-disc pl-6 mt-4">
            <li>
              <b>Offering Unmatched Quality:</b> We carefully curate our
              products to ensure that every item meets the highest standards of
              quality and craftsmanship.
            </li>
            <li>
              <b>Ensuring Affordability:</b> We believe that great products
              should be accessible to everyone, which is why we strive to offer
              competitive prices without compromising on value.
            </li>
            <li>
              <b>Providing Exceptional Service:</b> Your satisfaction is our top
              priority. From quick and reliable deliveries to responsive
              customer support, we’re here to make your shopping journey
              seamless and enjoyable.
            </li>
            <li>
              <b>Building Trust and Transparency:</b> We aim to foster long-term
              relationships with our customers by maintaining honest and
              transparent business practices.
            </li>
          </ul>
        </div>
      </div>

          <div className='text-xl py-4'>
            <Title text1={'Why '} text2={'Us'}/>
          </div>

          <div className='flex flex-col md:flex-row text-sm mb-20'>

            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Quality Assurance</b>
                <p className='text-gray-600'>, quality is our top priority. We meticulously select and test every product to ensure it meets the highest standards of craftsmanship and durability.</p>
            </div>
            <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Convenience</b>
                <p className='text-gray-600'>We understand the value of your time, which is why we’ve designed a platform that makes shopping easy and hassle-free. From intuitive navigation and a user-friendly interface to secure payment options and fast delivery, everything is built around your convenience.</p>
            </div><div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Exceptional Customer Service</b>
                <p className='text-gray-600'>Your happiness is at the heart of everything we do. Our dedicated customer service team is here to assist you at every step, ensuring your questions are answered promptly and your concerns are addressed effectively. </p>
            </div>

          </div>

          <NewsletterBox />
    </div>
  );
};

export default About;
