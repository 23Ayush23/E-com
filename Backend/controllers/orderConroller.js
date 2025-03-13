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
    if (!userId || !items || items.length === 0 || !address || !amount) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    for (const item of items) {
      if (!item.itemId || typeof item.itemId !== "string") {
        return res.status(400).json({ success: false, message: `Invalid item ID for product: ${item.name}` });
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

    await Promise.all(
      items.map(async (item) => {
        const updatedProduct = await productModel.findByIdAndUpdate(
          item.itemId,
          { $inc: { productStock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Product not found: ${item.itemId}`);
        }

        if (updatedProduct.productStock < 0) {
          throw new Error(`Insufficient stock for product: ${updatedProduct.name}`);
        }
      })
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const notificationData = {
      order: newOrder._id,
      message: `New Order received from ${user.userName}`,
      orderId: newOrder._id,
      amount: newOrder.amount,
      items: newOrder.items.map((item) => ({ name: item.name, quantity: item.quantity })),
      address: `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`,
      timestamp: new Date().toISOString(),
    };

    const newNotification = new NotificationModel(notificationData);
    await newNotification.save();

    res.json({
      success: true,
      message: "Order Placed Successfully!",
      orderId: newOrder._id,
      notificationId: newNotification._id,
    });

    io.emit("newOrderNotification", { ...newNotification.toObject(), notificationId: newNotification._id });

    try {
      const pdfBuffer = await generatePdf(newOrder);
      await sendEmail(
        user.email,
        "Payment Successful for Your Order",
        "Order Details",
        {
          _id: newOrder._id,
          userName: user.userName,
          paymentMethod: newOrder.paymentMethod,
          amount: newOrder.amount,
          address: address,
          items: newOrder.items,
        },
        pdfBuffer
      );
    } catch (pdfError) {
      console.error("Error generating or sending PDF:", pdfError);
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

//      await generatePDF(htmlContent, pdfFilePath);

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
//        pdfFilePath
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
