import mongoose from 'mongoose';

const resumeScriptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Basic Info
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },

  // Career Targeting
  jobTitle: {
    type: String,
    required: true,
    enum: [
      'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'Data Scientist', 'AI/ML Engineer', 'Product Manager', 'UI/UX Designer', 'Marketing Specialist',
      'Sales Executive', 'Business Analyst', 'DevOps Engineer', 'Cybersecurity Analyst',
      'QA Engineer', 'Technical Writer', 'Cloud Architect', 'Mobile App Developer'
    ]
  },
  industry: {
    type: String,
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
      'Real Estate', 'E-commerce', 'Logistics', 'Manufacturing', 'Energy',
      'Entertainment', 'Consulting', 'Government'
    ]
  },
  locationPreference: { type: String },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'],
    default: 'Fresher'
  },

  // Work Experience
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      responsibilities: String,
    }
  ],

  // Education Background
  education: [
    {
      degree: String,
      fieldOfStudy: String,
      institution: String,
      graduationYear: String
    }
  ],

  // Extras
  certifications: [String],
  skills: [String],
  languages: [String],
  hobbies: [String],

  // Projects
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      link: String
    }
  ],

  // AI Parameters
  language: {
    type: String,
    enum: [
      'English', 'Hindi', 'Gujarati', 'Spanish', 'French', 'German', 'Chinese',
      'Arabic', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Italian', 'Dutch',
      'Bengali', 'Punjabi', 'Marathi', 'Telugu', 'Tamil', 'Urdu', 'Malayalam',
      'Kannada', 'Odia', 'Assamese', 'Sindhi', 'Bhojpuri', 'Maithili', 'Nepali',
      'Sinhala', 'Thai', 'Vietnamese', 'Filipino', 'Hebrew', 'Turkish', 'Greek',
      'Polish', 'Czech', 'Hungarian', 'Swedish', 'Danish', 'Finnish', 'Norwegian',
      'Ukrainian', 'Romanian', 'Slovak', 'Bulgarian', 'Croatian', 'Serbian',
      'Malay', 'Indonesian', 'Swahili', 'Zulu', 'Xhosa', 'Afrikaans',
      'Persian (Farsi)', 'Pashto', 'Kurdish', 'Armenian', 'Georgian',
      'Mongolian', 'Kazakh', 'Uzbek', 'Azerbaijani', 'Tajik', 'Turkmen',
      'Amharic', 'Somali', 'Tigrinya', 'Hausa', 'Yoruba', 'Igbo',
      'Hmong', 'Lao', 'Burmese', 'Khmer', 'Tibetan',
      'Mandarin Chinese', 'Cantonese Chinese',
      'Basque', 'Catalan', 'Galician', 'Welsh', 'Irish', 'Scottish Gaelic',
      'Haitian Creole', 'Javanese', 'Sundanese', 'Tagalog',
      'Esperanto', 'Latin', 'Luxembourgish', 'Icelandic', 'Estonian', 'Lithuanian', 'Latvian'
    ],
    default: 'English'
  },
  tone: {
    type: String,
    enum: ['Professional', 'Friendly', 'Confident', 'Conversational', 'Persuasive'],
    default: 'Professional'
  },
  voiceStyle: {
    type: String,
    enum: ['Male', 'Female', 'Neutral', 'AI Enhanced'],
    default: 'Neutral'
  },
  scriptGoal: {
    type: String,
    enum: ['Job Application', 'Portfolio', 'Internship', 'Freelancing Pitch'],
    default: 'Job Application'
  },

  resumeText: { type: String },            // Input (raw pasted or extracted resume)
  generatedScript: { type: String },       // Output AI-generated video resume script

  // New Fields 🔥
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeTemplate',                 // reference to frontend resume theme
  },
  videoResumes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoResume'
    }
  ],
  isLinkedToPublicProfile: {
    type: Boolean,
    default: false,
  },
  isUsedForVideo: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ['Draft', 'Generated', 'Finalized'],
    default: 'Draft'
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ResumeScript', resumeScriptSchema);
