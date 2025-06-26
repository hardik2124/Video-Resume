import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFileAlt, FaVideo, FaChartBar, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { logoutUser } from '@/features/auth/authSlice';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Toggle drawer open/close

  const navItemClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200';

  const navItems = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/resume-script', icon: <FaFileAlt />, label: 'Resume Script' },
    { to: '/create-video', icon: <FaVideo />, label: 'Video Resume' },
    { to: '/analytics', icon: <FaChartBar />, label: 'Analytics' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <aside className={`h-screen bg-white border-r shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} px-4 py-6`}>
      {/* Toggle Button */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 shadow-md transition-all duration-300"
          title="Toggle Menu"
        >
          <FaBars size={25} />
        </button>

        {isOpen && (
          <h2 className="text-xl font-bold text-indigo-600 whitespace-nowrap">🎥 VideoResume</h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${navItemClasses} ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'}`
            }
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-lg">{icon}</span>
              <span
                className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  }`}
              >
                {label}
              </span>
            </div>
          </NavLink>
        ))}

      </nav>
      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className={`${navItemClasses} flex justify-center text-red-600 hover:bg-red-100 mt-auto w-full`}
      >
        <div className="flex items-center gap-3 w-full">
          <FaSignOutAlt className="text-lg" />
          {isOpen && <span className="whitespace-nowrap">Logout</span>}
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
