import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white/80 p-12 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">404</p>
      <h1 className="text-3xl font-semibold text-slate-900">Page not built yet</h1>
      <p className="max-w-md text-sm text-slate-500">
        You discovered an upcoming feature. Check the project roadmap in `docs/project-plan.md` to
        see what ships next.
      </p>
      <Link
        to="/dashboard"
        className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;

