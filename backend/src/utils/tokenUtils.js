import jwt from 'jsonwebtoken'
import crypto from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'defaultaccesstokensecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'defaultrefreshtokensecret';


export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
}

export const generateHashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}