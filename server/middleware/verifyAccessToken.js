import { sendError } from '../utils/responseHandler.js';

// Example: restrictTo('free', 'elite')
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.subscriptionPlan;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return sendError(res, 'You are not authorized to access this feature', 403);
    }

    next();
  };
};
