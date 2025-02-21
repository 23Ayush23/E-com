import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      if (response.data.success) {
        toast.success('Password reset link sent to your email');
        setTimeout(() => {
          navigate('/login'); // Navigate after success
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form 
        onSubmit={onSubmitHandler} 
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4 text-gray-800 border-2 border-gray-700 p-6 rounded-lg shadow-lg bg-white"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <p className="prata-regular text-3xl font-bold">
            {loading ? "Sending resetPasswordlink" : "Forgot Password"}
          </p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        {!loading ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter Your Email"
              required
              disabled={loading}
            />
            <button
              className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 rounded transition-all flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              Submit
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-900"></div>
            <p className="text-gray-700">Sending Reset Link...</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
