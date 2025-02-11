import { response } from "express";
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import sendEmail from "../utils/sendEmail.js";

// import { currency } from "../../Admin/src/App.jsx";

dotenv.config()

const currency = 'usd'
const deliveryCharge = 10

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})

// placing order using COD
const placeOrder = async (req,res) => {
    
  try {
    
            const {userId,items,address,amount} = req.body
            const email = address?.email; 


                // Creating another orderdata obj that will pass as new ordermodel
                const orderData = {
                    userId,items,address,amount,
                    paymentMethod: "COD",
                    payment: true,
                    date: Date.now()
                }

                const newOrder = new orderModel(orderData)
                console.log("User Data:",newOrder);
                
                await orderModel.findByIdAndUpdate(userId,{payment:true})
                
                await newOrder.save()

              
                // after placing order usermodel should be impty
                await userModel.findByIdAndUpdate(userId,{cartData:{}})

                res.json({success:true,message:"Order Placed !!"})
                console.log("Email:",email);
                
                // sending mail to user that order has been placed successfully
                sendEmail(
                  email,
                  "Payment Successful for your order",
                  "Order Details",
                  "../EmailTemplates/cod.html",
                  { 
                      _id: newOrder._id,
                      paymentMethod: newOrder.paymentMethod,
                      amount: newOrder.amount,
                      address: `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`,
                      items: newOrder.items
                  }
              );



  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
}

// Stripe method

const placeOrderStripe = async (req,res) => {
    
  try {
    
    const {userId,items,amount,address} = req.body
    const email = address?.email;
    const { origin } = req.headers

    const orderData = {
      userId,items,address,amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    }
    
    

      const newOrder = new orderModel(orderData)
      await newOrder.save()

      const line_items = items.map((item) => ({
        price_data: {
          currency:currency,
          product_data: {
            name:item.name
          },
          unit_amount: item.price * 100
        },
        quantity: item.quantity
      }))

      line_items.push({
        price_data: {
          currency:currency,
          product_data: {
            name:"Delivery Charges"
          },
          unit_amount: deliveryCharge * 100
        },
        quantity: 1
      })
      console.log(line_items);
      

      const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode:'payment',
      })

      res.json({success:true,session_url:session.url})

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}

// verify stripe payment method

const verifystripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      // Send confirmation email
      sendEmail(
        order.address.email,
        "Payment Successful for your order",
        "Order Details",
        "../EmailTemplates/cod.html",
        {
          _id: order._id,
          paymentMethod: order.paymentMethod,
          amount: order.amount,
          address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}, ${order.address.country}`,
          items: order.items,
        }
      );

      res.json({ success: true, message: "Payment verified and email sent!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed. Order deleted." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//Razorpay Method

const placeOrderRazorpay = async (req,res) => {
    try {
      
      const {userId,items,amount,address} = req.body
  
      const orderData = {
        userId,items,address,amount,
        paymentMethod: "Razorpay",
        payment: false,
        date: Date.now()
      }
      
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
          amount: amount * 100,
          currency: currency.toUpperCase(),
          receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options,(error,order) => {
          if(error)
          {
            console.log(error);
            return res.json({success:false,message:error})
          }
          res.json({success:true,order})
        })

        // sending mail to user for successfull payment
        sendEmail(
          email,
          "Payment Successful for your order",
          "Order Details",
          "../EmailTemplates/cod.html",
          { 
              _id: newOrder._id,
              paymentMethod: newOrder.paymentMethod,
              amount: newOrder.amount,
              address: `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`,
              items: newOrder.items
          }
      );

    } catch (error) {
      console.log(error);
      res.json({success:false,message:error.message})
    }
}

// verify razorpay Method

const verifyRazorpay = async (req,res) => {
  try {
    
        const {userId,razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);

        if(orderInfo.status === 'paid')
        {
          await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
          // clearing cartdata
          await userModel.findByIdAndUpdate(userId,{cartData:{}})
          res.json({success:true,message: "Payment Successfull!"})
        } else{
          res.json({success:false,message:"Payment Failed!"})
        }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}

// Displaying orders in admin order page

const allOrders = async (req,res) => {
    
  try {

    const orders = await orderModel.find({})
    res.json({success:true,orders})

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
}

// Displaying orders in user frontend panel in order page after user click on place order button

const userOrders = async (req,res) => {
    try {
      
      const { userId } = req.body

      const orders = await orderModel.find({ userId })
      res.json({success:true,orders})

    } catch (error) {
      console.log(error);
      res.json({success:false,message:error.message})
      
    }
}

// Update order Status from admin

const updateStatus = async (req,res) => {

  try {
    
    const {orderId,status} = req.body
    await orderModel.findByIdAndUpdate(orderId,{ status })
    res.json({success:true,message:'Status Updated!'})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
    
}

export {placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,updateStatus,userOrders,verifystripe,verifyRazorpay}