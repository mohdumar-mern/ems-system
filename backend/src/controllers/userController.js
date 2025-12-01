import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { login, register } from "../services/userServices.js";



const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
// 🔐 Register new user
export const registerController = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const {accessToken, refreshToken, user} = register({ name, email, password, role });
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ success: true, user, accessToken });



  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// 🔓 Login user
export const loginController = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, refreshToken, accessToken } = await login({ email, password });
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.status(200).json({ success: true, user, accessToken });
   

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// 🚪 Logout user
export const logout = expressAsyncHandler(async (req, res) => {
  try {
    // For JWT, logout is usually handled on client (by removing token)
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// 🔑 Forgot password (change password)
export const forgotPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Old password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
