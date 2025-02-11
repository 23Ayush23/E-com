import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

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
  } = useContext(ShopContext);

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
    setFormdata((data) => ({ ...data, [name]: value }));
  };

  // Gathering razorpay order in one variable

  const initPay = (order) => {

    const options = {
      key: importScripts.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'order PAYMENT',
      description: 'order PAYMENT',
      order_id: order._id,
      receipt: order.receipt,
      hanfler: async (response) => {
        console.log(response);
        try {
          
          const {data} = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
          if(data.success)
          {
            navigate('/order')
            setcartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error)
          
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmithandler = async (event) => {
    event.preventDefault();

    // Checking if the user is trying to pay without any items in the cart
    const isCartEmpty = Object.keys(cartItems).length === 0;
    if (isCartEmpty) {
      toast.error(
        "Your cart is empty. Please add items to your cart before proceeding."
      );
      return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      console.log(orderData);

      switch (method) {
        case "cod":
          // API call for COD
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          console.log(response.data);

          if (response.data.success) {
            // Clean order cart
            setcartItems({});
            navigate("/order");
          } else {
            toast.error(
              response.data?.error?.message || "Something went wrong"
            );
          }
          break;

        case "stripe":
          // API call for Stripe
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          console.log(responseStripe.data);

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(
              responseStripe.data?.error?.message || "Something went wrong"
            );
          }
          break;

          case "razorpay":
            // API call for Razorpay
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          
          if(responseRazorpay.data.success)
          {
            initPay(responseRazorpay.data.order)
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      // Safely access error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);

      // If error.response is undefined, log the error to the console
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
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Contact Number"
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
                onClick={() => setMethod("razorpay")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "razorpay" ? "bg-green-500" : ""
                  }`}
                ></p>
                <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
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
