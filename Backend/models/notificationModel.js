import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  order: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), index: { expires: 172800 } }
});

export default mongoose.model("Notification", NotificationSchema);
