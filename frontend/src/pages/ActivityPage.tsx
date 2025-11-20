import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Calendar, CheckCircle2, Clock, Loader2, PlusCircle, Target, Trash2 } from 'lucide-react';
import { usePlans, usePlanSummary, useCreatePlan, useUpdatePlan, useDeletePlan } from '../hooks/usePlans';
import { useWorkouts, useWorkoutSummary, useCreateWorkout, useUpdateWorkout, useDeleteWorkout } from '../hooks/useWorkouts';
import type {
  PlanSession,
  PlanStatus,
  PlanIntensity,
  Workout,
  WorkoutStatus,
  WorkoutType,
  WorkoutIntensity,
} from '../types/app';

dayjs.extend(relativeTime);

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const createInitialPlanSession = (): Omit<PlanSession, 'id'> => ({
  day: 'Mon',
  title: '',
  notes: '',
  targetDuration: 45,
  focusArea: '',
  status: 'planned',
});

type PlanFormState = {
  name: string;
  goal: string;
  focusArea: string;
  startDate: string;
  endDate: string;
  intensity: PlanIntensity;
  status: PlanStatus;
  notes: string;
  sessions: Array<Omit<PlanSession, 'id'>>;
};

type PlanSessionUpdate = Omit<PlanSession, 'id'> & { id?: string };

const createInitialPlanForm = (): PlanFormState => ({
  name: '',
  goal: '',
  focusArea: '',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: '',
  intensity: 'moderate',
  status: 'draft',
  notes: '',
  sessions: [createInitialPlanSession()],
});

type WorkoutFormState = {
  title: string;
  type: WorkoutType;
  date: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  perceivedEffort: number;
  status: WorkoutStatus;
  notes: string;
  plan: string;
};

const createInitialWorkoutForm = (): WorkoutFormState => ({
  title: '',
  type: 'strength',
  date: dayjs().format('YYYY-MM-DD'),
  durationMinutes: 45,
  intensity: 'moderate',
  perceivedEffort: 7,
  status: 'completed',
  notes: '',
  plan: '',
});

