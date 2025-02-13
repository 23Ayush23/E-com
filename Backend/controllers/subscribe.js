import validator from 'validator';
import subscribeModel from '../models/subscribe.js';

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate Email Format First
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email i.e. abc@gmail.com" });
        }

        // Check if Email Already Exists
        const existSubscribe = await subscribeModel.findOne({ email });

        if (existSubscribe) {
            return res.status(400).json({ success: false, message: "User already subscribed with this email" });
        }

        // Save New Subscriber
        const newSub = new subscribeModel({ email });
        await newSub.save();

        return res.status(201).json({ success: true, message: "Subscription successful!" });
    } catch (error) {
        console.error("Error subscribing user:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

export default subscribe;
