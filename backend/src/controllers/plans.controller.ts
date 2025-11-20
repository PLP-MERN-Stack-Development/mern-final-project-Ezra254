import { Response } from 'express';
import dayjs from 'dayjs';
import { Plan, IPlanSession } from '../models/Plan';
import { asyncHandler } from '../utils/asyncHandler';
import { emitUserEvent } from '../utils/realtime';
import { AuthenticatedRequest } from '../middleware/authGuard';

export const listPlans = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const filter: Record<string, unknown> = { user: req.userId };
  if (status) {
    filter.status = status;
  }

  const plans = await Plan.find(filter).sort({ createdAt: -1 });
  res.json({ plans });
});

export const createPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const sessions = Array.isArray(req.body.sessions)
    ? req.body.sessions.map((session: Partial<IPlanSession>) => ({
        day: session.day,
        title: session.title,
        notes: session.notes,
        targetDuration: session.targetDuration,
        focusArea: session.focusArea,
        status: session.status ?? 'planned',
      }))
    : [];

  const plan = await Plan.create({
    ...req.body,
    sessions,
    user: userId,
  });

  emitUserEvent(req, 'plans:changed', { type: 'created', planId: plan.id });
  res.status(201).json({ plan });
});

export const updatePlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates: Record<string, unknown> = { ...req.body };

  if (Array.isArray(req.body.sessions)) {
    updates.sessions = req.body.sessions.map((session: Partial<IPlanSession>) => ({
      ...session,
      status: session.status ?? 'planned',
    }));
  }

  const plan = await Plan.findOneAndUpdate({ _id: id, user: req.userId }, updates, { new: true });
  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  emitUserEvent(req, 'plans:changed', { type: 'updated', planId: plan.id });
  res.json({ plan });
});

export const deletePlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const plan = await Plan.findOneAndDelete({ _id: id, user: req.userId });
  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  emitUserEvent(req, 'plans:changed', { type: 'deleted', planId: plan.id });
  res.status(204).send();
});

export const getPlanSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const plans = await Plan.find({ user: req.userId }).lean();

  const summary = plans.reduce(
    (acc, plan) => {
      acc.totalPlans += 1;
      acc.statusCounts[plan.status] = (acc.statusCounts[plan.status] ?? 0) + 1;
      acc.totalSessions += plan.sessions.length;
      const completed = plan.sessions.filter((session) => session.status === 'completed').length;
      acc.completedSessions += completed;
      if (plan.status === 'active') {
        acc.activePlans.push({
          id: plan._id.toString(),
          name: plan.name,
          focusArea: plan.focusArea,
          endDate: plan.endDate ? dayjs(plan.endDate).toISOString() : undefined,
          completion:
            plan.sessions.length === 0 ? 0 : Math.round((completed / plan.sessions.length) * 100),
        });
      }
      return acc;
    },
    {
      totalPlans: 0,
      totalSessions: 0,
      completedSessions: 0,
      statusCounts: {} as Record<string, number>,
      activePlans: [] as Array<{
        id: string;
        name: string;
        focusArea: string;
        endDate?: string;
        completion: number;
      }>,
    }
  );

  const completionRate =
    summary.totalSessions === 0 ? 0 : Math.round((summary.completedSessions / summary.totalSessions) * 100);

  res.json({
    summary: {
      totalPlans: summary.totalPlans,
      completionRate,
      activePlans: summary.activePlans,
      statusCounts: summary.statusCounts,
    },
  });
});



