import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 1.5;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // const [cartItems, setcartItems] = useState(() => {
  //   return JSON.parse(localStorage.getItem("cartItems")) || {};
  // });
  const [cartItems, setcartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
});

  const [products, setProducts] = useState([]);
  const [token, settoken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const userData = user ? { name: user.name.substring(0, 2) } : null;
  const navigate = useNavigate();

  const getUserData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/getuserdata`, {
        headers: { token },
      });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setcartItems(response.data.cartData);
        localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = { ...cartItems };
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setcartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updatedQuantity = async (itemId, size, quantity) => {
    let cartData = { ...cartItems };
    cartData[itemId][size] = quantity;
    setcartItems(cartData);
    localStorage.setItem("cartItems", JSON.stringify(cartData));

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0; // Ensure cart is empty after payment
    return Object.values(cartItems).reduce(
      (total, item) => total + Object.values(item).reduce((sum, qty) => sum + qty, 0),
      0
    );
  };
  

  // clear cart

  const clearCart = () => {
    setcartItems({})
  }

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
        let itemInfo = products.find((product) => product._id === itemId);
        if (!itemInfo) return totalAmount;

        return parseFloat((totalAmount + Object.values(sizes).reduce((sum, qty) => sum + itemInfo.price * qty, 0)).toFixed(2));
    }, 0);
};


  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    setUser(null);
    settoken("");
    setcartItems({});
    navigate("/");
  };

  useEffect(() => {
    if (token && !user) {
      getUserData();
      getUserCart();
    }
  }, [token]);

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setcartItems,
    addToCart,
    getCartCount,
    updatedQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    settoken,
    getUserCart,
    adminUrl,
    user,
    setUser,
    getUserData,
    userData,
    logoutUser,
    clearCart
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
