import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import TopNav from '../components/navigation/TopNav';
import { useRealtimeSync } from '../hooks/useRealtime';

const AppLayout = () => {
  useRealtimeSync();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopNav />
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

