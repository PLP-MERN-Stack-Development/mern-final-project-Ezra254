import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Plan, PlanSummary, PlanStatus, PlanIntensity, PlanSession } from '../types/app';

const invalidatePlanQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['plans'] });
  queryClient.invalidateQueries({ queryKey: ['plans', 'summary'] });
};

export const usePlans = () =>
  useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get<{ plans: Plan[] }>('/plans');
      return data.plans;
    },
  });

export const usePlanSummary = () =>
  useQuery({
    queryKey: ['plans', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<{ summary: PlanSummary }>('/plans/summary');
      return data.summary;
    },
  });

type PlanSessionPayload = Omit<PlanSession, 'id'> & { id?: string };

type PlanPayload = {
  name: string;
  goal: string;
  focusArea: string;
  startDate: string;
  endDate?: string;
  status?: PlanStatus;
  intensity?: PlanIntensity;
  notes?: string;
  sessions?: PlanSessionPayload[];
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanPayload) => api.post('/plans', payload),
    onSuccess: () => invalidatePlanQueries(queryClient),
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PlanPayload> }) => api.patch(`/plans/${id}`, payload),
    onSuccess: () => invalidatePlanQueries(queryClient),
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/plans/${id}`),
    onSuccess: () => invalidatePlanQueries(queryClient),
  });
};



