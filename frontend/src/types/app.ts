export type GoalType = 'workouts' | 'minutes' | 'steps' | 'weight' | 'calories';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id: string;
  type: GoalType;
  period: GoalPeriod;
  target: number;
  progress: number;
  unit: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalSummaryItem {
  id: string;
  type: GoalType;
  period: GoalPeriod;
  target: number;
  progress: number;
  unit: string;
  completion: number;
}

export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed';
export type PlanIntensity = 'low' | 'moderate' | 'high';

export interface PlanSession {
  id: string;
  day: string;
  title: string;
  notes?: string;
  targetDuration?: number;
  focusArea?: string;
  status: 'planned' | 'completed' | 'skipped';
}

export interface Plan {
  id: string;
  name: string;
  goal: string;
  focusArea: string;
  status: PlanStatus;
  intensity: PlanIntensity;
  startDate: string;
  endDate?: string;
  notes?: string;
  sessions: PlanSession[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanSummary {
  totalPlans: number;
  completionRate: number;
  statusCounts: Record<string, number>;
  activePlans: Array<{
    id: string;
    name: string;
    focusArea: string;
    endDate?: string;
    completion: number;
  }>;
}

export type WorkoutType = 'strength' | 'conditioning' | 'mobility' | 'hybrid' | 'endurance';
export type WorkoutIntensity = 'easy' | 'moderate' | 'hard';
export type WorkoutStatus = 'planned' | 'completed' | 'skipped';

export interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  date: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  perceivedEffort?: number;
  calories?: number;
  notes?: string;
  status: WorkoutStatus;
  plan?: string;
  sessionId?: string;
}

export interface WorkoutSummary {
  totalSessions: number;
  totalMinutes: number;
  averageDuration: number;
  recentWorkout: Workout | null;
  volumeByDay: Array<{ day: string; minutes: number }>;
  intensity: Record<string, number>;
  lastUpdated: string;
}


