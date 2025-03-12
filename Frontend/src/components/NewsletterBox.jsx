import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
    const { backendUrl, user } = useContext(ShopContext);
    const [email, setEmail] = useState(user?.email || "");
    const [isSubscribed, setIsSubscribed] = useState(() => {
        if (typeof window === "undefined") return false; // Handle SSR
        const storedValue = localStorage.getItem("isSubscribed");
        if (storedValue === null || storedValue === undefined || storedValue === "undefined") {
            return false;
        }
        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error("Error parsing stored subscription value:", error);
            return false;
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);

            // Only check subscription if it’s not already stored in localStorage
            const storedSubscription = localStorage.getItem("isSubscribed");
            if (storedSubscription === null || storedSubscription === undefined || storedSubscription === "undefined") {
                checkSubscription(user.email);
            } else {
                try {
                    setIsSubscribed(JSON.parse(storedSubscription));
                } catch (error) {
                    console.error("Error parsing stored subscription value:", error);
                    setIsSubscribed(false);
                }
            }
        }
    }, [user, backendUrl, user?.token]);

    const checkSubscription = async (email) => {
        setIsCheckingSubscription(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user/check-subscription`, {
                params: { email },
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            const subscribed = response.data.isSubscribed;
            setIsSubscribed(subscribed);
            localStorage.setItem("isSubscribed", JSON.stringify(subscribed));
        } catch (error) {
            console.error("Error checking subscription:", error);
        } finally {
            setIsCheckingSubscription(false);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.error("Please enter a valid email.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${backendUrl}/api/user/subscribe`,
                { email: trimmedEmail },
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
        <div className='bg-[#e9ecef] pt-10'>
            <div className='text-center'>
                <p className='text-2xl font-medium text-gray-800'>
                    Subscribe now & get 20% Off !!
                </p>
                <p className='text-gray-400 mt-3'>
                    Connect with us and get more upcoming benefits
                </p>
                <form 
                    onSubmit={onSubmitHandler} 
                    className='w-full sm:w-1/2 flex items-center mx-auto border'
                >
                    {isSubscribed ? (
                        <button 
                            type='button' 
                            className='bg-black text-white text-lg w-full py-4 text-center cursor-not-allowed opacity-70 mb-10'
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
                                disabled={!email.trim() || isSubmitting || isCheckingSubscription}
                            >
                                {isSubmitting ? "Subscribing..." : "Subscribe!"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NewsletterBox;