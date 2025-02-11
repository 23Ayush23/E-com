import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

    //Accesing products from shopContext
    const {products} = useContext(ShopContext)
    const[bestSeller,setBestseller]=useState([])

    // Whenevr Products updated Use Effect will work
    useEffect(()=>{
        if (products && Array.isArray(products)) {

        const BestSellerProducts=products.filter((item)=>(item.bestseller))
        setBestseller(BestSellerProducts.slice(0,5))
        }
    },[products])
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'Best'} text2={'Sellers'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur.
            </p>

            {/* Product Items of BestSellers */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
           bestSeller.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
           ))
             } 
                </div>
        </div>
    </div>
  )
}

export default BestSeller