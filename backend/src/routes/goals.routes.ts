import { Router } from 'express';
import { authGuard } from '../middleware/authGuard';
import { validateRequest } from '../middleware/validateRequest';
import { createGoal, deleteGoal, getGoalSummary, listGoals, updateGoal } from '../controllers/goals.controller';
import { createGoalValidator, updateGoalValidator } from '../validators/goal.validators';

export const goalsRouter = Router();

goalsRouter.use(authGuard);

goalsRouter.get('/', listGoals);
goalsRouter.post('/', createGoalValidator, validateRequest, createGoal);
goalsRouter.patch('/:id', updateGoalValidator, validateRequest, updateGoal);
goalsRouter.delete('/:id', updateGoalValidator, validateRequest, deleteGoal);
goalsRouter.get('/summary/weekly', getGoalSummary);


