import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Collection from './Pages/Collection.jsx';
import About from './Pages/About.jsx';
import Cart from './Pages/Cart.jsx';
import Contact from './Pages/Contact.jsx';
import Login from './Pages/Login.jsx';
import Order from './Pages/Order.jsx';
import PlaceOrder from './Pages/PlaceOrder.jsx';
import Product from './Pages/Product.jsx';
import Navbar from './components/Navbar.jsx';
import Searchbar from './components/Searchbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer.jsx';
import Verify from './Pages/Verify.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import Profile from './Pages/Profile.jsx';
import DeliveryPolicy from './Pages/DeliveryPolicy.jsx'
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx'

const App = () => {
  const location = useLocation(); // Get current route

  // Define routes where Navbar, Searchbar, and Footer should be hidden
  const hideElementsOnRoutes = ['/forgot-password','/login','/reset-password'];

  // Check if current route is in the hide list
  const shouldHideElements = hideElementsOnRoutes.includes(location.pathname);

  return (
    <div>
      <ToastContainer />
      
      {/* Conditionally render Navbar and Searchbar */}
      {!shouldHideElements && <Navbar />}
      {!shouldHideElements && <Searchbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/order" element={<Order />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/delivery-policy" element={<DeliveryPolicy />} />
        <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!shouldHideElements && <Footer />}
    </div>
  );
};

export default App;
