import dayjs from 'dayjs';
import type {
  Goal,
  GoalSummaryItem,
  GoalPeriod,
  GoalType,
  Plan,
  PlanSession,
  PlanSummary,
  Workout,
  WorkoutSummary,
} from '../types/app';
import type { User } from '../types';

type DemoRequest = {
  method: string;
  url?: string;
  data?: unknown;
  params?: Record<string, unknown>;
};

type DemoResponse =
  | { user: User }
  | { tokens: { accessToken: string; refreshToken: string } }
  | { goals: Goal[] }
  | { goal: Goal }
  | { summary: GoalSummaryItem[] }
  | { plans: Plan[] }
  | { plan: Plan }
  | { summary: Plan['id'][] }
  | { workouts: Workout[] }
  | { workout: Workout }
  | { summary: WorkoutSummary }
  | Record<string, unknown>;

const randomId = () => (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11));

export const demoProfile: User = {
  id: 'demo-user',
  firstName: 'Avery',
  lastName: 'Rivera',
  email: 'demo@vitaltrack.app',
  preferences: {
    weeklyGoal: 4,
    measurementSystem: 'metric',
    reminders: true,
  },
};

const createGoal = (overrides: Partial<Goal> & { type: GoalType; period: GoalPeriod; target: number; unit: string }): Goal => {
  const now = dayjs();
  const start = overrides.startDate ?? now.startOf('week').toISOString();
  const end = overrides.endDate ?? now.endOf('week').toISOString();
  return {
    id: randomId(),
    progress: 0,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
    startDate: start,
    endDate: end,
  };
};

const createPlanSession = (overrides: Partial<PlanSession> = {}): PlanSession => ({
  id: randomId(),
  day: 'Mon',
  title: 'Session',
  status: 'planned',
  ...overrides,
});

const createPlan = (overrides: Partial<Plan> & { name: string; goal: string; focusArea: string }): Plan => {
  const now = dayjs();
  return {
    id: randomId(),
    status: 'active',
    intensity: 'moderate',
    startDate: now.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    sessions: [createPlanSession({ day: 'Tue', title: 'Tempo intervals' }), createPlanSession({ day: 'Thu', title: 'Strength circuit' })],
    ...overrides,
  };
};

const createWorkout = (overrides: Partial<Workout> & { title: string }): Workout => {
  const now = dayjs();
  return {
    id: randomId(),
    type: 'strength',
    date: now.toISOString(),
    durationMinutes: 45,
    intensity: 'moderate',
    status: 'completed',
    ...overrides,
  };
};

let goals: Goal[] = [
  createGoal({
    type: 'workouts',
    period: 'weekly',
    target: 4,
    progress: 2.5,
    unit: 'sessions',
  }),
  createGoal({
    type: 'minutes',
    period: 'weekly',
    target: 240,
    progress: 180,
    unit: 'minutes',
    isActive: false,
  }),
];

let plans: Plan[] = [
  createPlan({
    focusArea: 'Hybrid engine',
    goal: 'Build sustained output',
    name: 'Engine upgrade',
  }),
];

let workouts: Workout[] = [
  createWorkout({ title: 'Zone 2 run', type: 'endurance', intensity: 'easy', durationMinutes: 50 }),
  createWorkout({ title: 'Lift — lower body', type: 'strength', intensity: 'hard', durationMinutes: 60 }),
  createWorkout({ title: 'Mobility reset', type: 'mobility', intensity: 'easy', durationMinutes: 30, status: 'planned' }),
];

const computeGoalSummary = (): GoalSummaryItem[] =>
  goals
    .filter((goal) => goal.period === 'weekly' && goal.isActive)
    .map((goal) => ({
      id: goal.id,
      type: goal.type,
      period: goal.period,
      target: goal.target,
      progress: goal.progress,
      unit: goal.unit,
      completion: goal.target === 0 ? 0 : Math.min(100, (goal.progress / goal.target) * 100),
    }));

