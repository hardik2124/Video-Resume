import { sendError } from '../utils/responseHandler.js';

export const limitAIResumeGeneratorForFree = (req, res, next) => {
  const user = req.user;

  if (user.subscriptionPlan !== 'free') return next();

  const now = new Date();
  const lastUsed = user.aiResumeGeneratedAt;

  if (lastUsed) {
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    if (lastUsed > oneMonthAgo) {
      return sendError(res, 'Free users can only generate one AI resume per month. Please wait or upgrade.', 403);
    }
  }

  next();
};
