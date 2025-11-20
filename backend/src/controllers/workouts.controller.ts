import { Response } from 'express';
import dayjs from 'dayjs';
import { Workout } from '../models/Workout';
import { asyncHandler } from '../utils/asyncHandler';
import { emitUserEvent } from '../utils/realtime';
import { AuthenticatedRequest } from '../middleware/authGuard';
import { Plan } from '../models/Plan';

const buildWorkoutFilter = (req: AuthenticatedRequest) => {
  const filter: Record<string, unknown> = { user: req.userId };

  if (req.query.planId && typeof req.query.planId === 'string') {
    filter.plan = req.query.planId;
  }

  const dateFilter: Record<string, Date> = {};
  if (req.query.start && typeof req.query.start === 'string') {
    dateFilter.$gte = dayjs(req.query.start).startOf('day').toDate();
  }
  if (req.query.end && typeof req.query.end === 'string') {
    dateFilter.$lte = dayjs(req.query.end).endOf('day').toDate();
  }
  if (Object.keys(dateFilter).length > 0) {
    filter.date = dateFilter;
  }

  return filter;
};

export const listWorkouts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filter = buildWorkoutFilter(req);
  const workouts = await Workout.find(filter).sort({ date: -1 });
  res.json({ workouts });
});

const syncPlanSessionStatus = async ({
  planId,
  sessionId,
  status,
}: {
  planId?: string;
  sessionId?: string;
  status: string;
}) => {
  if (!planId || !sessionId) return;

  await Plan.updateOne(
    { _id: planId, 'sessions._id': sessionId },
    {
      $set: {
        'sessions.$.status': status,
      },
    }
  );
};

export const createWorkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const workout = await Workout.create({
    ...req.body,
    user: req.userId,
  });

  await syncPlanSessionStatus({
    planId: req.body.plan,
    sessionId: req.body.sessionId,
    status: req.body.status ?? 'completed',
  });

  emitUserEvent(req, 'workouts:changed', { type: 'created', workoutId: workout.id });
  res.status(201).json({ workout });
});

export const updateWorkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const prevWorkout = await Workout.findOne({ _id: id, user: req.userId });

  if (!prevWorkout) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, { new: true });

  if (req.body.plan || req.body.sessionId || req.body.status) {
    await syncPlanSessionStatus({
      planId: req.body.plan ?? prevWorkout.plan?.toString(),
      sessionId: req.body.sessionId ?? prevWorkout.sessionId?.toString(),
      status: req.body.status ?? prevWorkout.status,
    });
  }

  emitUserEvent(req, 'workouts:changed', { type: 'updated', workoutId: updatedWorkout!.id });
  res.json({ workout: updatedWorkout });
});

export const deleteWorkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const workout = await Workout.findOneAndDelete({ _id: id, user: req.userId });

  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  await syncPlanSessionStatus({
    planId: workout.plan?.toString(),
    sessionId: workout.sessionId?.toString(),
    status: 'planned',
  });

  emitUserEvent(req, 'workouts:changed', { type: 'deleted', workoutId: workout.id });
  res.status(204).send();
});

export const getWorkoutSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const end = dayjs().endOf('day');
  const start = end.subtract(6, 'day').startOf('day');

  const workouts = await Workout.find({
    user: req.userId,
    date: { $gte: start.toDate(), $lte: end.toDate() },
  }).sort({ date: 1 });

  const dayLabels = Array.from({ length: 7 }, (_, index) => start.add(index, 'day'));
  const volumeByDay = dayLabels.map((day) => ({
    day: day.format('ddd'),
    minutes: workouts
      .filter((workout) => dayjs(workout.date).isSame(day, 'day'))
      .reduce((sum, workout) => sum + workout.durationMinutes, 0),
  }));

  const intensity = workouts.reduce(
    (acc, workout) => {
      acc[workout.intensity] = (acc[workout.intensity] ?? 0) + 1;
      return acc;
    },
    { easy: 0, moderate: 0, hard: 0 } as Record<string, number>
  );

  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.durationMinutes, 0);

  res.json({
    summary: {
      totalSessions: workouts.length,
      totalMinutes,
      averageDuration: workouts.length === 0 ? 0 : Math.round(totalMinutes / workouts.length),
      recentWorkout: workouts.length > 0 ? workouts[workouts.length - 1] : null,
      volumeByDay,
      intensity,
      lastUpdated: new Date().toISOString(),
    },
  });
});


