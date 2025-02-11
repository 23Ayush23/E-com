import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const Order = ({ token }) => {
  const [orders, setOrder] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchAllOrders = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrder(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openConfirmModal = (event, orderId) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(event.target.value);
    setIsOpen(true);
  };

  const closeConfirmModal = () => {
    setIsOpen(false);
    setSelectedOrderId(null);
    setSelectedStatus("");
  };

  const updateOrderStatus = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId: selectedOrderId, status: selectedStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated successfully");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
    closeConfirmModal();
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3> Order Page :-</h3>
      {orders.map((order, index) => (
        <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
          <img className="w-12" src={assets.parcel_icon} alt="" />

          <div>
            <div>
              {order.items.map((item, index) => (
                <p key={index} className="py-0.5">
                  {item.name} * {item.quantity} <span> {item.size} </span>
                </p>
              ))}
            </div>
            <p className="mt-3 mb-2 font-medium">{order.address.firstname + " " + order.address.lastname}</p>
            <div>
              <p>
                {order.address.street + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}
              </p>
              <p> {order.address.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm sm:text-[15px]">Items : {order.items.length}</p>
            <p className="mt-3">Payment Method: {order.paymentMethod} </p>
            <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
            <p>Date {new Date(order.date).toLocaleDateString()}</p>
          </div>

          <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>

          <select  onChange={(event) => openConfirmModal(event, order._id)} value={order.status} className="p-2 font-semibold">
            <option value={"Order Placed"}> Order Placed </option>
            <option value={"Packing"}> Packing </option>
            <option value={"Shipped"}> Shipped </option>
            <option value={"Out For delivery"}> Out For delivery </option>
            <option value={"Delivered"}> Delivered </option>
          </select>
        </div>
      ))}

      {/* Confirmation Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeConfirmModal} style={customStyles} contentLabel="Confirm Status Change">
        <h2 className="text-lg font-semibold">Status of this order will change</h2>
        <p>Are you sure you want to update the order status to "{selectedStatus}"?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={closeConfirmModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={updateOrderStatus} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Order;
