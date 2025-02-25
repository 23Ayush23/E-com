import mongoose from "mongoose";
import { type } from "os";

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  order: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: {type: Date, index: { expires: "7d"}}
});

export default mongoose.model("Notification", NotificationSchema);
