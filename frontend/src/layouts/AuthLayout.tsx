import { Outlet, NavLink } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl shadow-primary-100/50">
        <div className="mb-8 flex flex-col gap-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 font-semibold">
            VT
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">VitalTrack</h1>
          <p className="text-sm text-slate-500">Your holistic fitness companion</p>
        </div>
        <Outlet />
        <p className="mt-6 text-center text-sm text-slate-500">
          <NavLink className="text-primary-600 hover:underline" to="/dashboard">
            Back to dashboard preview
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;

