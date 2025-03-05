import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setResetToken(token);
    }else{
      alert("reset token not found")
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword != confirmPassword) {
      alert("Password does not match!");
      return;
    }

    try {
      

      // Call forgot password API (replace with actual backend URL)
      const response = await axios.post(
        backendUrl + "/api/user/reset-password",
        {token: resetToken,newPassword }
      );
      // console.log(response.data);

        if (response.data.success) {
          toast.success('Password reset successfully! try to login with new password!');
        } else {
          toast.error(response.data.message);
        }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 gap-4 text-gray-800 border border-gray-300 rounded-lg shadow-lg p-6 bg-white"
      >
        <div className="inline-flex items-center gap-2 mb-4 mt-10">
          <p className="font-semibold text-3xl">Reset Password</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 mb-4"
          placeholder="Enter your new password"
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 mb-6"
          placeholder="Confirm your new password"
          required
        />

        <button
          className="bg-black text-white font-semibold px-8 py-2 mt-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-800 transform hover:scale-105"
          type="submit"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
