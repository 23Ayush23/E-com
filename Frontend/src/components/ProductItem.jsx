import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id,name,image,price,productStock}) => {
  
    //Accessing currency from shopContext
    const {currency} = useContext(ShopContext)
  
    return (

    //Anyone select item will redirect to perticular id product page    
    <Link className='text-gray-800 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='w-full h-80 hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
        {/* <p className='text-sm font-medium'>Product Stock:  {productStock}</p> */}
    </Link>
  )
}

export default ProductItem