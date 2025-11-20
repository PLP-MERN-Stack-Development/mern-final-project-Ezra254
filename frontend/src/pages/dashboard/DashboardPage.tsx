import { TrendingUp, Flame, Droplets, Target } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import { useWeeklyGoalSummary } from '../../hooks/useGoals';
import { usePlans, usePlanSummary } from '../../hooks/usePlans';
import { useWorkoutSummary } from '../../hooks/useWorkouts';

const fallbackWeeklyVolume = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 35 },
  { day: 'Fri', minutes: 0 },
  { day: 'Sat', minutes: 55 },
  { day: 'Sun', minutes: 40 },
];

const macroSplit = [
  { name: 'Protein', value: 95, fill: '#2a7ef4' },
  { name: 'Carbs', value: 180, fill: '#8abfff' },
  { name: 'Fats', value: 65, fill: '#f4b740' },
];

const recoveryScore = 82;

const DashboardPage = () => {
  const { data: weeklyGoals } = useWeeklyGoalSummary();
  const { data: planSummary } = usePlanSummary();
  const { data: plans = [] } = usePlans();
  const { data: workoutSummary } = useWorkoutSummary();
  const primaryWeeklyGoal = weeklyGoals?.[0];
  const activePlan = plans.find((plan) => plan.status === 'active') ?? plans[0];
  const nextSessions = activePlan?.sessions
    .filter((session) => session.status !== 'completed')
    .slice(0, 3);
  const weeklyVolume = workoutSummary?.volumeByDay ?? fallbackWeeklyVolume;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-500">Today</p>
          <h1 className="text-3xl font-semibold text-slate-900">Performance dashboard</h1>
          <p className="text-sm text-slate-500">
            Summaries update live as workouts, meals, and biometrics sync in.
          </p>
        </div>
        <p className="text-sm text-slate-500">Last sync: {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Weekly goal"
          value={primaryWeeklyGoal ? `${primaryWeeklyGoal.progress.toFixed(1)} / ${primaryWeeklyGoal.target} ${primaryWeeklyGoal.unit}` : 'No goal yet'}
          delta={primaryWeeklyGoal ? `${Math.round(primaryWeeklyGoal.completion)}% complete` : undefined}
          helper={primaryWeeklyGoal ? `Type: ${primaryWeeklyGoal.type}` : 'Create a weekly workouts goal'}
          icon={<Target size={18} />}
        />
        <StatCard
          label="Training load"
          value={workoutSummary ? `${workoutSummary.totalMinutes} min` : '—'}
          delta={workoutSummary ? `${workoutSummary.totalSessions} sessions` : undefined}
          helper="Past 7 days"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Calories burned"
          value={workoutSummary ? `${Math.round((workoutSummary.totalMinutes ?? 0) * 8)} kcal` : '2,430'}
          delta="+320 kcals"
          helper="Estimated from logged workouts"
          icon={<Flame size={18} />}
        />
        <StatCard label="Hydration" value="2.8 L" helper="Goal: 3.5 L" icon={<Droplets size={18} />} />
        <StatCard
          label="Plan progress"
          value={planSummary ? `${planSummary.completionRate}%` : '—'}
          helper={`${planSummary?.totalPlans ?? 0} plans tracked`}
          icon={<Target size={18} />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          title="Weekly training minutes"
          subtitle="Movement streak"
          action={<span className="text-xs font-medium text-primary-600">Goal: 240 min</span>}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVolume}>
                <defs>
                  <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2a7ef4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2a7ef4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="minutes" stroke="#2a7ef4" fillOpacity={1} fill="url(#volume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Macro distribution" subtitle="Nutrition log">
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="30%" outerRadius="90%" data={macroSplit}>
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around text-sm text-slate-500">
            {macroSplit.map((macro) => (
              <div key={macro.name} className="text-center">
                <div className="font-semibold text-slate-900">{macro.value}g</div>
                <p>{macro.name}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Recovery readiness" subtitle="Whoop-style score">
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#2bc48a"
                  strokeWidth="10"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${(recoveryScore / 100) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="text-center">
                <p className="text-4xl font-semibold text-slate-900">{recoveryScore}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">Ready</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">HRV trending up · Sleep debt cleared</p>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Strength vs Conditioning" subtitle="Minutes per modality">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVolume}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="minutes" fill="#8abfff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Upcoming sessions" subtitle="Auto-generated plan">
          <ul className="space-y-4">
            {(nextSessions && nextSessions.length > 0
              ? nextSessions.map((session) => ({
                  id: session.id,
                  day: session.day,
                  focus: session.title || 'Planned session',
                  note: `${session.targetDuration ?? 45} min · ${session.status === 'planned' ? 'Ready' : 'Pending'}`,
                }))
              : [
                  { id: 'placeholder-1', day: 'Schedule', focus: 'Add sessions to your plan', note: 'Use the Activity tab' },
                ]
            ).map((item) => (
              <li key={item.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.day}</p>
                <p className="text-lg font-semibold text-slate-900">{item.focus}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </section>
  );
};

export default DashboardPage;