const computePlanSummary = () => {
  const totalPlans = plans.length;
  const statusCounts = plans.reduce<Record<string, number>>((acc, plan) => {
    acc[plan.status] = (acc[plan.status] ?? 0) + 1;
    return acc;
  }, {});

  const summary = plans.reduce(
    (acc, plan) => {
      const completed = plan.sessions.filter((session) => session.status === 'completed').length;
      acc.totalSessions += plan.sessions.length;
      acc.completedSessions += completed;
      if (plan.status === 'active') {
        acc.activePlans.push({
          id: plan.id,
          name: plan.name,
          focusArea: plan.focusArea,
          endDate: plan.endDate,
          completion: plan.sessions.length === 0 ? 0 : Math.round((completed / plan.sessions.length) * 100),
        });
      }
      return acc;
    },
    {
      totalSessions: 0,
      completedSessions: 0,
      activePlans: [] as PlanSummary['activePlans'],
    }
  );

  const completionRate =
    summary.totalSessions === 0 ? 0 : Math.round((summary.completedSessions / summary.totalSessions) * 100);

  return {
    totalPlans,
    completionRate,
    statusCounts,
    activePlans: summary.activePlans,
  };
};

const computeWorkoutSummary = (): WorkoutSummary => {
  const end = dayjs();
  const start = end.subtract(6, 'day');
  const dayLabels = Array.from({ length: 7 }, (_, index) => start.add(index, 'day'));

  const volumeByDay = dayLabels.map((day) => ({
    day: day.format('ddd'),
    minutes: workouts
      .filter((workout) => dayjs(workout.date).isSame(day, 'day'))
      .reduce((sum, workout) => sum + workout.durationMinutes, 0),
  }));

  const intensity = workouts.reduce<Record<string, number>>((acc, workout) => {
    acc[workout.intensity] = (acc[workout.intensity] ?? 0) + 1;
    return acc;
  }, { easy: 0, moderate: 0, hard: 0 });

  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.durationMinutes, 0);

  return {
    totalSessions: workouts.length,
    totalMinutes,
    averageDuration: workouts.length === 0 ? 0 : Math.round(totalMinutes / workouts.length),
    recentWorkout: workouts[workouts.length - 1] ?? null,
    volumeByDay,
    intensity,
    lastUpdated: new Date().toISOString(),
  };
};

const respond = (data: DemoResponse, overrides?: Partial<{ status: number }>) => ({
  data,
  status: overrides?.status ?? 200,
});

