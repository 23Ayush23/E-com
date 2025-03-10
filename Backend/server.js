import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { Server } from "socket.io";
import { createServer } from "http";
import NotificationModel from "./models/notificationModel.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 2400;

// Create HTTP server for WebSocket
const server = createServer(app);

// Configure CORS for Express
const allowedOrigins = [
  "https://frontend-iota-seven-85.vercel.app", // Your frontend URL
  "http://localhost:2400", // For local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Initialize WebSocket server
export const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for WebSocket (or specify your frontend URL)
    methods: ["GET", "POST"],
  },
});

// WebSocket Connection
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Fetch existing notifications from MongoDB
  try {
    const existingNotifications = await NotificationModel.find()
      .sort({ timestamp: -1 })
      .limit(20);
    socket.emit("loadNotifications", existingNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }

  // Handle new order placement
  socket.on("orderPlaced", async (orderDetails) => {
    console.log("New order placed:", orderDetails);

    try {
      const newNotification = new NotificationModel({
        message: orderDetails.message,
        order: orderDetails.order,
        timestamp: new Date(),
      });

      await newNotification.save();
      io.emit("newOrderNotification", newNotification.toObject());
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });

  // Handle notification removal
  socket.on("removeNotification", async (notificationId) => {
    try {
      await NotificationModel.findByIdAndDelete(notificationId);
      io.emit("notificationRemoved", notificationId);
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start WebSocket server
server.listen(2500, () => {
  console.log("Socket.io server running on port 2500");
});

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// API Endpoints
app.get("/", (req, res) => {
  res.send("API Working!");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Start Express server
app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});