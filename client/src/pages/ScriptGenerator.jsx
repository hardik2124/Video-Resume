import { generateScript } from '@/features/resumeScript/resumeScriptSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { generateResumeScript } from '@/features/resumeScript/resumeScriptSlice';

// Enums from backend schema
const jobTitles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'AI/ML Engineer', 'Product Manager', 'UI/UX Designer', 'Marketing Specialist',
  'Sales Executive', 'Business Analyst', 'DevOps Engineer', 'Cybersecurity Analyst',
  'QA Engineer', 'Technical Writer', 'Cloud Architect', 'Mobile App Developer'
];
const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Real Estate', 'E-commerce', 'Logistics', 'Manufacturing', 'Energy',
  'Entertainment', 'Consulting', 'Government'
];
const experienceLevels = [
  'Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'
];
const languages = [
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
];
const tones = ['Professional', 'Friendly', 'Confident', 'Conversational', 'Persuasive'];
const voiceStyles = ['Male', 'Female', 'Neutral', 'AI Enhanced'];
const scriptGoals = ['Job Application', 'Portfolio', 'Internship', 'Freelancing Pitch'];
const statuses = ['Draft', 'Generated', 'Finalized'];

const ResumeScriptForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error, script } = useSelector((state) => state.resumeScript);

  

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    jobTitle: '',
    industry: '',
    locationPreference: '',
    experienceLevel: 'Fresher',
    language: 'English',
    tone: 'Professional',
    voiceStyle: 'Neutral',
    scriptGoal: 'Job Application',
    status: 'Draft'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken'); 
    dispatch(generateScript(formData,token));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📄 AI Resume Script Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" onChange={handleChange} value={formData.fullName} placeholder="Full Name" className="input" required />
          <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="input" />
          <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone" className="input" />
          <input name="linkedin" onChange={handleChange} value={formData.linkedin} placeholder="LinkedIn" className="input" />
          <input name="github" onChange={handleChange} value={formData.github} placeholder="GitHub" className="input" />
          <input name="portfolio" onChange={handleChange} value={formData.portfolio} placeholder="Portfolio" className="input" />
          <select name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="input">
            <option value="">Select Job Title</option>
            {jobTitles.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="industry" value={formData.industry} onChange={handleChange} className="input">
            <option value="">Select Industry</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="input">
            {experienceLevels.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
          <input name="locationPreference" value={formData.locationPreference} onChange={handleChange} placeholder="Location Preference" className="input" />
          <select name="language" value={formData.language} onChange={handleChange} className="input">
            {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <select name="tone" value={formData.tone} onChange={handleChange} className="input">
            {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
          </select>
          <select name="voiceStyle" value={formData.voiceStyle} onChange={handleChange} className="input">
            {voiceStyles.map((voice) => <option key={voice} value={voice}>{voice}</option>)}
          </select>
          <select name="scriptGoal" value={formData.scriptGoal} onChange={handleChange} className="input">
            {scriptGoals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
          </select>
          <select name="status" value={formData.status} onChange={handleChange} className="input">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button type="submit" className="btn-primary">Generate Script</button>
      </form>

      {isLoading && <p>⏳ Generating script...</p>}
      {error && <p className="text-red-500">❌ Error: {error}</p>}
      {script && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">🎉 Generated Script</h3>
          <pre className="whitespace-pre-wrap text-sm">{script.generatedScript}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeScriptForm;
