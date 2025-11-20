import { NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import clsx from 'clsx';
import { Activity, BarChart3, Cog, Home } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, to: '/dashboard' },
  { label: 'Activity', icon: Activity, to: '/activity' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Settings', icon: Cog, to: '/settings' },
];

const Sidebar = () => {
  const items = useMemo(() => navItems, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 font-semibold">
          VT
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">VitalTrack</p>
          <p className="text-xs text-slate-500">Health & Fitness</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white shadow-card">
        <p className="text-sm font-medium">Weekly Goal</p>
        <p className="text-2xl font-semibold mt-1">4 workouts</p>
        <p className="text-xs text-white/70">You are 2 sessions away</p>
      </div>
    </aside>
  );
};

export default Sidebar;

