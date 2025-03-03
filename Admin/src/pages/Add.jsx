import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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
  const [loading, setLoading] = useState(false);


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
    setLoading(true)

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
        setLoading(false);
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
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Upload Image */}
      <div className="w-full mb-4">
        <p className="mb-2 text-gray-700 font-medium">Upload Image</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => {
    const images = [image1, image2, image3, image4]; // Keep track of states
    return (
      <label
        key={index}
        htmlFor={`image${index + 1}`}
        className="w-24 h-24 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer rounded-md overflow-hidden"
      >
        {images[index] ? (
          <img
            className="w-full h-full object-cover"
            src={URL.createObjectURL(images[index])}
            alt={`Upload ${index + 1}`}
          />
        ) : (
          <img className="w-12 h-12 object-cover" src={assets.upload_area} alt="Upload" />
        )}
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
      </label>
    );
  })}
</div>

      </div>
  
      <div className="w-full mb-4">
        <p className="mb-2 font-medium">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" required />
      </div>
  
      <div className="w-full mb-4">
        <p className="mb-2 font-medium">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" placeholder="Write description here.." required />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="mb-2 font-medium">Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        
        <div>
          <p className="mb-2 font-medium">Subcategory</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="mb-2 font-medium">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="number" min="0" placeholder="Enter price" required />
        </div>
        
        <div>
          <p className="mb-2 font-medium">Product Stock</p>
          <input onChange={(e) => setProductStock(e.target.value)} value={productStock} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400" type="number" min="0" placeholder="Enter stock quantity" required />
        </div>
      </div>
  
      <div className="w-full mb-4">
        <p className="mb-2 font-medium">Select Sizes</p>
        <div className="flex gap-3 flex-wrap">
  {["S", "M", "L", "XL", "XXL"].map((size) => (
    <div
      key={size}
      className={`px-4 py-2 border rounded-md cursor-pointer transition ${
        sizes.includes(size) ? "bg-gray-500 text-white border-gray-500" : "border-gray-300"
      }`}
      onClick={() => {
        setSizes((prevSizes) =>
          prevSizes.includes(size)
            ? prevSizes.filter((s) => s !== size)
            : [...prevSizes, size]
        );
      }}
    >
      {size}
    </div>
  ))}
</div>

      </div>

      {/* Bestseller Checkbox */}
      <div className="w-full mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="form-checkbox text-blue-600"
          />
          <span className="font-medium">Mark as Bestseller</span>
        </label>
      </div>
  
      <button type="submit" className="w-full sm:w-32 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition flex justify-center items-center" disabled={loading}>
        {loading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
        {loading ? "Adding..." : "Add"}
      </button>    </form>
  );
  
};

export default Add;