const ActivityPage = () => {
  const [planForm, setPlanForm] = useState<PlanFormState>(() => createInitialPlanForm());
  const [workoutForm, setWorkoutForm] = useState<WorkoutFormState>(() => createInitialWorkoutForm());
  const [planFilter, setPlanFilter] = useState<'all' | string>('all');
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: planSummary } = usePlanSummary();
  const { data: workouts = [], isLoading: workoutsLoading } = useWorkouts(
    planFilter === 'all' ? undefined : { planId: planFilter }
  );
  const { data: workoutSummary } = useWorkoutSummary();

  const lastSyncedLabel = workoutSummary?.lastUpdated
    ? dayjs(workoutSummary.lastUpdated).fromNow()
    : 'Just now';

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const removeWorkout = useDeleteWorkout();

  const activePlan = useMemo(() => plans.find((plan) => plan.status === 'active'), [plans]);

  useEffect(() => {
    setWorkoutForm((prev) => ({ ...prev, plan: planFilter === 'all' ? '' : planFilter }));
  }, [planFilter]);

  const handleAddSessionRow = () => {
    setPlanForm((prev) => ({ ...prev, sessions: [...prev.sessions, createInitialPlanSession()] }));
  };

  const handleSessionChange = <K extends keyof Omit<PlanSession, 'id'>>(
    index: number,
    field: K,
    value: Omit<PlanSession, 'id'>[K]
  ) => {
    setPlanForm((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session, sessionIndex) =>
        sessionIndex === index ? { ...session, [field]: value } : session
      ),
    }));
  };

  const handlePlanSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sessions = planForm.sessions.filter((session) => session.title.trim().length > 0);

    await createPlan.mutateAsync({
      ...planForm,
      sessions,
      startDate: dayjs(planForm.startDate).toISOString(),
      endDate: planForm.endDate ? dayjs(planForm.endDate).toISOString() : undefined,
    });
    setPlanForm(createInitialPlanForm());
  };

  const handleToggleSessionStatus = async (planId: string, sessionId: string) => {
    const plan = plans.find((item) => item.id === planId);
    if (!plan) return;

    const sessions: PlanSessionUpdate[] = plan.sessions.map((session) =>
      session.id === sessionId
        ? { ...session, status: session.status === 'completed' ? 'planned' : 'completed' }
        : { ...session }
    );

    await updatePlan.mutateAsync({ id: planId, payload: { sessions } });
  };

  const handlePlanStatusChange = async (planId: string, status: PlanStatus) => {
    await updatePlan.mutateAsync({ id: planId, payload: { status } });
  };

  const handlePlanDelete = async (planId: string) => {
    await deletePlan.mutateAsync(planId);
    if (planFilter === planId) {
      setPlanFilter('all');
    }
  };

  const handleWorkoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await createWorkout.mutateAsync({
      ...workoutForm,
      durationMinutes: Number(workoutForm.durationMinutes),
      perceivedEffort: Number(workoutForm.perceivedEffort),
      plan: workoutForm.plan || undefined,
      date: dayjs(workoutForm.date).toISOString(),
    });

    setWorkoutForm((prev) => {
      const next = createInitialWorkoutForm();
      return { ...next, plan: prev.plan };
    });
  };

  const handleWorkoutEdit = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleWorkoutUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingWorkout) return;

    const formData = new FormData(event.currentTarget);
    await updateWorkout.mutateAsync({
      id: editingWorkout.id,
      payload: {
        durationMinutes: Number(formData.get('durationMinutes')),
        notes: String(formData.get('notes') ?? ''),
      },
    });
    setEditingWorkout(null);
  };

  const handleWorkoutDelete = async (workoutId: string) => {
    await removeWorkout.mutateAsync(workoutId);
  };

  const handleWorkoutStatusChange = async (workoutId: string, status: WorkoutStatus) => {
    await updateWorkout.mutateAsync({ id: workoutId, payload: { status } });
  };

  return (
    <section className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-500">Training control center</p>
          <h1 className="text-3xl font-semibold text-slate-900">Plans & Workout Log</h1>
          <p className="text-sm text-slate-500">
            Activate a plan, check off sessions, and log workouts — everything syncs live across your dashboard.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          <p>Last synced</p>
          <p className="font-semibold text-slate-900">{lastSyncedLabel}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Weekly minutes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{workoutSummary?.totalMinutes ?? 0} min</p>
          <p className="text-sm text-slate-500">
            {workoutSummary?.totalSessions ?? 0} sessions · avg {workoutSummary?.averageDuration ?? 0} min
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active plan</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{activePlan?.name ?? 'No plan'}</p>
          <p className="text-sm text-slate-500">{activePlan ? activePlan.goal : 'Create a plan to begin'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Plan completion</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {planSummary?.completionRate ?? 0}
            <span className="text-base font-normal text-slate-400">%</span>
          </p>
          <p className="text-sm text-slate-500">{planSummary?.totalPlans ?? 0} plans tracked</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Intensity mix</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {workoutSummary?.intensity?.hard ?? 0}/{workoutSummary?.intensity?.moderate ?? 0}/{workoutSummary?.intensity?.easy ?? 0}
          </p>
          <p className="text-sm text-slate-500">hard / moderate / easy</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-500">Training plans</p>
              <h2 className="text-xl font-semibold text-slate-900">Create or adjust</h2>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              <Target size={14} />
              {plans.length} saved
            </span>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handlePlanSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Plan name
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={planForm.name}
                  onChange={(event) => setPlanForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-600">
                Focus area
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={planForm.focusArea}
                  onChange={(event) => setPlanForm((prev) => ({ ...prev, focusArea: event.target.value }))}
                  required
                />
              </label>
            </div>
            <label className="text-sm text-slate-600">
              Outcome goal
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={planForm.goal}
                onChange={(event) => setPlanForm((prev) => ({ ...prev, goal: event.target.value }))}
                required
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Start date
                <input
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={planForm.startDate}
                  onChange={(event) => setPlanForm((prev) => ({ ...prev, startDate: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-600">
                End date
                <input
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={planForm.endDate}
                  onChange={(event) => setPlanForm((prev) => ({ ...prev, endDate: event.target.value }))}
                />
              </label>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Session templates</p>
                <button
                  type="button"
                  onClick={handleAddSessionRow}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-600"
                >
                  <PlusCircle size={16} />
                  Add
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {planForm.sessions.map((session, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-4">
                    <select
                      className="rounded-2xl border border-slate-200 px-2 py-2 text-sm"
                      value={session.day}
                      onChange={(event) => handleSessionChange(index, 'day', event.target.value)}
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Session focus"
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                      value={session.title}
                      onChange={(event) => handleSessionChange(index, 'title', event.target.value)}
                    />
                    <input
                      type="number"
                      min={15}
                      max={180}
                      placeholder="Duration (min)"
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      value={session.targetDuration ?? 45}
                      onChange={(event) => handleSessionChange(index, 'targetDuration', Number(event.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {createPlan.isPending ? 'Saving...' : 'Save plan'}
            </button>
          </form>
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={16} />
              <p>{plans.length} active schedules</p>
            </div>
            {plansLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                Syncing plans...
              </div>
            ) : plans.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No plans yet. Draft one to get personalized suggestions.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                        <p className="text-xs text-slate-500">
                          {dayjs(plan.startDate).format('MMM D')} –{' '}
                          {plan.endDate ? dayjs(plan.endDate).format('MMM D') : 'ongoing'} · {plan.focusArea}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-2xl border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                          value={plan.status}
                          onChange={(event) => handlePlanStatusChange(plan.id, event.target.value as PlanStatus)}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handlePlanDelete(plan.id)}
                          className="flex items-center gap-1 text-xs text-danger"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {plan.sessions.length === 0 ? (
                        <p className="text-xs text-slate-500">Add sessions to build this plan.</p>
                      ) : (
                        plan.sessions.map((session) => (
                          <button
                            key={session.id}
                            type="button"
                            onClick={() => handleToggleSessionStatus(plan.id, session.id)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm ${
                              session.status === 'completed'
                                ? 'border-primary-100 bg-primary-50 text-primary-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle2
                                size={16}
                                className={session.status === 'completed' ? 'text-primary-600' : 'text-slate-300'}
                              />
                              {session.day}: {session.title || 'Unnamed session'}
                            </span>
                            <span className="text-xs text-slate-500">{session.targetDuration ?? 45} min</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-500">Workout log</p>
              <h2 className="text-xl font-semibold text-slate-900">Log a session</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-400">Filter</span>
              <select
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value)}
              >
                <option value="all">All plans</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleWorkoutSubmit}>
            <label className="text-sm text-slate-600">
              Session title
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={workoutForm.title}
                onChange={(event) => setWorkoutForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Type
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={workoutForm.type}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({ ...prev, type: event.target.value as WorkoutType }))
                  }
                >
                  <option value="strength">Strength</option>
                  <option value="conditioning">Conditioning</option>
                  <option value="mobility">Mobility</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="endurance">Endurance</option>
                </select>
              </label>
              <label className="text-sm text-slate-600">
                Intensity
                <select
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={workoutForm.intensity}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({ ...prev, intensity: event.target.value as WorkoutIntensity }))
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Date
                <input
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={workoutForm.date}
                  onChange={(event) => setWorkoutForm((prev) => ({ ...prev, date: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-600">
                Duration (min)
                <input
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                  value={workoutForm.durationMinutes}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))
                  }
                  min={10}
                  max={240}
                  required
                />
              </label>
            </div>
            <label className="text-sm text-slate-600">
              Attach to plan
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={workoutForm.plan}
                onChange={(event) => setWorkoutForm((prev) => ({ ...prev, plan: event.target.value }))}
              >
                <option value="">No plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Notes
              <textarea
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
                value={workoutForm.notes}
                onChange={(event) => setWorkoutForm((prev) => ({ ...prev, notes: event.target.value }))}
                rows={3}
              />
            </label>
            <button
              type="submit"
              disabled={createWorkout.isPending}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {createWorkout.isPending ? 'Logging...' : 'Log workout'}
            </button>
          </form>
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={16} />
              <p>{workouts.length} recent workouts</p>
            </div>
            {workoutsLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" />
                Loading workouts...
              </div>
            ) : workouts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No workouts yet. Log your first session!</p>
            ) : (
              <div className="mt-4 space-y-3">
                {workouts.map((workout) => (
                  <div key={workout.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{workout.title}</p>
                        <p className="text-xs text-slate-500">
                          {dayjs(workout.date).format('ddd, MMM D')} · {workout.durationMinutes} min · {workout.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-2xl border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                          value={workout.status}
                          onChange={(event) =>
                            handleWorkoutStatusChange(workout.id, event.target.value as WorkoutStatus)
                          }
                        >
                          <option value="planned">Planned</option>
                          <option value="completed">Completed</option>
                          <option value="skipped">Skipped</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleWorkoutEdit(workout)}
                          className="text-xs font-semibold text-primary-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWorkoutDelete(workout.id)}
                          className="flex items-center gap-1 text-xs text-danger"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                    {editingWorkout?.id === workout.id ? (
                      <form className="mt-4 space-y-3" onSubmit={handleWorkoutUpdate}>
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="text-xs uppercase tracking-wide text-slate-400">
                            Duration (min)
                            <input
                              name="durationMinutes"
                              type="number"
                              min={10}
                              max={240}
                              defaultValue={workout.durationMinutes}
                              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                              required
                            />
                          </label>
                          <label className="text-xs uppercase tracking-wide text-slate-400">
                            Notes
                            <input
                              name="notes"
                              defaultValue={workout.notes ?? ''}
                              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="rounded-2xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white"
                          >
                            Save changes
                          </button>
                          <button
                            type="button"
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                            onClick={() => setEditingWorkout(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">{workout.notes || 'No notes yet'}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityPage;

