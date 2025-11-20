import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  helper?: string;
  icon?: ReactNode;
}

const StatCard = ({ label, value, delta, helper, icon }: StatCardProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      {delta && <p className="text-sm font-semibold text-success">{delta}</p>}
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
};

export default StatCard;

