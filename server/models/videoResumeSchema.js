import mongoose from 'mongoose';

const videoResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  scriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeScript',
    required: true,
  },

  // One of the 5 modes
  mode: {
    type: String,
    enum: ['SelfRecord', 'AIAvatar', 'VoiceoverOnly', 'CartoonAvatar', 'PracticeMode'],
    required: true,
  },

  // Common video URL (if any type uploads final video)
  videoUrl: { type: String },

  // Self Video Recorder
  transcript: { type: String }, // Optional subtitle
  teleprompterEnabled: { type: Boolean, default: true },

  // AI Avatar
  avatarImage: { type: String }, // User uploaded photo
  voiceType: {
    type: String,
    enum: ['Male', 'Female', 'Neutral', 'AI Enhanced'],
  },

  // Voiceover Only
  voiceRecordingUrl: { type: String },

  // Cartoon Avatar Settings
  cartoonAvatar: {
    avatarName: { type: String },
    avatarStyle: { type: String, enum: ['3D', '2D', 'Toon', 'Pixel', 'Realistic'] },
    avatarColor: { type: String, default: '#4F46E5' },
  },

  // Practice mode
  isPracticeOnly: { type: Boolean, default: false },

  // Theme customizations (used by SelfRecord, VoiceoverOnly, CartoonAvatar)
  theme: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    frameStyle: {
      type: String,
      enum: ['Simple', 'Rounded', 'Modern', 'Animated'],
      default: 'Simple',
    },
  },

  // Analytics (for dashboard)
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    averageWatchTime: { type: Number, default: 0 },
  },

  isPublished: { type: Boolean, default: false },
  isFinalized: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Draft', 'Processing', 'Ready', 'Error'],
    default: 'Draft',
  },

  cloudinaryPublicId: { type: String }, // Optional for cleanup
  createdAt: { type: Date, default: Date.now },
});

const VideoResume = mongoose.model('VideoResume', videoResumeSchema);
export default VideoResume;