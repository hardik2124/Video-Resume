import { FaEye, FaDownload, FaLink, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ResumeCard = ({ title, date, views, downloads, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-all">
      {/* Resume Title & Date */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Created: {date}</p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <FaEye /> {views}
        </span>
        <span className="flex items-center gap-1">
          <FaDownload /> {downloads}
        </span>
        <span className="flex items-center gap-1">
          <FaLink /> Link
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:underline"
        >
          View
        </a>
        <Link
          to={`/edit-resume/${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
        >
          <FaEdit className="mr-1" />
          Edit
        </Link>
        <button className="text-sm text-green-600 hover:underline">
          Download
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
