import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, cartItems, currency, updatedQuantity, navigate, user } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [outOfStock, setOutOfStock] = useState(false); //  New state to track stock availability

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      let stockUnavailable = false; //  Track stock status

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const productData = products.find((product) => product._id === productId);

            if (productData) {
              tempData.push({
                _id: productId,
                size: size,
                quantity: cartItems[productId][size],
                stock: productData.productStock, //  Add stock data
              });

              //  Check if stock is less than required quantity
              if (productData.productStock < cartItems[productId][size]) {
                stockUnavailable = true;
              }
            }
          }
        }
      }

      setCartData(tempData);
      setOutOfStock(stockUnavailable); //  Set stock status
    }
  }, [cartItems, products]);

  //  Check if the cart is empty
  const isCartEmpty = cartData.length === 0;

  const handleCheckout = () => {
    if (!user) {
      toast.warning("Login First to purchase product");
      return;
    }
    navigate("/placeorder");
  };

  return (
    <div className="border-t pt-14">
      <div className="text-4xl mb-3">
        <Title text1={"Your "} text2={" CART"} />
      </div>
      
      {/* ============ Displaying Cart Items ========== */}
      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={productData.image[0]} alt="" />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                  </div>
                  {/*  Show "Out of Stock" if product stock is 0 */}
                  {productData.productStock < item.quantity && (
                    <p className="text-red-500 text-sm">Out of Stock</p>
                  )}
                </div>
              </div>
              
              {/* Quantity Input */}
              <input
                type="number"
                min={1}
                max={productData.productStock} //  Prevents selecting quantity above stock
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Number(e.target.value);
                  if (newQuantity >= 1 && newQuantity <= productData.productStock) {
                    updatedQuantity(item._id, item.size, newQuantity);
                  }
                }}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              />

              {/* Remove / bin product icon */}
              <img
                onClick={() => updatedQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
        </div>

        {/* =========== Proceed to Checkout Button =========== */}
        <div className="w-full text-end">
          <button
            onClick={handleCheckout}
            className={`bg-black text-white text-sm my-8 px-8 py-3 transition-all duration-200 ${
              isCartEmpty || outOfStock
                ? "opacity-50 cursor-not-allowed hover:bg-black"
                : "hover:bg-gray-800"
            }`}
            disabled={isCartEmpty || outOfStock} //  Disable when out of stock
          >
            {outOfStock ? "Out of Stock" : "Proceed To Checkout"} {/* Button text change */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
