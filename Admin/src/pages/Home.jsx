import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:2500");

const Home = ({ showNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("loadNotifications", (savedNotifications) => {
      setNotifications(savedNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });

    socket.on("newOrderNotification", (newNotification) => {
      setNotifications((prev) => 
        [newNotification, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
      toast.info(newNotification.message);
    });

    return () => {
      socket.off("loadNotifications");
      socket.off("newOrderNotification");
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard!</h1>

      {showNotifications && (
        <div className="absolute right-5 top-20 bg-white shadow-lg rounded-lg w-80 p-4">
          <h2 className="text-xl font-semibold mb-3">Notifications</h2>
          <ul className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="p-2 border-b flex justify-between items-center"
                >
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
      )}
    </div>
  );
};

export default Home;






