import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import axios from 'axios'

const socket = io("http://localhost:2500");

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);
    localStorage.setItem("unreadNotifications", 0);



    socket.on("newOrderNotification", (newNotification) => {
      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
        let unreadCount = parseInt(localStorage.getItem("unreadNotifications") || "0", 10);
        unreadCount += 1;
        localStorage.setItem("unreadNotifications", unreadCount);
    
        // Dispatch custom event so Navbar listens for updates
        window.dispatchEvent(new CustomEvent("unreadCountUpdated", { detail: unreadCount }));
    
        return updatedNotifications;
      });
    
      toast.info(`${newNotification.message}`);
    });
    

    return () => {
      socket.off("loadNotifications");
      socket.off("newOrderNotification");
    };
  }, []);

  const removeNotification = async (id) => {
    try {
      const response = await axios.post(`http://localhost:2500/api/order/remove-notification`, { id });
  
      if (response.data.success) {
        setNotifications((prev) => {
          const updatedNotifications = prev.filter((notification) => notification._id !== id);
          localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
      } else {
        console.error("Failed to remove notification:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> Notifications</h1>
      <div className="bg-gray-100 p-4 rounded-lg space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
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
                className="text-red-500 text-lg font-bold"
                onClick={() => removeNotification(notification._id)}
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
