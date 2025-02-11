import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios'
import { backendUrl } from '../App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = ({token}) => {

  // State for images,name,price,description,category,subcategory,sizes,bestseller
  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name,setname] = useState("")
  const [description,setDescription] = useState("")
  const [price,SetPrice] = useState("")
  const [category,SetCategory] = useState("Men")
  const [subCategory,SetsubCategory] = useState("Topwear")
  const [bestseller,setBestseller] = useState(false)
  const [sizes,setSizes] = useState([])
  //state for checking existed product
  const [existedProduct,setExistedProduct] = useState([])

  useEffect(()=>{

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`, { headers: { token } });
        setExistedProduct(response.data.products.map(product => product.name.toLowerCase()));
      } 
      catch (error) {
        toast.error("Error fetching existing products!");
        
      };
      fetchProduct()
    }
  },[token])

  if (existedProduct.includes(name.toLowerCase())) {
    toast.error("Please fill in all required fields before submitting.");
    return;
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!name || !description || !price || !category || !subCategory || sizes.length === 0) {
      alert("Please fill in all required fields before submitting.");
      return;
  }

    if (existedProduct.includes(name.toLowerCase())) {
      toast.error("Product with this name already exists.");
      return;
    }

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))

      // uploading atleast 1 image
      if (!image1 && !image2 && !image3 && !image4) {
        toast.error("Please upload at least one image.");
        return;
    }

      // if image is available then only append
      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token,"Content-Type": "multipart/form-data"}})

      if(response.data.success) 
      {
        toast.success(response.message)
        setname('')
        setDescription('')
        SetPrice('')
        setImage1('')
        setImage2('')
        setImage3('')
        setImage4('')
        setSizes([])
        setBestseller(false)
      }else{
        toast.error(response.data.message)
      }

      toast.success("Product added successfully");
      
    } catch (error) {
      toast.error(`Error adding product: ${error.response?.data?.message || error.message}`);

    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3 px-4 sm:px-8">
      {/* Upload Image */}
      <div className="w-full">
        <p className="mb-2 text-gray-700">Upload Image</p>
        <div className="flex flex-wrap gap-2">
          <label htmlFor="image1" className="w-20 h-20 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
            <img className="w-12 h-12" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Upload" />
            <input onChange={(e)=>setImage1(e.target.files[0])}type="file" id="image1" hidden />
          </label>

          <label htmlFor="image2" className="w-20 h-20 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
            <img className="w-12 h-12" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="Upload" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>

          <label htmlFor="image3" className="w-20 h-20 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
            <img className="w-12 h-12" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="Upload" />
            <input onChange={(e)=>setImage3(e.target.files[0])}type="file" id="image3" hidden />
          </label>

          <label htmlFor="image4" className="w-20 h-20 flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 cursor-pointer">
            <img className="w-12 h-12" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="Upload" />
            <input onChange={(e)=>setImage4(e.target.files[0])}type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e)=>setname(e.target.value)} value={name}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e)=>setDescription(e.target.value)} value={description}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write description here.."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-auto">
          <p className="mb-2">Product Category</p>
          <select onChange={(e)=>SetCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <p className="mb-2">Product Subcategory</p>
          <select onChange={(e)=>SetsubCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e)=>SetPrice(e.target.value)} value={price}
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            min="0"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter price"
            required
          />
        </div>
      </div>

          <div>
            <p className='mb-2'> Product Sizes</p>
            <div className='flex gap-2'>
              
            
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div key={size} onClick={() =>
              setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])
            }>
              <p className={`${sizes.includes(size) ? "bg-blue-100" : "bg-gray-200"} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}

            </div>
          </div>

          <div className='flex gap-2'>
            <input onChange={() => setBestseller(prev => !prev)} checked={bestseller}type="checkbox" id='bestseller' />
            <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
          </div>

          <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>Add</button>

    </form>
  );
};

export default Add;
