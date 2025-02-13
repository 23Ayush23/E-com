import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import sendEmail from "../utils/sendEmail.js";
import path from 'path'
import { fileURLToPath } from "url";  
import fs from "fs/promises";
import generatePDF from "../utils/generatePDF.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import { currency } from "../../Admin/src/App.jsx";

dotenv.config()

const currency = 'usd'
const deliveryCharge = 10

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing order using COD

const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
    const { firstname, lastname, email, street, city, state, zipcode, country } = address;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: true,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed !!" });

    const pdfFilePath = path.join(__dirname, "../pdfs", `order_${newOrder._id}.pdf`);

    const htmlContent = `
    <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 15px;
        border-bottom: 2px solid #007bff;
      }
      .header h2 {
        color: #007bff;
        margin: 0;
      }
      .content {
        padding: 20px 0;
      }
      .content p {
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
      .order-details {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .order-details h3 {
        color: #007bff;
        margin-bottom: 10px;
      }
      .order-details p {
        font-size: 14px;
        margin: 5px 0;
      }
      .shipping-address {
        background-color: #eef7ff;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .items-list {
        margin-top: 10px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .items-list ul {
        padding: 0;
        list-style: none;
      }
      .items-list li {
        background: #fff;
        padding: 10px;
        margin-bottom: 5px;
        border-radius: 5px;
        border: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 14px;
        color: #666;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Order Confirmation</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
        <p>Thank you for your order! Below are your order details:</p>

        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
          <p><strong>Payment Method:</strong> ${newOrder.paymentMethod}</p>
          <p><strong>Amount Paid:</strong> <span style="color: #28a745;">$${newOrder.amount}</span></p>
        </div>

        <div class="shipping-address">
          <h3>Shipping Address</h3>
          <p>${street}, ${city}, ${state}, ${zipcode}, ${country}</p>
        </div>

        <div class="items-list">
          <h3>Items Ordered:</h3>
          <ul>
            ${items.map(item => 
              `<li><strong>${item.name}</strong> (x${item.quantity}) - <span style="color: #28a745;">$${item.price}</span></li>`
            ).join("")}
          </ul>
        </div>

        <p>We appreciate your business and hope to serve you again soon!</p>
      </div>
      
      <div class="footer">
        <p>Need help? <a href="mailto:support@yourshop.com">Contact Support</a></p>
        <p>&copy; ${new Date().getFullYear()} YourShop. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
    `;

    await generatePDF(htmlContent, pdfFilePath);

    let pdfExists = false;
    for (let i = 0; i < 5; i++) {
      try {
        await fs.access(pdfFilePath);
        pdfExists = true;
        break;
      } catch (error) {
        console.log(`Retry ${i + 1}: PDF not found, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!pdfExists) {
      console.error("Error: PDF file not found, cannot send email.");
      return res.json({ success: false, message: "PDF generation failed" });
    }

    await sendEmail(
      email,
      "Payment Successful for Your Order",
      "Order Details",
      {
        _id: newOrder._id,
        firstname,
        lastname,
        paymentMethod: newOrder.paymentMethod,
        amount: newOrder.amount,
        address: { street, city, state, zipcode, country },
        items: newOrder.items,
      },
      pdfFilePath
    );

    // Remove PDF after successful email sending
    try {
      await fs.unlink(pdfFilePath);
      console.log(`PDF deleted: ${pdfFilePath}`);
    } catch (unlinkError) {
      console.error("Error deleting PDF:", unlinkError);
    }
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.json({ success: false, message: error.message });
  }
};

export default placeOrder;

// Stripe method

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
    const { firstname, lastname } = address;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd", // Ensure currency is defined
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    // console.log(line_items);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&userId=${userId}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


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

      // Generate PDF for order confirmation
      const pdfFilePath = path.join(__dirname, "../pdfs", `order_${order._id}.pdf`);

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 80%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 15px;
                border-bottom: 2px solid #007bff;
              }
              .header h2 {
                color: #007bff;
                margin: 0;
              }
              .content p {
                font-size: 16px;
                color: #333;
                line-height: 1.5;
              }
              .order-details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
              }
              .shipping-address {
                background-color: #eef7ff;
                padding: 10px;
                border-radius: 5px;
                margin-top: 10px;
              }
              .product-details {
                background-color: rgb(239, 228, 190);
                padding: 10px;
                border-radius: 5px;
                margin-top: 10px;
              }
              .amount-paid {
                font-size: 20px;
                font-weight: bold;
                color: #28a745;
                text-align: right;
                margin-top: 15px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                font-size: 14px;
                color: #666;
              }
              .footer a {
                color: #007bff;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Order Confirmation</h2>
              </div>
              <div class="content">
                <p>Dear <strong>${order.address.firstname} ${order.address.lastname}</strong>,</p>
                <p>Thank you for your order! Below are your order details:</p>

                <div class="order-details">
                  <p><strong>Order ID:</strong> ${order._id}</p>
                  <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                </div>

                <div class="shipping-address">
                  <h3>Shipping Address</h3>
                  <p>${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}, ${order.address.country}</p>
                </div>

                <div class="product-details">
                  <h3>Products Purchased</h3>
                  <ul>
                    ${order.items.map(item => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}
                  </ul>
                  <p class="amount-paid">Total Paid: $${order.amount}</p>
                </div>

                <p>We appreciate your business and hope to serve you again soon!</p>
              </div>
              
              <div class="footer">
                <p>Need help? <a href="mailto:support@yourshop.com">Contact Support</a></p>
                <p>&copy; ${new Date().getFullYear()} YourShop. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await generatePDF(htmlContent, pdfFilePath);

      // Wait for PDF generation
      let pdfExists = false;
      for (let i = 0; i < 5; i++) {
        try {
          await fs.access(pdfFilePath);
          pdfExists = true;
          break;
        } catch (error) {
          console.log(`Retry ${i + 1}: PDF not found, waiting...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (!pdfExists) {
        console.error("Error: PDF file not found, cannot send email.");
        return res.json({ success: false, message: "PDF generation failed" });
      }

      // Send email only after successful payment verification
      await sendEmail(
        order.address.email,
        "Payment Successful for Your Order",
        "Order Details",
        {
          _id: order._id,
          firstname: order.address.firstname,
          lastname: order.address.lastname,
          paymentMethod: order.paymentMethod,
          amount: order.amount,
          address: order.address,
          items: order.items,
        },
        pdfFilePath
      );

      // Remove PDF after sending email
      try {
        await fs.unlink(pdfFilePath);
        console.log(`PDF deleted: ${pdfFilePath}`);
      } catch (unlinkError) {
        console.error("Error deleting PDF:", unlinkError);
      }

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

export {placeOrder,placeOrderStripe,allOrders,updateStatus,userOrders,verifystripe}