import React, { useContext, useState,useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const PlaceOrder = () => {
  // State for selecting button of payment method
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setcartItems,
    getCartAmount,
    delivery_fee,
    products,
    userData,
    getCartCount
  } = useContext(ShopContext);
  
  // Socket for notification
  const socket = io("http://localhost:2500");
  // State variable for form data that will update with inputs
  const [formData, setFormdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangehandler = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return; // Limit to 10 digits
    }

    setFormdata((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    getCartCount();  // Ensure cart count updates when `userData` changes
  }, [userData]);
  

  const onSubmithandler = async (event) => {
    event.preventDefault();
  
    // Regular expression to allow only alphabets and spaces
    const alphabetRegex = /^[A-Za-z\s]+$/;
  
    // Validate fields
    if (!alphabetRegex.test(formData.firstname.trim())) {
      toast.error("First name should contain only letters.");
      return;
    }
    if (!alphabetRegex.test(formData.lastname.trim())) {
      toast.error("Last name should contain only letters.");
      return;
    }
    if (!alphabetRegex.test(formData.city.trim())) {
      toast.error("City should contain only letters.");
      return;
    }
    if (!alphabetRegex.test(formData.state.trim())) {
      toast.error("State should contain only letters.");
      return;
    }
    if (!alphabetRegex.test(formData.country.trim())) {
      toast.error("Country should contain only letters.");
      return;
    }
  
    // Validate phone number (10-digit check)
    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
  
    // Checking if the user is trying to pay without any items in the cart
    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty. Please add items to your cart before proceeding.");
      return;
    }
  
    try {
      let orderItems = [];
  
      // Loop through cartItems to construct orderItems
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === productId)
            );
  
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[productId][size];
              itemInfo.itemId = itemInfo._id;
              delete itemInfo._id;
              orderItems.push(itemInfo);
            }
          }
        }
      }
  
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        timestamp: new Date().toISOString(),
      };
  
      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
  
          if (response.data.success) {
            setcartItems({});
            navigate("/order");

            // Emit orderPlaced event to notify admin
            socket.emit("orderPlaced", {
              message: "A new order has been placed!",
              order: orderData
            });

          } else {
            toast.error(response.data?.error?.message || "Something went wrong");
          }
          break;
  
        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
  
          if (responseStripe.data.success) {
            setcartItems({})
            window.location.replace(responseStripe.data.session_url);

            // Emit orderPlaced event to notify admin
            socket.emit("orderPlaced", {
              message: "A new Stripe order has been placed!",
              order: orderData
          });
          
          } else {
            toast.error(responseStripe.data?.error?.message || "Something went wrong");
          }
          break;
  
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage);
      if (!error?.response) {
        console.error("Error response is undefined:", error);
      }
    }
  };
  
  

  return (
    <div>
      <form
        onSubmit={onSubmithandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* =============== Left Side User products =========== */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"User Delivery "} text2={"Information"} />
          </div>

          {/* ========= Input fields for user =========== */}
          <div className="flex gap-3">
            <input
              onChange={onChangehandler}
              name="firstname"
              value={formData.firstname}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="First Name"
              required
            />
            <input
              onChange={onChangehandler}
              name="lastname"
              value={formData.lastname}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Last Name"
              required
            />
          </div>

          <input
            onChange={onChangehandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            placeholder="Email address"
            required
          />
          <input
            onChange={onChangehandler}
            name="street"
            value={formData.street}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Street"
            required
          />

          <div className="flex gap-3">
            <input
              onChange={onChangehandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="City"
              required
            />
            <input
              onChange={onChangehandler}
              name="state"
              value={formData.state}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="State"
              required
            />
          </div>

          <div className="flex gap-3">
            <input
              onChange={onChangehandler}
              name="zipcode"
              value={formData.zipcode}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Zipcode"
              required
            />
            <input
              onChange={onChangehandler}
              name="country"
              value={formData.country}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Country"
              required
            />
          </div>

          <input
  onChange={onChangehandler}
  name="phone"
  value={formData.phone}
  className="border border-gray-300 rounded py-1.5 px-3.5 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
  type="number" 
  placeholder="Contact Number"
  maxLength="10" // Ensure max length is 10
  required
/>

        </div>

        {/* ========== Cart Total =========== */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1={"Payment "} text2={"Method"} />

            {/* ============ Payment method ================ */}
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "stripe" ? "bg-green-500" : ""
                  }`}
                ></p>
                <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
              </div>

              <div
                onClick={() => setMethod("cod")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "cod" ? "bg-green-500" : ""
                  }`}
                ></p>
                <p className="text-gray-500 text-sm font-medium mx-4">
                  Cash on Delivery
                </p>
              </div>
            </div>

            {/* ========== Button: "place order" ========== */}
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className={`bg-black text-white px-16 py-3 text-sm ${
                  Object.keys(cartItems).length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={Object.keys(cartItems).length === 0}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
