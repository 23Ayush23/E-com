import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success('Login successful!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
