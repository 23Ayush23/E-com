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
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-7 items-center px-2 py-1 border bg-gray-100 text-sm text-gray-600">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className="text-center">Actions</b>
        </div>

        {list.map((item, index) => (
          <div
            className="grid grid-cols-7 items-center gap-4 py-2 px-4 border text-sm hover:bg-gray-50"
            key={index}
          >
            <img
              className="w-16 h-16 object-cover rounded-md mx-auto"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="truncate text-gray-800 font-medium text-center md:text-left">
              {item.name}
            </p>
            <p className="text-gray-600 text-center md:text-left">
              {item.category}
            </p>
            <p className="font-semibold text-center md:text-left">
              {currency}
              {item.price}
            </p>
            <p className="text-center md:text-left font-medium">
              {item.productStock}
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-2">
              <button
                onClick={() => openEditModal(item)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
        contentLabel="Confirm Delete"
      >
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={removeProduct}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel="Edit Product"
      >
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <div className="mt-4">
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
            className="w-full px-3 py-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            value={editData.price}
            onChange={handleEditChange}
            className="w-full px-3 py-2 border rounded-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
          />

          <label className="block mt-4 mb-2">Stock</label>
          <input
            type="number"
            name="productStock"
            min="0"
            value={editData.productStock}
            onChange={handleEditChange}
            className="w-full px-3 py-2 border rounded-md [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"
          />

          <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
            <button
              onClick={closeEditModal}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={updateProduct}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default List;
