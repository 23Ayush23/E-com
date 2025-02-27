import notificationModel from "../models/notificationModel.js";

const removeNotification = async (req, res) => {
    try {
      const { id } = req.body; // Extract ID from body
  
      if (!id) {
        return res.status(400).json({ success: false, message: "Notification ID is required" });
      }
  
      const deletedNotification = await notificationModel.findByIdAndDelete(id);
  
      if (!deletedNotification) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
  
      res.status(200).json({ success: true, message: "Notification removed successfully" });
    } catch (error) {
      console.error("Error removing notification:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  export default removeNotification