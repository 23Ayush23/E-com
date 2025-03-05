import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProduct = ({category, subCategory}) => {

    const { products } = useContext(ShopContext)
    const [related, setRelated] = useState([])
    const navigate = useNavigate() // Initialize the navigate function from react-router-dom

    useEffect(() => {

        if (products.length > 0) {
            let allProducts = products.slice()

            allProducts = allProducts.filter((item) => item.category === category)
            allProducts = allProducts.filter((item) => item.subCategory === subCategory)

            setRelated(allProducts.slice(0, 5))
        }
    }, [products, category, subCategory])

    // Function to navigate to the product details page
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`) // Navigate to the product detail page
    }

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'Related'} text2={'Products'} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    related.map((item, index) => (
                        <div key={index} onClick={() => handleProductClick(item._id)} className="cursor-pointer">
                            <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RelatedProduct
