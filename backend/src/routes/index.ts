import { Router } from 'express';
import { healthRouter } from './healthcheck.routes';
import { authRouter } from './auth.routes';
import { goalsRouter } from './goals.routes';
import { plansRouter } from './plans.routes';
import { workoutsRouter } from './workouts.routes';

export const router = Router();

router.use('/healthcheck', healthRouter);
router.use('/auth', authRouter);
router.use('/goals', goalsRouter);
router.use('/plans', plansRouter);
router.use('/workouts', workoutsRouter);

router.get('/', (_req, res) => {
  res.json({ message: 'VitalTrack API', version: 'v1' });
});

