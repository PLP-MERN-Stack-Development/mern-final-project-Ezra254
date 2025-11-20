import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import dayjs from 'dayjs';
import { Activity, Loader2, PauseCircle, PlayCircle, Target, Trash2 } from 'lucide-react';
import type { Goal } from '../types/app';
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal, useWeeklyGoalSummary } from '../hooks/useGoals';
import { useAuthStore } from '../store/authStore';

type GoalFormState = {
  type: Goal['type'];
  period: Goal['period'];
  target: number;
  unit: string;
};

const goalTypeOptions: Array<{ value: Goal['type']; label: string; unit: string }> = [
  { value: 'workouts', label: 'Workouts completed', unit: 'sessions' },
  { value: 'minutes', label: 'Active minutes', unit: 'minutes' },
  { value: 'steps', label: 'Steps walked', unit: 'steps' },
  { value: 'calories', label: 'Calories burned', unit: 'kcal' },
  { value: 'weight', label: 'Weight change', unit: 'kg' },
];

const periodOptions: Array<{ value: Goal['period']; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createInitialGoalForm = (): GoalFormState => ({
  type: 'workouts',
  period: 'weekly',
  target: 4,
  unit: 'sessions',
});

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: weeklySummary } = useWeeklyGoalSummary();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [goalForm, setGoalForm] = useState<GoalFormState>(() => createInitialGoalForm());
  const [progressDrafts, setProgressDrafts] = useState<Record<string, number>>({});
  const [targetDrafts, setTargetDrafts] = useState<Record<string, number>>({});

  const orderedGoals = useMemo(
    () =>
      goals
        .slice()
        .sort(
          (a, b) =>
            Number(b.isActive) - Number(a.isActive) ||
            dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf()
        ),
    [goals]
  );

  const activeWeeklyGoal = weeklySummary?.[0];
  const activeGoalCount = goals.filter((goal) => goal.isActive).length;
  const lastUpdated = goals[0]?.updatedAt
    ? dayjs(goals[0].updatedAt).format('MMM D, h:mm A')
    : 'No changes yet';

  const handleGoalFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createGoal.mutateAsync({
      type: goalForm.type,
      period: goalForm.period,
      target: Number(goalForm.target),
      unit: goalForm.unit,
    });
    setGoalForm(createInitialGoalForm());
  };

  const handleGoalTypeChange = (type: Goal['type']) => {
    const meta = goalTypeOptions.find((option) => option.value === type);
    setGoalForm((prev) => ({
      ...prev,
      type,
      unit: meta?.unit ?? prev.unit,
    }));
  };

  const handleProgressDraftChange = (goalId: string, value: number) => {
    setProgressDrafts((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleTargetDraftChange = (goalId: string, value: number) => {
    setTargetDrafts((prev) => ({ ...prev, [goalId]: value }));
  };

  const commitProgress = async (goal: Goal) => {
    const draft = progressDrafts[goal.id];
    if (draft === undefined || draft === goal.progress) {
      return;
    }
    await updateGoal.mutateAsync({ id: goal.id, payload: { progress: draft } });
    setProgressDrafts((prev) => {
      const next = { ...prev };
      delete next[goal.id];
      return next;
    });
  };

  const commitTarget = async (goal: Goal) => {
    const draft = targetDrafts[goal.id];
    if (draft === undefined || draft === goal.target) {
      return;
    }
    await updateGoal.mutateAsync({ id: goal.id, payload: { target: draft } });
    setTargetDrafts((prev) => {
      const next = { ...prev };
      delete next[goal.id];
      return next;
    });
  };

  const handleToggleActive = async (goal: Goal) => {
    await updateGoal.mutateAsync({ id: goal.id, payload: { isActive: !goal.isActive } });
  };

  const handleDelete = async (goalId: string) => {
    await deleteGoal.mutateAsync(goalId);
  };

  const handleMarkComplete = async (goal: Goal) => {
    await updateGoal.mutateAsync({ id: goal.id, payload: { progress: goal.target } });
  };

  const getProgressValue = (goal: Goal) => {
    const raw = progressDrafts[goal.id] ?? goal.progress;
    return clampValue(raw, 0, Math.max(goal.target, 1));
  };
  const getTargetValue = (goal: Goal) => Math.max(targetDrafts[goal.id] ?? goal.target, 0.1);

  const progressHelper =
    activeWeeklyGoal && activeWeeklyGoal.target > 0
      ? `${Math.round(activeWeeklyGoal.completion)}% complete`
      : 'Set a weekly goal to begin';

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-primary-500">Goals & Preferences</p>
        <h1 className="text-3xl font-semibold text-slate-900">Personalized coaching</h1>
        <p className="text-sm text-slate-500">
          Configure the targets the dashboard reacts to so your insights stay actionable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Weekly progress</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {activeWeeklyGoal ? `${activeWeeklyGoal.progress.toFixed(1)} / ${activeWeeklyGoal.target}` : '—'}
            <span className="ml-1 text-xs font-normal text-slate-500">{activeWeeklyGoal?.unit ?? ''}</span>
          </p>
          <p className="text-sm text-slate-500">{progressHelper}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active goals</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{activeGoalCount}</p>
          <p className="text-sm text-slate-500">
            {activeGoalCount === 0 ? 'Reactivate or add a goal' : 'Synced with dashboard widgets'}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Last change</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{lastUpdated}</p>
          <p className="text-sm text-slate-500">Once you adjust goals the charts refresh instantly.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card space-y-4" onSubmit={handleGoalFormSubmit}>
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-500">Create goal</p>
            <h2 className="text-xl font-semibold text-slate-900">Coach the dashboard</h2>
            <p className="text-sm text-slate-500">
              Choose what you want VitalTrack to nudge and celebrate. Set it once or iterate every week.
            </p>
          </div>
          <label className="text-sm text-slate-600">
            Focus area
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={goalForm.type}
              onChange={(event) => handleGoalTypeChange(event.target.value as Goal['type'])}
            >
              {goalTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
      <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Cadence
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={goalForm.period}
                onChange={(event) =>
                  setGoalForm((prev) => ({ ...prev, period: event.target.value as Goal['period'] }))
                }
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Target ({goalForm.unit})
              <input
                type="number"
                min={0.1}
                step={goalForm.type === 'weight' ? 0.1 : 1}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={goalForm.target}
                onChange={(event) =>
                  setGoalForm((prev) => ({ ...prev, target: Number(event.target.value) }))
                }
                required
              />
            </label>
          </div>
          <label className="text-sm text-slate-600">
            Display unit
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
              value={goalForm.unit}
              onChange={(event) => setGoalForm((prev) => ({ ...prev, unit: event.target.value }))}
              placeholder="sessions"
              required
            />
          </label>
          <button
            type="submit"
            disabled={createGoal.isPending}
            className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createGoal.isPending ? 'Saving...' : 'Add goal'}
            </button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-500">Your goals</p>
              <h2 className="text-xl font-semibold text-slate-900">Live tracking</h2>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Activity size={16} />
              {goals.length} total
            </span>
          </div>
          {goalsLoading ? (
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={16} className="animate-spin" />
              Syncing your goals
            </div>
          ) : goals.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">
              You have not created any goals yet. Start with weekly workouts or daily minutes and watch the dashboard update automatically.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {orderedGoals.map((goal) => {
                const maxValue = Math.max(goal.target, 1);
                return (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {goalTypeOptions.find((option) => option.value === goal.type)?.label ?? goal.type}{' '}
                          <span className="text-xs uppercase tracking-wide text-slate-400">· {goal.period}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {dayjs(goal.startDate).format('MMM D')} – {dayjs(goal.endDate).format('MMM D, YYYY')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(goal)}
                          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            goal.isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {goal.isActive ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                          {goal.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(goal.id)}
                          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <label className="block text-xs uppercase tracking-wide text-slate-400">
                        Progress ({goal.unit})
                        <input
                          type="range"
                          min={0}
                          max={maxValue}
                          step={goal.type === 'weight' ? 0.1 : 1}
                          value={getProgressValue(goal)}
                          onChange={(event) =>
                            handleProgressDraftChange(goal.id, Number(event.target.value))
                          }
                          onMouseUp={() => void commitProgress(goal)}
                          onTouchEnd={() => void commitProgress(goal)}
                          onBlur={() => void commitProgress(goal)}
                          className="mt-2 w-full accent-primary-600"
                        />
                      </label>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <span>
                          {getProgressValue(goal)} / {goal.target} {goal.unit}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                            onClick={() => handleMarkComplete(goal)}
                          >
                            Mark complete
                          </button>
                          <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs">
                            <Target size={14} className="text-primary-600" />
                            <input
                              type="number"
                              min={0.1}
                              step={goal.type === 'weight' ? 0.1 : 1}
                              value={getTargetValue(goal)}
                              onChange={(event) =>
                                handleTargetDraftChange(goal.id, Number(event.target.value))
                              }
                              onBlur={() => void commitTarget(goal)}
                              className="w-20 border-none bg-transparent text-right text-sm text-slate-900 outline-none"
                            />
                            {goal.unit}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-primary-500">Reminder</p>
        <p className="mt-1 text-sm text-slate-500">
          Signed in as <span className="font-semibold text-slate-900">{user?.email ?? 'guest@vitaltrack.dev'}</span>. Goal updates follow your profile and instantly refresh any widgets (dashboard cards, analytics, realtime feed).
        </p>
      </div>
    </section>
  );
};

export default SettingsPage;

