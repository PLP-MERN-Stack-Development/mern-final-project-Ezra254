import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

const ChartCard = ({ title, subtitle, action, children }: ChartCardProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{subtitle}</p>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

export default ChartCard;

