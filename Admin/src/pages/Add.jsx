import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = ({ token }) => {
  // State for images, name, price, description, category, subcategory, sizes, bestseller, and stock
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productStock, setProductStock] = useState(""); // NEW STATE
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [existedProduct, setExistedProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`, { headers: { token } });
        setExistedProduct(response.data.products.map(product => product.name.toLowerCase()));
      } catch (error) {
        toast.error("Error fetching existing products!");
      }
    };
    fetchProduct();
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !productStock || !category || !subCategory || sizes.length === 0) {
      toast.error("Please fill in all required fields before submitting.");
      return;
    }

    if (existedProduct.includes(name.toLowerCase())) {
      toast.error("Product with this name already exists.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("productStock", productStock); // ADDING STOCK TO FORM DATA
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Uploading at least one image
      if (!image1 && !image2 && !image3 && !image4) {
        toast.error("Please upload at least one image.");
        return;
      }

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Product added successfully");
        setName('');
        setDescription('');
        setPrice('');
        setProductStock(''); // RESET STOCK INPUT
        setImage1('');
        setImage2('');
        setImage3('');
        setImage4('');
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(`Error adding product: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 px-4 sm:px-8">
      {/* Upload Image */}
      <div className="w-full">
        <p className="mb-2 text-gray-700">Upload Image</p>
        <div className="flex flex-wrap gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className="w-20 h-20 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
              <img className="w-12 h-12" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Upload" />
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" placeholder="Write description here.." required />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-auto">
          <p className="mb-2">Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <p className="mb-2"> Subcategory</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="w-full sm:w-auto flex flex-col">
          <p className="mb-2 text-sm sm:text-base">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="number" min="0" placeholder="Enter price" required />
        </div>

        <div className="w-full sm:w-auto flex flex-col">
          <p className="mb-2 text-sm sm:text-base">Product Stock</p>
          <input onChange={(e) => setProductStock(e.target.value)} value={productStock} className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="number" min="0" placeholder="Enter stock quantity" required />
        </div>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white cursor-pointer">Add</button>
    </form>
  );
};

export default Add;
