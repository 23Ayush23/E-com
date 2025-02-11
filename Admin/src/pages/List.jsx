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
  const [editData, setEditData] = useState({ name: "", price: "" });

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products || []);
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
    setEditData({ name: product.name, price: product.price });
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedProductId(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const updateProduct = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        { productId: selectedProductId, name: editData.name, price: editData.price },
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
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center px-2 py-1 border bg-gray-100 text-sm text-gray-600">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Actions</b>
        </div>

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-2 px-4 border text-sm hover:bg-gray-50"
            key={index}
          >
            <img className="w-16 h-16 object-cover rounded-md" src={item.image[0]} alt={item.name} />
            <p className="truncate text-gray-800 font-medium">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="font-semibold">{currency}{item.price}</p>

            <div className="flex gap-2">
              <button onClick={() => openEditModal(item)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </button>
              <button onClick={() => openDeleteModal(item._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeDeleteModal} style={customStyles} contentLabel="Confirm Delete">
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={removeProduct} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Delete
          </button>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal} style={customStyles} contentLabel="Edit Product">
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <div className="mt-4">
          <label className="block mb-2">Product Name</label>
          <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-md" />

          <label className="block mt-4 mb-2">Price</label>
          <input type="number" name="price" value={editData.price} onChange={handleEditChange} className="w-full px-3 py-2 border rounded-md" />

          <div className="mt-4 flex justify-end gap-4">
            <button onClick={closeEditModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={updateProduct} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default List;
