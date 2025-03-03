import notificationModel from "../models/notificationModel.js";

const getNotification = async (req, res) => {
  try {


    const notifications = await notificationModel.find().sort({timestamp: -1}).limit(20);
    res.json({success:true,notifications})
  } catch (error) {
    console.error("Error removing notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


  export default getNotification