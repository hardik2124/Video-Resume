const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const User = require("../models/User");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", verifyToken, async (req, res) => {
  const { jobTitle } = req.body;
  const userId = req.userId;

  if (!jobTitle) {
    return res.status(400).json({ error: "Job title is required." });
  }

  try {
    const user = await User.findById(userId);

    // Limit for Free user
    if (user.role === "free") {
      if (user.hasUsedScriptGenerator) {
        return res
          .status(403)
          .json({ error: "Free users can only generate 1 script." });
      }
      user.hasUsedScriptGenerator = true;
      await user.save();
    }

    const prompt = `Generate a professional resume summary script for someone applying as a "${jobTitle}". Keep it concise and impressive.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    const script = response.data.choices[0].text.trim();
    res.json({ script });
  } catch (err) {
    console.error("Script generation error:", err.message);
    res.status(500).json({ error: "Failed to generate resume script." });
  }
});

module.exports = router;
