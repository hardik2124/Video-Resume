import ResumeScript from '../../models/resumeScriptSchema.js';
import User from '../../models/User.js';
import { sendError } from '../../utils/responseHandler.js';

export const limitAIResumeGeneratorForFree = async (req, res, next) => {
  const user = req.user;

  if (user.subscriptionPlan === 'free') {
    const currentUser = await User.findById(user._id);
    if (currentUser.aiResumeUsed) {
      return sendError(res, 'Free users can only generate an AI Resume once. Upgrade to Elite for unlimited use.', 403);
    }
  }

  next();
};

export const limitResumeScriptCreationForFree = async (req, res, next) => {
  const user = req.user;

  if (user.subscriptionPlan === 'free') {
    const count = await ResumeScript.countDocuments({ user: user._id });
    if (count >= 1) {
      return sendError(res, 'Free users can only create one resume script. Upgrade to Elite to unlock more.', 403);
    }
  }

  next();
};
