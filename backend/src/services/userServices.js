import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateHashToken, generateRefreshToken } from '../utils/tokenUtils.js';
import User from '../models/userModel.js';

const register = async ({ name, email, password, role = "employee" }) => {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new Error("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
    const user = await User.create({ 
        name: name.trim(),
        email: email.toLowerCase(), 
        password: hashedPassword,
        role 
    }); // Save the user to the database
    const accessToken = generateAccessToken(user._id); // Generate an access token for the user
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken= generateHashToken(refreshToken); // Store the hashed refresh token in the database
    await user.save();
    return { accessToken, refreshToken, user };

}

// 🔐 Login user
const login = async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokenHash = generateHashToken(refreshToken);
    await user.save();
    return { user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, refreshToken, accessToken };
}



export { register, login };