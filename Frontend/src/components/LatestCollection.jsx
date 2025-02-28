import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import { ShopContext } from '../context/ShopContext';

const LatestCollection = () => {
    // State for latest products
    const [latestProducts, setLatestProducts] = useState([]);
    const {backendUrl} = useContext(ShopContext)

    // Fetch latest products from backend
    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch(backendUrl + '/api/product/latest'); // Adjust API URL as needed
                const data = await response.json();

                if (response.ok) {
                    setLatestProducts(data.slice(0, 10)); // Get only the latest 10 products
                } else {
                    console.error('Failed to fetch latest products:', data.message);
                }
            } catch (error) {
                console.error('Error fetching latest products:', error);
            }
        };

        fetchLatestProducts();
    }, []);

    return (
        <div className='mb-2'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'Latest'} text2={'Collection'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Discover the freshest styles with our Latest Collection, 
                where fashion meets innovation! Whether you're looking for chic casuals, trendy streetwear,
                 elegant formals, or comfy athleisure, we’ve got something for every occasion
                </p>
            </div>

            {/* Rendering Products from ProductItem */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection;
