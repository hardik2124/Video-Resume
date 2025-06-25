import { FaEye, FaMousePointer, FaDownload, FaChartBar } from 'react-icons/fa';

const iconMap = {
  views: <FaEye className="text-blue-500 text-xl" />,
  clicks: <FaMousePointer className="text-green-500 text-xl" />,
  downloads: <FaDownload className="text-purple-500 text-xl" />,
  performance: <FaChartBar className="text-yellow-500 text-xl" />,
};

const AnalyticsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-all">
      <div className="bg-gray-100 rounded-full p-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default AnalyticsCard;
