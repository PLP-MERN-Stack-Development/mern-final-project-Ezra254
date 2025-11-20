import { Response } from 'express';
import dayjs from 'dayjs';
import { Goal } from '../models/Goal';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authGuard';
import { emitUserEvent } from '../utils/realtime';

export const listGoals = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
  res.json({ goals });
});

export const createGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;

  const now = dayjs();
  let start = req.body.startDate ? dayjs(req.body.startDate) : now.startOf('week');
  let end = req.body.endDate ? dayjs(req.body.endDate) : now.endOf('week');

  if (req.body.period === 'daily') {
    start = now.startOf('day');
    end = now.endOf('day');
  }

  if (req.body.period === 'monthly') {
    start = now.startOf('month');
    end = now.endOf('month');
  }

  const goal = await Goal.create({
    ...req.body,
    user: userId,
    startDate: start.toDate(),
    endDate: end.toDate(),
  });

  emitUserEvent(req, 'goals:changed', { type: 'created', goalId: goal.id });
  res.status(201).json({ goal });
});

export const updateGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const goal = await Goal.findOneAndUpdate({ _id: id, user: userId }, req.body, {
    new: true,
  });

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  emitUserEvent(req, 'goals:changed', { type: 'updated', goalId: goal.id });
  res.json({ goal });
});

export const deleteGoal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const goal = await Goal.findOneAndDelete({ _id: id, user: userId });
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  emitUserEvent(req, 'goals:changed', { type: 'deleted', goalId: goal.id });
  res.status(204).send();
});

export const getGoalSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;

  const now = dayjs();
  const startOfWeek = now.startOf('week').toDate();
  const endOfWeek = now.endOf('week').toDate();

  const goals = await Goal.find({
    user: userId,
    period: 'weekly',
    startDate: { $lte: endOfWeek },
    endDate: { $gte: startOfWeek },
    isActive: true,
  });

  const summary = goals.map((goal) => {
    const completion = goal.target === 0 ? 0 : Math.min(100, (goal.progress / goal.target) * 100);
    return {
      id: goal.id,
      type: goal.type,
      period: goal.period,
      target: goal.target,
      progress: goal.progress,
      unit: goal.unit,
      completion,
    };
  });

  res.json({ summary });
});


