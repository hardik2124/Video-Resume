import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: function () {
      return !this.isGoogleAuth;
    },
  },
  subscriptionPlan: {
    type: String,
    default: 'free'
  },
  googleId: {
    type: String
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  role: {
    type: String, enum: ['free', 'premium', 'admin'], default: 'free'
  },
  resumeScripts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeScript' }
  ],
  videoResumes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'VideoResume' }
  ],
  resumes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }
  ],
  interviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' }
  ],
  feedbacks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }
  ],
  analytics: {
    type: mongoose.Schema.Types.ObjectId, ref: 'UserAnalytics'
  },
  createdAt: {
    type: Date, default: Date.now
  },
  // User schema (add this field)
  aiResumeGeneratedAt: { type: Date }, // track last use date


}, { timestamps: true });



const User = mongoose.model('User', userSchema);
export default User;