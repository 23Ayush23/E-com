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

dotenv.config();
const app = express();
const port = process.env.PORT || 2400;

// App Config
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working!");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


// WebSocket Setup
const server = createServer(app);

const allowedOrigins = [
  "https://frontend-iota-seven-85.vercel.app", 
  "https://admin-three-plum.vercel.app",
];
export const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) {
        console.log("CORS Warning: Request with no origin detected.");
        return callback(null, true); // Allow no-origin requests
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    
    methods: ["GET", "POST","DELETE", "PUT", "OPTIONS"],
  },
});



io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  try {
    const existingNotifications = await NotificationModel.find()
      .sort({ timestamp: -1 })
      .limit(20);
    socket.emit("loadNotifications", existingNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }

  socket.on("orderPlaced", async (orderDetails) => {
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

// Start WebSocket server
server.listen(2400, () => {
  console.log("Socket.io server running on port 2400");
});



// Export Express App for Vercel
export default app;
