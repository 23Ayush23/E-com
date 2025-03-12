import React from 'react';
import Hero from '../components/Hero.jsx';
import LatestCollection from '../components/LatestCollection.jsx';
import BestSeller from '../components/BestSeller.jsx';
import OurPolicy from '../components/OurPolicy.jsx';
import NewsletterBox from '../components/NewsletterBox.jsx';

const Home = () => {
  return (
    <div className='bg-[#f4f4f6]'>
      <LatestCollection />
      <Hero />
      <BestSeller />
      <NewsletterBox />
      <OurPolicy />
    </div>
  );
};

export default Home;
