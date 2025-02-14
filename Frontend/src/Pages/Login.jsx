import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Login = () => {
  // State variable for login/sign-up state
  const [currState, setCurrState] = useState('Login');

  const { token, navigate, settoken, backendUrl } = useContext(ShopContext);

  // State for form inputs
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Preventing reload Pages
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // console.log(backendUrl, 'login');

      if (currState === 'Sign Up') {
        // Sign-up API call
        const response = await axios.post(backendUrl + "/api/user/register", { name, email, password });
        console.log(response.data);

        if (response.data.success) {
          settoken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }

      } else {
        // Login API call
        const response = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (response.data.success) {
          settoken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Redirect to home if logged in
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Show Name field only in Sign Up state */}
      {currState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
        placeholder="Your Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
        placeholder="Your Password"
        required
      />

      {/* Conditionally render the "Forgot Password?" link only in Login state */}
      {/* Conditionally render "Forgot Password?" and "Create Account" on the same line */}
{currState === 'Login' && (
  <div className="w-full flex justify-between text-sm mt-1">
    <Link to="/forgot-password">
      <p className="cursor-pointer text-gray-500 hover:text-blue-700 active:text-blue-900 transition duration-200">
        Forgot Password?
      </p>
    </Link>
    <p
      onClick={() => setCurrState('Sign Up')}
      className="cursor-pointer text-gray-500 hover:text-blue-700 active:text-blue-900 transition duration-200"
    >
      Create Account
    </p>
  </div>
)}

{/* Show "Login Here" when in Sign Up state */}
{currState === 'Sign Up' && (
  <div className="w-full flex justify-end text-sm mt-1">
    <p
      onClick={() => setCurrState('Login')}
      className="cursor-pointer text-gray-500 hover:text-blue-700 active:text-blue-900 transition duration-200"
    >
      Login Here
    </p>
  </div>
)}

      <button className="bg-black text-white font-light px-8 py-2  mt-[-2px] hover:bg-gray-800">
        {currState === 'Login' ? 'Sign in' : 'Sign up'}
      </button>
    </form>
  );
};

export default Login;
