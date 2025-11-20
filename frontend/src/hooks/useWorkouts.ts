import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Workout, WorkoutSummary, WorkoutIntensity, WorkoutStatus, WorkoutType } from '../types/app';

const invalidateWorkoutQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['workouts'] });
  queryClient.invalidateQueries({ queryKey: ['workouts', 'summary'] });
};

export const useWorkouts = (filters?: { planId?: string }) => {
  const params = filters?.planId ? { planId: filters.planId } : undefined;
  return useQuery({
    queryKey: ['workouts', params?.planId ?? 'all'],
    queryFn: async () => {
      const { data } = await api.get<{ workouts: Workout[] }>('/workouts', { params });
      return data.workouts;
    },
  });
};

export const useWorkoutSummary = () =>
  useQuery({
    queryKey: ['workouts', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<{ summary: WorkoutSummary }>('/workouts/summary');
      return data.summary;
    },
    refetchInterval: 1000 * 60 * 2,
  });

type WorkoutPayload = {
  title: string;
  type: WorkoutType;
  date: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  perceivedEffort?: number;
  calories?: number;
  notes?: string;
  status?: WorkoutStatus;
  plan?: string;
  sessionId?: string;
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WorkoutPayload) => api.post('/workouts', payload),
    onSuccess: () => invalidateWorkoutQueries(queryClient),
  });
};

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WorkoutPayload> }) => api.patch(`/workouts/${id}`, payload),
    onSuccess: () => invalidateWorkoutQueries(queryClient),
  });
};

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/workouts/${id}`),
    onSuccess: () => invalidateWorkoutQueries(queryClient),
  });
};



