import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:2500");

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage first
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);

    // Load notifications from the server
    socket.on("loadNotifications", (savedNotifications) => {
      const sortedNotifications = savedNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sortedNotifications);
      localStorage.setItem("notifications", JSON.stringify(sortedNotifications));
    });

    // Listen for new notifications in real-time
    socket.on("newOrderNotification", (newNotification) => {
      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });

      toast.info(newNotification.message);
    });

    return () => {
      socket.off("loadNotifications");
      socket.off("newOrderNotification");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="bg-gray-100 p-4 rounded-lg max-h-80 overflow-y-auto scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification._id} className="p-2 border-b flex justify-between items-center">
              <span>
                {notification.message} -{" "}
                {new Date(notification.timestamp).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No new notifications</li>
        )}
      </ul>
    </div>
  );
};

export default Notification;
