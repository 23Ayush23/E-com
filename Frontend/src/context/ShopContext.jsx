import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
// All products API
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$"
    const delivery_fee = 1.5
    const backendUrl = import.meta.env.VITE_BACKEND_URL
// console.log(backendUrl);

    // State for Search Functionality
    const [search,setSearch] = useState('')
    // State for Showing / Not showing Search Bar 
    const [showSearch,setShowSearch] = useState(false)
    //state for add to cart functionality
    const [cartItems,setcartItems] = useState({})
    //state for products from backend api
    const [products,setProducts] = useState([])
    // state for token for auth of login user
    const [token,settoken] = useState('')

    // to navigate from cart to place order componenet
    const navigate = useNavigate();
    

    // function to add product and size of selected products
    const addToCart = async(itemId,size) => {

        //if no size selected then notify user to select size
        if(!size){
            toast.error('Select Product Size')
            return
        }

        // ALl clone data in cart
        let cartData = structuredClone(cartItems)

        if(cartData[itemId]) // product with unique id
            {
            if(cartData[itemId][size]) 
            // with selected size if select
            //  then increase count
                {
                cartData[itemId][size]+=1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        // if no product is selected then
        else{
            cartData[itemId] ={}
            cartData[itemId][size]=1;
        }

        setcartItems(cartData)

        // checking if user is logged in with add API
        if(token)
        {
            try {
             await    axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
                
            }
        }
    }

    // function to increace count of cart counter whenever user
    // add products to add to addtocart button

    const getCartCount =  () => {
        let totalCount = 0;

        for(const items in cartItems) // product
            {
                for(const item in cartItems[items])  // product size
                {
                    try {
                        if(cartItems[items][item]>0)
                            {
                                totalCount += cartItems[items][item]
                            }
                    } catch (error) {
                        
                    }
                }
            }
            return totalCount;
    }

// function to remove / update cartdata by remove / bin button
    const updatedQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setcartItems(cartData)

        //updating qty in frontend will reflect to db cartitmes with use of Api

        if(token)
        {
            try {
             
                await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity},{headers:{token}})

            } catch (error) {
                console.log(error);
                toast.error(error.message)
                
            }
        }
    }

// function to display total amount
const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) { // for each product
        let iteminfo = products.find((product) => product._id === items);

        if (!iteminfo) continue; // Skip if item is not found

        for (const item in cartItems[items]) {
            try {
                if (cartItems[items][item] > 0) {
                    totalAmount += iteminfo.price * cartItems[items][item]; // qty
                }
            } catch (error) {
                console.error("Error calculating total:", error);
            }
        }
    }

    // Fix floating-point precision issue
    return Math.floor(totalAmount * 10) / 10;  // Keeps one decimal place, truncates excess
};


// getProductdata function to get data from backend Api
    const getProductData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list")

            if(response.data.success){
                setProducts(response.data.products);
            }else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)   
        }
    }

    // after refresh cart items reflect in db and will not disapear in cart at frontend
    const getUserCart = async ({ token }) => {
        
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if(response.data.success)
            {
                setcartItems(response.data.cartData)
                localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(()=>{
        // console.log(cartItems);
    },[cartItems])

    useEffect(()=>{
        getProductData()
    },[])

    // use effect to logged in page even refreshing page
    useEffect(()=>{
        if(!token && localStorage.getItem('token'))
            {
                settoken(localStorage.getItem('token'))
                // getUserCart(localStorage.getItem('token'))
            }
    },[])

    useEffect(() => {
        if (token) {
            getUserCart({ token });
        }
    }, [token]);

    const value ={
            products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,
            cartItems,setcartItems,addToCart,getCartCount,updatedQuantity
            ,getCartAmount,navigate,backendUrl,token,settoken,getUserCart
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider