import { Router } from 'express';
import { authGuard } from '../middleware/authGuard';
import { validateRequest } from '../middleware/validateRequest';
import {
  createWorkout,
  deleteWorkout,
  getWorkoutSummary,
  listWorkouts,
  updateWorkout,
} from '../controllers/workouts.controller';
import { createWorkoutValidator, updateWorkoutValidator } from '../validators/workout.validators';

export const workoutsRouter = Router();

workoutsRouter.use(authGuard);

workoutsRouter.get('/', listWorkouts);
workoutsRouter.get('/summary', getWorkoutSummary);
workoutsRouter.post('/', createWorkoutValidator, validateRequest, createWorkout);
workoutsRouter.patch('/:id', updateWorkoutValidator, validateRequest, updateWorkout);
workoutsRouter.delete('/:id', deleteWorkout);



