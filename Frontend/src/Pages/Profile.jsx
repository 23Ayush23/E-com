import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Dialog } from "@headlessui/react"

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [latestAddress, setLatestAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .post(`${backendUrl}/api/order/orderAddress`, {}, { headers: { token } })
      .then((response) => {
        if (response.data.success && response.data.address) {
          const addr = response.data.address;
          if (typeof addr === "object") {
            setLatestAddress({
              street: addr.street || "N/A",
              city: addr.city || "N/A",
              state: addr.state || "N/A",
              zipcode: addr.zipcode || "N/A",
              country: addr.country || "N/A",
              phone: addr.phone || "N/A",
            });
          } else {
            setLatestAddress({ formatted: addr.trim() });
          }
        } else {
          console.error("Error fetching address:", response.data.message);
        }
      })
      .catch((error) => console.error("API error:", error));
  }, [token]);

  const loadOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrders = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (order.status === "Delivered") {
              item.status = order.status;
              item.payment = order.payment;
              item.paymentMethod = order.paymentMethod;
              item.date = order.date;
              allOrders.push(item);
            }
          });
        });

        setOrderData(allOrders.reverse());
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) throw new Error("Unauthorized: No token found");

        const response = await axios.get(`${backendUrl}/api/user/getuserdata`, {
          headers: {
            "Content-Type": "application/json",
            token: storedToken,
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setUser(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendUrl]);

  const removeAccount = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/remove-account`,
        { userId: user._id },
        { headers: { token } }
      );
      
      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.setItem("isSubscribed","false")
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 lg:px-16 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
  <div className="space-y-2">
    <p className="text-gray-700">
      <span className="font-semibold">Name:</span> {user.name}
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">Email:</span> {user.email}
    </p>
    
    {latestAddress ? (
      <div className="text-gray-700 p-4 border rounded-lg bg-gray-50">
        <span className="font-semibold">Address:</span>
        <br />
        {latestAddress.formatted ? (
          <p>{latestAddress.formatted}</p>
        ) : (
          <>
            <p>{latestAddress.street}</p>
            <p>{latestAddress.city}, {latestAddress.state} - {latestAddress.zipcode}</p>
            <p>{latestAddress.country}</p>
            <p className="text-sm text-gray-500">Phone: {latestAddress.phone}</p>
          </>
        )}
      </div>
    ) : (
      <p className="text-gray-500">No address found</p>
    )}
    
    <button
      onClick={() => setIsModalOpen(true)}
      className="mt-6 w-full sm:w-1/3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Delete Account
    </button>
    
    {/* Confirmation Modal */}
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-lg font-bold">Confirm Deletion</h2>
        <p className="text-gray-600 mt-2">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={removeAccount} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</div>


      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Order History</h2>
        <div className="space-y-6">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row gap-6 p-6 border rounded-lg shadow-md"
            >
              <div className="flex items-start gap-4 w-full lg:w-2/3">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div>
                  <p className="text-lg font-medium">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <p>{currency}{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="text-sm text-gray-500">Date: {new Date(item.date).toDateString()}</p>
                  <p className="text-sm text-gray-500">Payment: {item.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center lg:w-1/3 justify-between lg:justify-end">
                <span
                  className={`w-3 h-3 rounded-full ${item.status === "Delivered" ? "bg-green-500" : "bg-yellow-400"}`}
                ></span>
                <p className="text-sm font-medium">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
