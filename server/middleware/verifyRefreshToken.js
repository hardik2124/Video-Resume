import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHandler.js';

export const verifyRefreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) return sendError(res, 'No refresh token found', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendError(res, 'Invalid refresh token', 403);
  }
};

