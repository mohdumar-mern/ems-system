// Protect Routes
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";

dotenv.config();

// =============================
// PROTECT MIDDLEWARE
// =============================
export const protect = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ message: 'No auth header' });

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.userId).select('-refreshTokenHash');
    if (!user) return res.status(401).json({ message: 'No user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// =============================
// ADMIN-ONLY MIDDLEWARE
// =============================
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({
    error: "Access denied, admin only",
  });
};
