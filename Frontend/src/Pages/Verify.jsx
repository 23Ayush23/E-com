import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const { navigate, token, setcartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                setcartItems(response);
                navigate('/order');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Verifying payment...</p>
                </div>
            )}
        </div>
    );
};

export default Verify;
