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

const app = express();
const port = process.env.PORT || 2400;
dotenv.config();

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Socket.io Connection
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

  socket.on("orderPlaced", async (orderDetails) => {
    console.log("New order placed:", orderDetails);

    try {
      const newNotification = new NotificationModel({
        message: orderDetails.message,
        order: orderDetails.order,
        timestamp: new Date(),
      });

      await newNotification.save();
      io.emit("newOrderNotification", newNotification);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });

  socket.on("removeNotification", async (notificationId) => {
    try {
      await NotificationModel.findByIdAndDelete(notificationId);
      io.emit("notificationRemoved", notificationId);
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the WebSocket Server
server.listen(2500, () => {
  console.log("Socket.io server running on port 2500");
});

// App Config
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

// API Endpoints
app.get("/", (req, res) => {
  res.send("API Working!");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


// Start Express Server
app.listen(port, () =>
  console.log(`Server running successfully on port ${port}`)
);
