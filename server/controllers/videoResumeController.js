import VideoResume from '../models/VideoResume.js';
import ResumeScript from '../models/ResumeScript.js';
import { sendError, sendSuccess } from '../utils/responseHandler.js';

/**
 * Generate a video resume
 * - Currently supports: SelfRecord
 * - Future support: AIAvatar, VoiceoverOnly, CartoonAvatar, PracticeMode
 */
export const generateVideoResume = async (req, res) => {
  try {
    const {
      scriptId,
      mode, // SelfRecord, AIAvatar, VoiceoverOnly, CartoonAvatar, PracticeMode
      videoUrl,
      transcript,
      teleprompterEnabled = true,
      avatarImage,
      voiceType,
      voiceRecordingUrl,
      cartoonAvatar = {},
      isPracticeOnly = false,
      theme = {},
    } = req.body;

    // Validation
    if (!scriptId || !mode) {
      return sendError(res, 'Missing required fields: scriptId and mode', 400);
    }

    const validModes = ['SelfRecord', 'AIAvatar', 'VoiceoverOnly', 'CartoonAvatar', 'PracticeMode'];
    if (!validModes.includes(mode)) {
      return sendError(res, 'Invalid video mode', 400);
    }

    const script = await ResumeScript.findOne({ _id: scriptId, user: req.user._id });
    if (!script) {
      return sendError(res, 'Resume script not found or unauthorized', 404);
    }

    // Construct common video resume object
    const videoResumeData = {
      user: req.user._id,
      scriptId,
      mode,
      status: 'Ready',
      isPublished: false,
      isFinalized: true,
      theme: {
        backgroundColor: theme.backgroundColor || '#ffffff',
        textColor: theme.textColor || '#000000',
        frameStyle: theme.frameStyle || 'Simple',
      }
    };

    // 🎥 Mode: SelfRecord
    if (mode === 'SelfRecord') {
      if (!videoUrl) return sendError(res, 'videoUrl is required for SelfRecord mode', 400);

      videoResumeData.videoUrl = videoUrl;
      videoResumeData.transcript = transcript;
      videoResumeData.teleprompterEnabled = teleprompterEnabled;
    }

    // 🧠 Mode: AIAvatar
    else if (mode === 'AIAvatar') {
      if (!avatarImage || !voiceType) {
        return sendError(res, 'avatarImage and voiceType are required for AIAvatar mode', 400);
      }

      videoResumeData.avatarImage = avatarImage;
      videoResumeData.voiceType = voiceType;
      // You would trigger AI generation process here (external service)
    }

    // 🎙️ Mode: VoiceoverOnly
    else if (mode === 'VoiceoverOnly') {
      if (!voiceRecordingUrl) return sendError(res, 'voiceRecordingUrl is required for VoiceoverOnly mode', 400);
      videoResumeData.voiceRecordingUrl = voiceRecordingUrl;
    }

    // 🤖 Mode: CartoonAvatar
    else if (mode === 'CartoonAvatar') {
      const { avatarName, avatarStyle, avatarColor } = cartoonAvatar;
      if (!avatarName || !avatarStyle) {
        return sendError(res, 'avatarName and avatarStyle required for CartoonAvatar mode', 400);
      }

      videoResumeData.cartoonAvatar = {
        avatarName,
        avatarStyle,
        avatarColor: avatarColor || '#4F46E5'
      };
    }

    // 🧪 Mode: PracticeMode
    else if (mode === 'PracticeMode') {
      videoResumeData.isPracticeOnly = true;
      videoResumeData.status = 'Draft';
    }

    // Save video resume
    const videoResume = new VideoResume(videoResumeData);
    const savedVideo = await videoResume.save();

    // Link to ResumeScript
    script.videoResumes.push(savedVideo._id);
    script.isUsedForVideo = true;
    await script.save();

    return sendSuccess(res, savedVideo, 'Video resume generated successfully');

  } catch (error) {
    console.error('Video Resume Error:', error);
    return sendError(res, 'Failed to generate video resume', 500, error.message);
  }
};

/**
 * Get all video resumes for a user
 */
export const getAllVideoResumes = async (req, res) => {
  try {
    const videos = await VideoResume.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, videos, 'Fetched all video resumes');
  } catch (error) {
    return sendError(res, 'Failed to fetch video resumes', 500, error.message);
  }
};

/**
 * Get single video resume by ID
 */
export const getVideoResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoResume.findOne({ _id: id, user: req.user._id });

    if (!video) return sendError(res, 'Video resume not found or unauthorized', 404);
    return sendSuccess(res, video, 'Fetched video resume');
  } catch (error) {
    return sendError(res, 'Failed to fetch video resume', 500, error.message);
  }
};

/**
 * Delete video resume
 */
export const deleteVideoResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VideoResume.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) return sendError(res, 'Video resume not found or unauthorized', 404);
    return sendSuccess(res, deleted, 'Deleted video resume successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete video resume', 500, error.message);
  }
};
