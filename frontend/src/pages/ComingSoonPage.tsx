interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-10 text-center">
    <p className="text-xs uppercase tracking-[0.4em] text-primary-500">In progress</p>
    <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
    <p className="mt-4 text-xs text-slate-400">
      Follow the milestone plan in `docs/project-plan.md` for delivery dates.
    </p>
  </div>
);

export default ComingSoonPage;

