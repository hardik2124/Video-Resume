import Sidebar from '@/components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50 p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
