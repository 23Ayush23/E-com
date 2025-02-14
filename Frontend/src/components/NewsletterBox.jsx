import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
    const { backendUrl, user } = useContext(ShopContext);
    const [email, setEmail] = useState(user?.email || "");
    const [isSubscribed, setIsSubscribed] = useState(
        JSON.parse(localStorage.getItem("isSubscribed")) || false
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
            
            // Only check subscription if it’s not already stored in localStorage
            const storedSubscription = JSON.parse(localStorage.getItem("isSubscribed"));
            if (storedSubscription === null) {
                checkSubscription(user.email);
            } else {
                setIsSubscribed(storedSubscription);
            }
        }
    }, [user]);

    const checkSubscription = async (email) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/check-subscription`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            if (response.data.isSubscribed) {
                setIsSubscribed(true);
                localStorage.setItem("isSubscribed", JSON.stringify(true));
            } else {
                setIsSubscribed(false);
                localStorage.setItem("isSubscribed", JSON.stringify(false));
            }
        } catch (error) {
            console.error("Error checking subscription:", error);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter a valid email.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${backendUrl}/api/user/subscribe`,
                { email },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            toast.success(response.data.message);
            setIsSubscribed(true);
            localStorage.setItem("isSubscribed", JSON.stringify(true));
            setEmail(""); 
        } catch (error) {
            if (error.response?.status === 409) {
                toast.info("You are already subscribed!");
                setIsSubscribed(true);
                localStorage.setItem("isSubscribed", JSON.stringify(true));
            } else {
                toast.error(error.response?.data?.message || "Subscription failed!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>
                Subscribe Now!! & get 20% Off
            </p>
            <p className='text-gray-400 mt-3'>
                Connect with us and get more upcoming benefits
            </p>
            <form 
                onSubmit={onSubmitHandler} 
                className='w-full sm:w-1/2 flex items-center mx-auto my-6 border'
            >
                {isSubscribed ? (
                    <button 
                        type='button' 
                        className='bg-black text-white text-lg w-full py-4 text-center cursor-not-allowed opacity-70'
                        disabled
                    >
                        Thanks for Subscription!
                    </button>
                ) : (
                    <div className='w-full flex items-center'>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 border-none outline-none"
                            required
                        />
                        <button 
                            type='submit' 
                            className='bg-black text-white text-xs px-10 py-4'
                            disabled={!email || isSubmitting}
                        >
                            {isSubmitting ? "Subscribing..." : "Subscribe!"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NewsletterBox;
