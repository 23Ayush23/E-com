import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {ShopContext}  from '../context/ShopContext'


const ForgotPassword = () => {
    const {backendUrl,navigate} = useContext(ShopContext)
    // console.log(backendUrl);
    
  const [email, setEmail] = useState('');

  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        // console.log(backendUrl);
        
      // Call forgot password API (replace with actual backend URL)
      const response = await axios.post(backendUrl+'/api/user/forgot-password', {email });
      // console.log(response.data);
      
      if (response.data.success) {
        navigate('/login')
        toast.success('Password reset link sent to your email');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 text-gray-800 border-2 border-gray-700 p-6 rounded-lg shadow-lg bg-white">
        <div className="inline-flex items-center gap-2 mb-4">
          <p className="prata-regular text-3xl text-bold">Forgot Password</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Enter Your Email"
          required
        />
        <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 rounded" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
