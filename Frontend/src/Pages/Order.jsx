import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  // Load user order data
  const loadOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });

      if (response.data.success) {
        let allOrderItems = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrderItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        // Filter non-delivered orders and reverse the order list
        const filteredOrders = allOrderItems.filter(item => item.status !== "Delivered");
        setOrderData(filteredOrders.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 px-4 md:px-8 lg:px-16">
      <div className="text-2xl mb-6">
        <Title text1={'My '} text2={'Orders'} />
      </div>

      <div className="space-y-6">
        {orderData.map((item, index) => (
          <div key={index} className="py-6 border-t border-b flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Left: Product Image & Details */}
            <div className="flex items-start gap-4 w-full">
              <img src={item.image[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
              <div className="flex-1">
                <p className="text-base sm:text-lg font-medium">{item.name}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <p>{currency}{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="text-sm text-gray-500">Date: <span>{new Date(item.date).toDateString()}</span></p>
                <p className="text-sm text-gray-500">Payment: <span>{item.paymentMethod}</span></p>
              </div>
            </div>

            {/* Right: Status & Track Order */}
            <div className="flex flex-col md:flex-row md:items-center md:w-1/2 md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.status === "Delivered" ? "bg-green-500" : "bg-yellow-400"}`}></span>
                <p className="text-sm md:text-base font-medium">{item.status}</p>
              </div>
              <button onClick={loadOrderData} className="border px-5 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
