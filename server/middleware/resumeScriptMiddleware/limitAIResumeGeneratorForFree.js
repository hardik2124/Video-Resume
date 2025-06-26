// import User from '';
import ResumeScript from '../../models/ResumeScript.js';
import User from '../../models/user.js';
import { sendError } from '../../utils/responseHandler.js';

export const limitAIResumeGeneratorForFree = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Skip check if premium or admin
    if (user.role !== 'free') return next();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const countThisMonth = await ResumeScript.countDocuments({
      user: req.user._id,
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    if (countThisMonth >= 1) {
      return sendError(
        res,
        'Free plan users can generate only 1 AI resume script per month. Upgrade to premium for unlimited access.',
        403
      );
    }

    return next();
  } catch (error) {
    console.error('Limit Check Error:', error);
    return sendError(res, 'Server error while checking generation limit', 500, error.message);
  }
};
