import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import sendEmail from "../utils/sendEmail.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import generatePDF from "../utils/generatePDF.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { io } from "../server.js";
import NotificationModel from "../models/notificationModel.js";

dotenv.config();

const deliveryCharge = 10;

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cod method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
    const {
      firstname,
      lastname,
      email,
      street,
      city,
      state,
      zipcode,
      country,
    } = address;

    if (!userId || !items || items.length === 0 || !address || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    // **Check for missing itemId BEFORE database operations**
    for (const item of items) {
      if (!item.itemId || typeof item.itemId !== "string") {
        return res.status(400).json({
          success: false,
          message: `Invalid item ID for product: ${item.name}`,
        });
      }
    }

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

    // **Update stock in parallel using Promise.all**
    await Promise.all(
      items.map(async (item) => {
        const updatedProduct = await productModel.findByIdAndUpdate(
          item.itemId,
          { $inc: { productStock: -item.quantity } }, // Atomically decrement stock
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Product not found: ${item.itemId}`);
        }

        if (updatedProduct.productStock < 0) {
          throw new Error(
            `Insufficient stock for product: ${updatedProduct.name}`
          );
        }
      })
    );

    // **Save notification to the database with `order` field**
    const notificationData = {
      order: newOrder._id, // Ensure order ID is included
      message: `New Order received from ${firstname} ${lastname}`,
      orderId: newOrder._id,
      amount: newOrder.amount,
      items: newOrder.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      address: `${street}, ${city}, ${state}, ${zipcode}, ${country}`,
      timestamp: new Date().toISOString(),
    };

    const newNotification = new NotificationModel(notificationData);
    await newNotification.save();

    const notificationId = newNotification._id; // Ensure notification ID is included

    // **Include `notificationId` in response**
    res.json({
      success: true,
      message: "Order Placed Successfully!",
      orderId: newOrder._id,
      notificationId, // Added notification ID in response
    });

    //Emit notification to the admin panel using Socket.io
    io.emit("newOrderNotification", {
      ...newNotification.toObject(),
      notificationId,
    });

    // Generate order confirmation email with PDF invoice
    const pdfFilePath = path.join(
      __dirname,
      "../pdfs",
      `order_${newOrder._id}.pdf`
    );

    const htmlContent = ` 
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { width: 80%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; padding-bottom: 15px; border-bottom: 2px solid #007bff; }
          .header h2 { color: #007bff; margin: 0; }
          .content { padding: 20px 0; }
          .content p { font-size: 16px; color: #333; line-height: 1.5; }
          .order-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
          .order-details h3 { color: #007bff; margin-bottom: 10px; }
          .order-details p { font-size: 14px; margin: 5px 0; }
          .shipping-address { background-color: #eef7ff; padding: 10px; border-radius: 5px; margin-top: 10px; }
          .items-list { margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 5px; }
          .items-list ul { padding: 0; list-style: none; }
          .items-list li { background: #fff; padding: 10px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
          .footer a { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>Order Confirmation</h2></div>
          <div class="content">
            <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
            <p>Thank you for your order! Below are your order details:</p>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${newOrder._id}</p>
              <p><strong>Payment Method:</strong> ${newOrder.paymentMethod}</p>
              <p><strong>Amount Paid:</strong> <span style="color: #28a745;">$${
                newOrder.amount
              }</span></p>
            </div>
            <div class="shipping-address">
              <h3>Shipping Address</h3>
              <p>${street}, ${city}, ${state}, ${zipcode}, ${country}</p>
            </div>
            <div class="items-list">
              <h3>Items Ordered:</h3>
              <ul>
                ${items
                  .map(
                    (item) =>
                      `<li><strong>${item.name}</strong> (x${item.quantity}) - <span style="color: #28a745;">$${item.price}</span></li>`
                  )
                  .join("")}
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

    try {
      await fs.unlink(pdfFilePath);
    } catch (unlinkError) {
      console.error("Error deleting PDF:", unlinkError);
    }
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default placeOrder;

// Stripe method

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
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
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      await Promise.all(
        order.items.map(async (item) => {
          const updatedProduct = await productModel.findByIdAndUpdate(
            item.itemId,
            { $inc: { productStock: -item.quantity } },
            { new: true }
          );

          if (!updatedProduct) {
            throw new Error(`Product not found: ${item.itemId}`);
          }

          if (updatedProduct.productStock < 0) {
            throw new Error(
              `Insufficient stock for product: ${updatedProduct.name}`
            );
          }
        })
      );

      const notificationData = {
        order: order._id,
        message: `New Order received from ${order.address.firstname} ${order.address.lastname}`,
        orderId: order._id,
        amount: order.amount,
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}, ${order.address.country}`,
        timestamp: new Date().toISOString(),
      };

      const newNotification = new NotificationModel(notificationData);
      await newNotification.save();

      const notificationId = newNotification._id;

      io.emit("newOrderNotification", {
        ...newNotification.toObject(),
        notificationId,
      });

      const pdfFilePath = path.join(
        __dirname,
        "../pdfs",
        `order_${order._id}.pdf`
      );
      const htmlContent = `
        <html>
        <body>
          <h2>Order Confirmation</h2>
          <p>Order ID: ${order._id}</p>
        </body>
        </html>
      `;

      await generatePDF(htmlContent, pdfFilePath);

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

      try {
        await fs.unlink(pdfFilePath);
        console.log(`PDF deleted: ${pdfFilePath}`);
      } catch (unlinkError) {
        console.error("Error deleting PDF:", unlinkError);
      }

      res.json({
        success: true,
        message: "Payment verified, notification sent, and email sent!",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res
        .status(400)
        .json({ success: false, message: "Payment failed. Order deleted." });
    }
  } catch (error) {
    console.error("Error in verifystripe:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Displaying orders in admin order page

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Displaying orders in user frontend panel in order page after user click on place order button

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId });

    return res.status(200).json({ success: true, orders }); // ✅ Use return
  } catch (error) {
    console.error("Error fetching user orders:", error);

    if (!res.headersSent) { // ✅ Prevent duplicate responses
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};


// Update order Status from admin

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetching address from order

const orderAddress = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID not found" });
    }

    const userId = req.body.userId;

    // Fetch the most recent address for the logged-in user
    const latestOrder = await orderModel
      .findOne({ userId })
      .sort({ updatedAt: -1 }) // Sort by latest update
      .select("address -_id");

    if (!latestOrder) {
      return res.json({
        success: true,
        message: "No address found",
        address: null,
      });
    }

    res.json({
      success: true,
      message: "Latest address",
      address: latestOrder.address,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
  verifystripe,
  orderAddress,
};
