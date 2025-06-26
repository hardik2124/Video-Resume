// src/pages/ResumeScriptGenerator.jsx
import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

const ResumeScriptGenerator = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: '',
    skills: '',
    strengths: '',
    achievements: '',
  });

  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dummy API simulation
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setScript(data.script || 'Demo Script: Hi, I am John Doe...');
    } catch (err) {
      console.error('Error generating script:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    alert('Script copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 Generate Resume Script</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow">
        <input name="jobTitle" required placeholder="Job Title *" className="input-field" value={formData.jobTitle} onChange={handleChange} />
        <input name="experience" placeholder="Experience" className="input-field" value={formData.experience} onChange={handleChange} />
        <input name="skills" placeholder="Skills" className="input-field" value={formData.skills} onChange={handleChange} />
        <input name="strengths" placeholder="Strengths" className="input-field" value={formData.strengths} onChange={handleChange} />
        <input name="achievements" placeholder="Achievements" className="input-field" value={formData.achievements} onChange={handleChange} />

        <button type="submit" className="btn-primary mt-4">{loading ? 'Generating...' : 'Generate Script'}</button>
      </form>

      {script && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow border">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Generated Script:</h2>
            <button onClick={handleCopy} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              <FaCopy /> Copy
            </button>
          </div>
          <p className="text-gray-800 whitespace-pre-line">{script}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeScriptGenerator;
