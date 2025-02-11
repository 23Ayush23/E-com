import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-gray-700'>
        <div>
            <img className='w-12 m-auto mb-5'src={assets.exchange_icon} alt="" />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hassle Free Exchange policy </p>
        </div>

        <div>
            <img className='w-12 m-auto mb-5'src={assets.quality_icon} alt="" />
            <p className='font-semibold'>1 week return Policy</p>
            <p className='text-gray-400'>We offer 1 week Free Exchange policy </p>
        </div>
    
        <div>
            <img className='w-12 m-auto mb-5'src={assets.support_img} alt="" />
            <p className='font-semibold'>Best customer support</p>
            <p className='text-gray-400'>We Provide 24/7 Customer Support for our customer </p>
        </div>
    
    </div>
  )
}

export default OurPolicy