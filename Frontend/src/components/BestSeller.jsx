import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ShopContext } from "../context/ShopContext";

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([]);
    const { backendUrl } = useContext(ShopContext);

    // Fetch best-seller products from the backend
    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch(backendUrl + "/api/product/bestseller"); // Backend API endpoint
                if (!response.ok) throw new Error("Failed to fetch bestsellers");

                const products = await response.json();

                // Filter best sellers and get only the top 5
                const bestSellerProducts = products.filter((item) => item.bestseller);
                setBestSeller(bestSellerProducts.slice(0, 5));
            } catch (error) {
                console.error("Error fetching best sellers:", error);
            }
        };

        fetchBestSellers();
    }, [backendUrl]);

    return (
        <div className="mb-8 px-4 sm:px-6 lg:px-8"> {/* Added padding for responsiveness */}
            <div className="text-center py-8">
                <Title text1={"Best"} text2={"Sellers"} />
                <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Discover our Best Sellers, featuring the hottest and most in-demand fashion pieces loved by our customers!
                    From trendy outfits to timeless classics,
                    these top-rated styles are must-haves for every wardrobe.
                </p>
            </div>

            {/* Product Items of BestSellers */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {bestSeller.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;