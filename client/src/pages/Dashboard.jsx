import AnalyticsCard from '@/components/AnalyticsCard';
import ResumeCard from '@/components/ResumeCard ';
import React from 'react';
import { FaDownload, FaEye, FaFileAlt, FaMousePointer } from 'react-icons/fa';

const Dashboard = () => {

  
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">👋 Welcome, Hardik!</h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnalyticsCard title="Views" value="1,204" icon={<FaEye />} />
        <AnalyticsCard title="Clicks" value="380" icon={<FaMousePointer />} />
        <AnalyticsCard title="Downloads" value="98" icon={<FaDownload />} />
        <AnalyticsCard title="Resumes" value="3" icon={<FaFileAlt />} />
      </div>

      {/* Video Resume List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🎥 Your Resumes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResumeCard
            title="Frontend Developer Resume"
            date="June 20, 2025"
            views={200}
            downloads={18}
            link="/resume/123"
          />
          {/* more cards */}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl">
        💡 Tip: You can improve your resume by adding a project section.
      </div>
    </div>

  );
};

export default Dashboard;
