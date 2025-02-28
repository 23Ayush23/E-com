import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProduct from '../components/RelatedProduct';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/product/${relatedProductId}`);
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Please select a size before adding to cart.", { position: "bottom-right" });
      return;
    }
    addToCart(productData._id, size);
    toast.success("Product added to cart successfully!", { position: "bottom-right" });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Left Side: Images */}
        <div className='flex flex-1 flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-80%'>
            <img className='w-full h-[400px]' src={image} alt="" />

            {/* Out of Stock Message */}
            {productData.productStock === 0 && (
              <p className="text-red-500 font-semibold text-center mt-3">
                Sorry this product is out of stock
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-400 w-4/5'>{productData.description}</p>

          {/* Size Selection */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`border py-2 px-4 bg-gray-200 ${item === size ? 'border-blue-700' : ''}`} 
                  key={index}
                  disabled={productData.productStock === 0} // Disable size selection if out of stock
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart / Out of Stock Button */}
          {productData.productStock === 0 ? (
            <button className='bg-gray-400 text-white px-8 py-3 text-sm cursor-not-allowed'>
              Out of Stock
            </button>
          ) : (
            <button onClick={handleAddToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
              Add To Cart
            </button>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className='mt-10'>
        <RelatedProduct 
          category={productData.category} 
          subCategory={productData.subCategory} 
          onRelatedProductClick={handleRelatedProductClick} 
        />
      </div>
    </div>
  ) : <div className="opacity-0"></div>;
};

export default Product;
