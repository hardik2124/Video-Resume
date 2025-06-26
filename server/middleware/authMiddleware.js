import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorized, no token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user and attach to req
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User not found or token invalid', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return sendError(res, 'Not authorized, token failed', 401);
  }
};
