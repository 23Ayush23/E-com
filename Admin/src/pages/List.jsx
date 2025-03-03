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
    description: "",
  });

  const fetchList = async () => {
    if (!token) {
      toast.error("Unauthorized: No token provided.");
      return;
    }
    // console.log("Token: ", token);

    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token }, // ✅ Ensure token is sent
      });

      if (response.data.success) {
        setList(response.data.products.reverse() || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unauthorized access.");
    }
  };

  // ✅ Open delete modal
  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setIsOpen(true);
  };

  // ✅ Close delete modal
  const closeDeleteModal = () => {
    setIsOpen(false);
    setSelectedProductId(null);
  };

  const removeProduct = async () => {
    if (!selectedProductId) return;
    if (!token) {
      toast.error("Unauthorized: Please log in first.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: selectedProductId },
        { headers: { token } } // ✅ Ensure token is included
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unauthorized access.");
    }

    closeDeleteModal();
  };

  // ✅ Open Edit Modal with Product Data
  const openEditModal = (product) => {
    setSelectedProductId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      productStock: product.productStock,
      description: product.description || "",
    });
    setEditModalIsOpen(true);
  };

  // ✅ Close Edit Modal
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedProductId(null);
  };

  // ✅ Handle Edit Input Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "productStock") && value < 0) {
      toast.error(`${name} cannot be negative.`);
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fix Update Product Function
  const updateProduct = async () => {
    if (!selectedProductId) {
      toast.error("No product selected.");
      return;
    }

    if (editData.price < 0 || editData.productStock < 0) {
      toast.error("Price and stock cannot be negative.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        {
          productId: selectedProductId,
          name: editData.name,
          price: Number(editData.price), //
          productStock: Number(editData.productStock),
          description: editData.description,
        },
        { headers: { token } } // ✅ Fix token header format
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // ✅ Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
    closeEditModal();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 text-xl font-semibold">All Product List</p>

      {/* ✅ Table for Medium & Large Screens */}
      <div className="hidden md:grid grid-cols-7 items-center px-2 py-1 border bg-gray-100 text-sm text-gray-600">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Stock</b>
        <b className="text-center">Actions</b>
      </div>

      {/* ✅ Responsive List */}
      <div className="flex flex-col gap-0">
        {list.map((item, index) => (
          <div
            key={index}
            className="border p-1 rounded-sm bg-white shadow-md border-b-0"
          >
            {/* ✅ Small Screen View */}
            <div className="block md:hidden">
              <div className="flex items-center gap-4">
                <img
                  className="w-20 h-20 object-cover rounded-md border"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {item.category}
                  </p>
                  <p className="font-semibold">
                    {currency}
                    {item.price} -{" "}
                    <span className="text-gray-600">
                      Stock: {item.productStock}
                    </span>
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

            {/* ✅ Medium & Large Screen Table View */}
            <div className="hidden md:grid grid-cols-7 items-center gap-4 py-2 text-sm">
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

      {/* ✅ Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
      >
        <h2 className="text-lg font-semibold">Confirm Delete</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeDeleteModal}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={removeProduct}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* ✅ Edit Product Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
      >
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleEditChange}
            className="border p-2 rounded-md"
          />
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="border p-2 rounded-md"
            rows="3"
          ></textarea>
          <label className="font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={editData.price}
            onChange={handleEditChange}
            className="border p-2 rounded-md"
          />

          <label className="font-medium">Stock</label>
          <input
            type="number"
            name="productStock"
            value={editData.productStock}
            onChange={handleEditChange}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeEditModal}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={updateProduct}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </>
  );
};

export default List;
