import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
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

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    productStock: "",
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse() || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setSelectedProductId(null);
  };

  const removeProduct = async () => {
    if (!selectedProductId) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: selectedProductId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    closeDeleteModal();
  };

  const openEditModal = (product) => {
    setSelectedProductId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      productStock: product.productStock,
    });
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedProductId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // ✅ Prevent setting negative values
    if (name === "price" || name === "productStock") {
      if (value < 0) {
        toast.error(`${name} cannot be negative.`);
        return;
      }
    }

    setEditData({ ...editData, [name]: value });
  };

  const updateProduct = async () => {
    // ✅ Validate price and stock before making API request
    if (editData.price < 0 || editData.productStock < 0) {
      toast.error("Price and stock cannot be negative.");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          productId: selectedProductId,
          name: editData.name,
          price: editData.price,
          productStock: editData.productStock,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    closeEditModal();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 text-xl font-semibold">All Product List</p>

      {/* ✅ Table Format for Medium & Large Screens */}
      <div className="hidden md:grid grid-cols-7 items-center px-2 py-1 border bg-gray-100 text-sm text-gray-600">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Stock</b>
        <b className="text-center">Actions</b>
      </div>

      {/* ✅ Responsive List Format */}
      <div className="flex flex-col gap-0">
        {list.map((item, index) => (
          <div key={index} className="border p-1 rounded-sm bg-white shadow-md border-b-0">
            {/* ✅ Small Screen View (Stacked Layout) */}
            <div className="block md:hidden">
              <div className="flex items-center gap-4">
                <img
                  className="w-20 h-20 object-cover rounded-md border"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Category: {item.category}</p>
                  <p className="font-semibold">
                    {currency}{item.price} - <span className="text-gray-600">Stock: {item.productStock}</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* ✅ Medium & Large Screens Table View */}
            <div className="hidden md:grid grid-cols-7 items-center gap-4 py-2 text-sm">
              <img
                className="w-16 h-16 object-cover rounded-md mx-auto"
                src={item.image[0]}
                alt={item.name}
              />
              <p className="truncate text-gray-800 font-medium text-center md:text-left">
                {item.name}
              </p>
              <p className="text-gray-600 text-center md:text-left">{item.category}</p>
              <p className="font-semibold text-center md:text-left">
                {currency}{item.price}
              </p>
              <p className="text-center md:text-left font-medium">{item.productStock}</p>
              <div className="flex flex-col md:flex-row justify-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
