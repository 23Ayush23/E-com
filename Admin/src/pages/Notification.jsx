import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import axios from 'axios';

const socket = io("http://localhost:2500");

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:2500/api/order/get-notification");
        if (response.data.success) {
          setNotifications(response.data.notifications);
          const unreadCount = response.data.notifications.length;
        localStorage.setItem("unreadNotifications", unreadCount);
        window.dispatchEvent(new CustomEvent("unreadCountUpdated", { detail: unreadCount }));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    socket.on("newOrderNotification", (newNotification) => {
      if (!newNotification._id) {
        console.error("Received notification without _id:", newNotification);
        return;
      }

      setNotifications((prev) => [newNotification, ...prev].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ));

      toast.info(`${newNotification.message}`);
      const updatedCount = notifications.length + 1;
    localStorage.setItem("unreadNotifications", updatedCount);
    window.dispatchEvent(new CustomEvent("unreadCountUpdated", { detail: updatedCount }));

    });

    return () => {
      socket.off("newOrderNotification");
    };
  }, []);

  const removeNotification = async (id) => {
    if (!id) {
      console.error("Notification ID is missing!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2500/api/order/remove-notification", { id });
      if (response.data.success) {
        setNotifications((prev) => prev.filter((notification) => notification._id !== id));
      } else {
        console.error("Failed to remove notification:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing notification:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> Notifications</h1>
      <div className="bg-gray-100 p-4 rounded-lg space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={notification._id || index}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <span className="text-lg font-medium">🔔 {notification.message}</span>
                <br />
                <span className="text-sm text-gray-500">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => removeNotification(notification._id)}
                className="text-red-500 text-lg font-bold"
              >
                ✖
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default Notification;
