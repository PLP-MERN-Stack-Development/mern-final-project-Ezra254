import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Goal, GoalSummaryItem } from '../types/app';

const invalidateGoalQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['goals'] });
  queryClient.invalidateQueries({ queryKey: ['goals', 'summary', 'weekly'] });
};

export const useGoals = () =>
  useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data } = await api.get<{ goals: Goal[] }>('/goals');
      return data.goals;
    },
  });

export const useWeeklyGoalSummary = () =>
  useQuery({
    queryKey: ['goals', 'summary', 'weekly'],
    queryFn: async () => {
      const { data } = await api.get<{ summary: GoalSummaryItem[] }>('/goals/summary/weekly');
      return data.summary;
    },
  });

type GoalPayload = {
  type: Goal['type'];
  period: Goal['period'];
  target: number;
  unit?: string;
  startDate?: string;
  endDate?: string;
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GoalPayload) => api.post('/goals', payload),
    onSuccess: () => invalidateGoalQueries(queryClient),
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GoalPayload> & { progress?: number; isActive?: boolean } }) =>
      api.patch(`/goals/${id}`, payload),
    onSuccess: () => invalidateGoalQueries(queryClient),
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/goals/${id}`),
    onSuccess: () => invalidateGoalQueries(queryClient),
  });
};
