import { sendError } from '../../utils/responseHandler.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role || 'user';  // Default role if not set

    if (!allowedRoles.includes(userRole)) {
      return sendError(res, 'You are not authorized to access this resource', 403);
    }

    next();
  };
};
