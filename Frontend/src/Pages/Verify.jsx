import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {useSearchParams} from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'

const Verify = () => {

    const {navigate, token, setcartItems,backendUrl} = useContext(ShopContext)
    const [serchParams,setSearchParams] = useSearchParams()

    const success = serchParams.get('success')
    const orderId = serchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            
            if(!token)
            {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe',{success,orderId},{headers:{token}})

            if (response.data.success)
            {
                setcartItems(response)
                navigate('/order')
            }else{
                navigate('/cart')
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[token])
  return (
    <div>

    </div>
  )
}

export default Verify