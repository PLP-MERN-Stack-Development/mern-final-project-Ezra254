import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const TopNav = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <p className="text-xl font-semibold text-slate-900">
            {user ? `${user.firstName} ${user.lastName}` : 'Athlete'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-100"
            onClick={() => navigate('/activity')}
          >
            Log activity
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={14} />
            Sign out
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold">
              {user?.firstName?.[0] ?? 'A'}
            </div>
            <div className="hidden text-sm text-slate-500 sm:block">
              {user?.email && <p className="font-medium text-slate-900">{user.email}</p>}
              <p>Goal: {user?.preferences?.weeklyGoal ?? 4} workouts/week</p>
            </div>
          </div>
        </div>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 focus-within:ring-2 focus-within:ring-primary-200">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search workouts, meals, metrics..."
          className="w-full border-none bg-transparent outline-none"
        />
      </label>
    </header>
  );
};

export default TopNav;

