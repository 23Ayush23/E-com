import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import SimpleNodemailer from "../config/simplenodemailer.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "ayush2323"; // Use environment variable
const RESET_SECRET = process.env.RESET_SECRET || "bfbskhbkjsdkjfhsjdhfjshjk";
// Ensure you have this in your env

// Create token for user with userID
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "60d" }); // Use JWT_SECRET environment variable
};

const createAdminToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "60d" });
};

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
      { expiresIn: "60m" }
    );
    // console.log("resetToken from forgot:",resetToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // console.log("ResetLink ::  ",resetLink);

    // console.log("Password reset link:", resetLink);

    return {
      success: true,
      message: "Reset Password email sent successfully",
      resetLink,
    };
  } catch (error) {
    console.log("Error sending password link:", error);
    return {
      success: false,
      message: "Error in sending reset password email!",
    };
  }
};

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

    const user = await userModel.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // console.log("Password reset successful!");
    return { success: true, message: "Password reset successfully!" };
  } catch (error) {
    console.log("Error resetting password:", error);
    return { success: false, message: "Error in resetting password!" };
  }
};

// User login route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter valid email i.e. abc@gmail.com",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User with this email doesn't exist!",
      });
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
};

// User registration route
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return res.json({
        success: false,
        message: "User already exists with this email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter valid email i.e. abc@gmail.com",
      });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password length should be minimum 6 characters",
      });
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
};

// Admin login route
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate admin credentials from environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a token with admin credentials and expiration time
      const token = createAdminToken({ email, password });
      return res.json({ success: true, message: "Admin logged in!", token });
    } else {
      return res
        .json({ success: false, message: "Unauthorized user!" });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot password route

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required!" });
  }

  try {
    const response = await sendPasswordLink(email);

    if (!response.success) {
      return res.status(404).json(response);
    }

    const templatePath = path.join(
      __dirname,
      "../EmailTemplates/resetPasswordlink.html"
    );

    // Send email with reset link
    await SimpleNodemailer(
      email,
      "Reset Your Password",
      "Click the link below to reset your password.",
      templatePath,
      { resetLink: response.resetLink }
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in sending password reset email:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error in sending password reset email!",
      });
  }
};

// Reset password route
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // console.log("Received Token in Backend:", token);
  // console.log("Received New Password:", newPassword);

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Token and new password are required!",
      });
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
    console.log("Error in resetting password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in resetting password!" });
  }
};

// display userData
const getUserData = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify token (ensure JWT_SECRET is set in your environment)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming the token contains the user id as "id"
    const userId = decoded.id;

    // Find the user by id (all details including password and cartData)
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete User Account from website
const removeAccount = async (req,res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

        const user = await userModel.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.json({ success: true, message: "Account deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error!" });
    }  
}
export {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  getUserData,
  removeAccount
};