export const handleDemoRequest = async ({ method, url = '', data, params }: DemoRequest) => {
  const normalizedMethod = method.toUpperCase();
  const path = url.split('?')[0];
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (path.startsWith('/auth')) {
    if (normalizedMethod === 'GET' && path === '/auth/me') {
      return respond({ user: demoProfile });
    }
    if (normalizedMethod === 'POST' && path === '/auth/login') {
      return respond({ user: demoProfile, tokens: { accessToken: 'demo', refreshToken: 'demo' } });
    }
    if (normalizedMethod === 'POST' && path === '/auth/register') {
      const body = data as Record<string, string>;
      demoProfile.firstName = body.firstName ?? demoProfile.firstName;
      demoProfile.lastName = body.lastName ?? demoProfile.lastName;
      demoProfile.email = body.email ?? demoProfile.email;
      return respond({ user: demoProfile, tokens: { accessToken: 'demo', refreshToken: 'demo' } });
    }
    if (normalizedMethod === 'POST' && path === '/auth/logout') {
      return respond({});
    }
    if (normalizedMethod === 'POST' && path === '/auth/refresh') {
      return respond({ tokens: { accessToken: 'demo', refreshToken: 'demo' } });
    }
  }

  if (path.startsWith('/goals')) {
    if (normalizedMethod === 'GET' && path === '/goals') {
      return respond({ goals });
    }
    if (normalizedMethod === 'GET' && path === '/goals/summary/weekly') {
      return respond({ summary: computeGoalSummary() });
    }
    if (normalizedMethod === 'POST' && path === '/goals') {
      const body = data as Partial<Goal>;
      const goal = createGoal({
        type: body.type ?? 'workouts',
        period: body.period ?? 'weekly',
        target: Number(body.target ?? 1),
        unit: body.unit ?? 'sessions',
      });
      goals = [goal, ...goals];
      return respond({ goal });
    }
    const goalMatch = path.match(/^\/goals\/(.+)$/);
    if (goalMatch) {
      const goalId = goalMatch[1];
      if (normalizedMethod === 'PATCH') {
        goals = goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, ...((data as Record<string, unknown>) ?? {}), updatedAt: new Date().toISOString() }
            : goal
        );
        const updatedGoal = goals.find((goal) => goal.id === goalId);
        return respond({ goal: updatedGoal! });
      }
      if (normalizedMethod === 'DELETE') {
        goals = goals.filter((goal) => goal.id !== goalId);
        return respond({});
      }
    }
  }

  if (path.startsWith('/plans')) {
    if (normalizedMethod === 'GET' && path === '/plans') {
      return respond({ plans });
    }
    if (normalizedMethod === 'GET' && path === '/plans/summary') {
      return respond({ summary: computePlanSummary() });
    }
    if (normalizedMethod === 'POST' && path === '/plans') {
      const body = data as Partial<Plan>;
      const sessionPayload = (body.sessions ?? []).map((session) => ({
        ...session,
        id: session?.id ?? randomId(),
      })) as PlanSession[];
      const plan = createPlan({
        name: body.name ?? 'New plan',
        goal: body.goal ?? 'Goal',
        focusArea: body.focusArea ?? 'Focus',
        sessions: sessionPayload.length > 0 ? sessionPayload : undefined,
        status: body.status ?? 'draft',
      });
      plans = [plan, ...plans];
      return respond({ plan });
    }
    const planMatch = path.match(/^\/plans\/(.+)$/);
    if (planMatch) {
      const planId = planMatch[1];
      if (normalizedMethod === 'PATCH') {
        plans = plans.map((plan) => {
          if (plan.id !== planId) return plan;
          const payload = (data as Partial<Plan>) ?? {};
          const sessions = payload.sessions
            ? payload.sessions.map((session) => ({ ...session, id: session.id ?? randomId() }) as PlanSession)
            : plan.sessions;
          return {
            ...plan,
            ...payload,
            sessions,
            updatedAt: new Date().toISOString(),
          };
        });
        return respond({ plan: plans.find((plan) => plan.id === planId)! });
      }
      if (normalizedMethod === 'DELETE') {
        plans = plans.filter((plan) => plan.id !== planId);
        return respond({});
      }
    }
  }

  if (path.startsWith('/workouts')) {
    if (normalizedMethod === 'GET' && path === '/workouts') {
      const planId = params?.planId as string | undefined;
      const filtered = planId ? workouts.filter((workout) => workout.plan === planId) : workouts;
      return respond({ workouts: filtered });
    }
    if (normalizedMethod === 'GET' && path === '/workouts/summary') {
      return respond({ summary: computeWorkoutSummary() });
    }
    if (normalizedMethod === 'POST' && path === '/workouts') {
      const body = data as Partial<Workout> & { title: string };
      const workout = createWorkout({
        ...body,
        title: body.title ?? 'Workout',
        plan: body.plan,
      });
      workouts = [workout, ...workouts];
      return respond({ workout });
    }
    const workoutMatch = path.match(/^\/workouts\/(.+)$/);
    if (workoutMatch) {
      const workoutId = workoutMatch[1];
      if (normalizedMethod === 'PATCH') {
        workouts = workouts.map((workout) =>
          workout.id === workoutId
            ? ({ ...workout, ...(data as Partial<Workout>), id: workout.id } as Workout)
            : workout
        );
        return respond({ workout: workouts.find((workout) => workout.id === workoutId)! });
      }
      if (normalizedMethod === 'DELETE') {
        workouts = workouts.filter((workout) => workout.id !== workoutId);
        return respond({});
      }
    }
  }

  return respond({});
};

