import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [latestAddress, setLatestAddress] = useState(null); // Store a single latest address

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
            const formattedAddress = (
              `${(addr.street || "").trim()}, ` +
              `${(addr.city || "").trim()}, ` +
              `${(addr.state || "").trim()}, ` +
              `Zipcode: ${(addr.zipcode || "").trim()}, ` +
              `${(addr.country || "").trim()}, ` +
              `Phone: ${(addr.phone || "").trim()}`
            ).replace(/\s+/g, " ");
            setLatestAddress(formattedAddress);
          } else {
            setLatestAddress(addr.trim()); // If it's a plain string address
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
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {latestAddress}
            </p>
          ) : (
            <p className="text-gray-500">No address found</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          User Order History
        </h2>
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
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(item.date).toDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment: {item.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-center lg:w-1/3 justify-between lg:justify-end">
                <span
                  className={`w-3 h-3 rounded-full ${
                    item.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-yellow-400"
                  }`}
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
