import ResumeScript from '../models/ResumeScript.js';
import User from '../models/User.js';
import openai from '../utils/openai.js';
import { sendError, sendSuccess } from '../utils/responseHandler.js';

export const generateAIResumeFromScratch = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      jobTitle,
      industry,
      locationPreference,
      experienceLevel,
      experience = [],
      education = [],
      certifications = [],
      skills = [],
      languages = [],
      hobbies = [],
      projects = [],
      language = 'English',
      tone = 'Professional',
      voiceStyle = 'Neutral',
      scriptGoal = 'Job Application'
    } = req.body;

    // Validation (only essential fields)
    if (!fullName || !jobTitle || !experience.length || !skills.length) {
      return sendError(res, 'Missing required fields (fullName, jobTitle, experience, skills)', 400);
    }

    // Step 1: Prepare prompt for GPT
    const prompt = `
Write a professional, friendly, and engaging video resume script in first-person for the following individual:

Full Name: ${fullName}
Job Title: ${jobTitle}
Industry: ${industry}
Experience Level: ${experienceLevel}
Location Preference: ${locationPreference}
Experience Summary: ${experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join(', ')}
Education: ${education.map(e => `${e.degree} in ${e.fieldOfStudy} from ${e.institution} (${e.graduationYear})`).join(', ')}
Certifications: ${certifications.join(', ')}
Skills: ${skills.join(', ')}
Languages: ${languages.join(', ')}
Hobbies: ${hobbies.join(', ')}
Projects: ${projects.map(p => `${p.title}: ${p.description}`).join(', ')}

Tone: ${tone}
Voice Style: ${voiceStyle}
Goal: ${scriptGoal}
Language: ${language}

Keep it under 90 seconds of spoken time.
`;

    // Step 2: Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const aiScript = completion.choices[0].message.content;

    // Step 3: Save to ResumeScript
    const script = new ResumeScript({
      user: req.user._id,
      fullName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      jobTitle,
      industry,
      locationPreference,
      experienceLevel,
      experience,
      education,
      certifications,
      skills,
      languages,
      hobbies,
      projects,
      language,
      tone,
      voiceStyle,
      scriptGoal,
      resumeText: '', // optional
      generatedScript: aiScript,
      status: 'Generated'
    });

    const saved = await script.save();

    // Step 4: Set aiResumeUsed = true if free user
    const user = await User.findById(req.user._id);
    if (user.subscriptionPlan === 'free') {
      user.aiResumeGeneratedAt = new Date(); // save timestamp
      await user.save();
    }

    return sendSuccess(res, saved, 'AI resume script generated successfully');

  } catch (error) {
    console.error('AI Resume Error:', error);
    return sendError(res, 'Failed to generate resume script', 500, error.message);
  }
};

export const regenerateAIResumeScript = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing resume script (must belong to the user)
    const script = await ResumeScript.findOne({ _id: id, user: req.user._id });

    if (!script) return sendError(res, 'Resume script not found or unauthorized', 404);

    // Step 1: Prepare prompt using existing data
    const prompt = `
Regenerate a professional, friendly, and engaging video resume script in first-person for the following individual:

Full Name: ${script.fullName}
Job Title: ${script.jobTitle}
Industry: ${script.industry}
Experience Level: ${script.experienceLevel}
Location Preference: ${script.locationPreference}
Experience Summary: ${script.experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join(', ')}
Education: ${script.education.map(e => `${e.degree} in ${e.fieldOfStudy} from ${e.institution} (${e.graduationYear})`).join(', ')}
Certifications: ${script.certifications.join(', ')}
Skills: ${script.skills.join(', ')}
Languages: ${script.languages.join(', ')}
Hobbies: ${script.hobbies.join(', ')}
Projects: ${script.projects.map(p => `${p.title}: ${p.description}`).join(', ')}

Tone: ${script.tone}
Voice Style: ${script.voiceStyle}
Goal: ${script.scriptGoal}
Language: ${script.language}

Keep it under 90 seconds of spoken time.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const regeneratedScript = completion.choices[0].message.content;

    // Update the script
    script.generatedScript = regeneratedScript;
    script.status = 'Generated';
    await script.save();

    return sendSuccess(res, script, 'Resume script regenerated successfully');
  } catch (error) {
    console.error('Regeneration Error:', error);
    return sendError(res, 'Failed to regenerate resume script', 500, error.message);
  }
};



export const getAllResumeScripts = async (req, res) => {
  try {
    const scripts = await ResumeScript.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, scripts, 'Fetched all resume scripts');
  } catch (error) {
    return sendError(res, 'Failed to fetch scripts', 500, error.message);
  }
};


export const getResumeScriptById = async (req, res) => {
  try {
    const { id } = req.params;
    const script = await ResumeScript.findOne({ _id: id, user: req.user._id });

    if (!script) return sendError(res, 'Resume script not found', 404);

    return sendSuccess(res, script, 'Fetched resume script');
  } catch (error) {
    return sendError(res, 'Failed to get resume script', 500, error.message);
  }
};

export const updateResumeScript = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ResumeScript.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) return sendError(res, 'Resume script not found or unauthorized', 404);

    return sendSuccess(res, updated, 'Resume script updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update resume script', 500, error.message);
  }
};

export const deleteResumeScript = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ResumeScript.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) return sendError(res, 'Resume script not found or unauthorized', 404);

    return sendSuccess(res, deleted, 'Resume script deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete resume script', 500, error.message);
  }
};