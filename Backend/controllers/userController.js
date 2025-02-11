import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import Nodemailer from '../config/nodemailer.js'
import dotenv from 'dotenv'





dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET || 'ayush2323'; // Use environment variable
const RESET_SECRET = process.env.RESET_SECRET || 'bfbskhbkjsdkjfhsjdhfjshjk';
// Ensure you have this in your env

// Create token for user with userID
const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '60d' }); // Use JWT_SECRET environment variable
}

// Send password reset link
const sendPasswordLink = async (email) => {
    try {
        const existUser = await userModel.findOne({ email });
        // console.log("Exist current User: ",existUser);
        

        if (!existUser) {
            return { success: false, message: "User not found with this email!" };
        }

        const resetToken = jwt.sign(
            { id: existUser._id, email: existUser.email },
            RESET_SECRET, 
            { expiresIn: '60m' }
        );
        // console.log("resetToken from forgot:",resetToken);
        

        const resetLink = `http://localhost:5174/reset-password?token=${resetToken}`;

        // console.log("Password reset link:", resetLink);

        return { success: true, message: "Reset Password email sent successfully", resetLink };
    } catch (error) {
        console.log("Error sending password link:", error);
        return { success: false, message: 'Error in sending reset password email!' };
    }
}

// Reset password link function
const resetPasswordLink = async (token, newPassword) => {
    try {

        // console.log("token before verification:",token);
        // console.log("reset token",reset_Token);
        // console.log("reset token",resetToken);
        
        
        // Verify the token
        const decoded = jwt.verify(token, RESET_SECRET);

        // console.log("Decoded token:", jwt.decode(token));

        // console.log("reset_Token",reset_Token);
        
        // console.log("decoded token:",decoded);
        

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });

        if (!user) {
            throw new Error("User not found");
        }

        // console.log("Password reset successful!");
        return { success: true, message: "Password reset successfully!" };
    } catch (error) {
        console.log("Error resetting password:", error);
        return { success: false, message: 'Error in resetting password!' };
    }
}

// User login route
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter valid email i.e. abc@gmail.com" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User with this email doesn't exist!" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Incorrect password!" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// User registration route
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter valid email i.e. abc@gmail.com" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password length should be minimum 6 characters" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hashedPass });
        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error during registration!" });
    }
}

// Admin login route
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, JWT_SECRET);
            return res.json({ success: true, message: "Admin logged in!", token });
        } else {
            return res.json({ success: false, message: "Unauthorized user!" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// Forgot password route

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required!" });
    }

    try {
        const response = await sendPasswordLink(email);

        if (!response.success) {
            return res.status(404).json(response);
        }

        // Send email with reset link
         Nodemailer(
            email,
            "Reset Your Password",
            "Click the link below to reset your password.",
            "../EmailTemplates/resetPasswordlink.html",
            { resetLink: response.resetLink }
        );

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in sending password reset email:", error);
        return res.status(500).json({ success: false, message: "Error in sending password reset email!" });
    }
};



// Reset password route
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    // console.log("Received Token in Backend:", token);
    // console.log("Received New Password:", newPassword);
    

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Token and new password are required!" });
    }

    try {
        const response = await resetPasswordLink(token, newPassword);
        // console.log("Response from resetPasswordLink:", response);
        if (response.success) {
            return res.status(200).json(response);
            

        } else {
            return res.status(404).json(response);
        }
    } catch (error) {
        console.log('Error in resetting password:', error);
        return res.status(500).json({ success: false, message: "Error in resetting password!" });
    }
}

export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword };
