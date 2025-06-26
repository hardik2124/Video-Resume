import mongoose from 'mongoose';

const resumeTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // E.g., "Modern Blue", "Minimalist", "Corporate Classic"
  },

  category: {
    type: String,
    enum: ['Modern', 'Minimalist', 'Creative', 'Corporate', 'Infographic', 'Elegant'],
    default: 'Modern',
  },

  themeColor: {
    type: String,
    default: '#4F46E5', // Tailwind indigo-600
  },
  previewImage: { type: String }, // Cloudinary URL or local path
  htmlContent: { type: String, required: true }, // raw HTML string with placeholders
  cssContent: { type: String }, // optional: embedded CSS

  thumbnailUrl: {
    type: String,
    required: true, // Small preview image URL
  },

  previewUrl: {
    type: String,
    required: true, // Full-sized template preview
  },

  fileFormat: {
    type: String,
    enum: ['PDF', 'DOCX', 'HTML'],
    default: 'PDF',
  },

  isPremium: {
    type: Boolean,
    default: false, // Show only to premium users
  },

  isActive: {
    type: Boolean,
    default: true, // Admin can disable template without deleting
  },

  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ResumeTemplate', resumeTemplateSchema);
