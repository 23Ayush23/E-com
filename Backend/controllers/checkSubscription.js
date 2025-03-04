import subscribeModel from "../models/subscribe.js";

const checkSubscription = async (req, res) => {
  try {
    const userEmail = req.user?.email; // Ensure authentication

    if (!userEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please log in." });
    }

    const existSubscribe = await subscribeModel.findOne({ email: userEmail });

    return res
      .status(200)
      .json({ success: true, isSubscribed: !!existSubscribe });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error, please try again later",
      });
  }
};

export default checkSubscription;
