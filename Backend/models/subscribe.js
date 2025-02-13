import mongoose from "mongoose";

const SubscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        trim: true,
        lowercase: true,
        validate: {
            validator: (email) => /\S+@\S+\.\S+/.test(email), // Simple email regex validation
            message: "Enter a valid email address"
        }
    }
}, { timestamps: true, minimize: false });

const subscribeModel = mongoose.models.Subscribe || mongoose.model("Subscribe", SubscribeSchema);

export default subscribeModel;
