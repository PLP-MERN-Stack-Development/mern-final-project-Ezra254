import { Router } from 'express';
import { authGuard } from '../middleware/authGuard';
import { validateRequest } from '../middleware/validateRequest';
import { createPlan, deletePlan, getPlanSummary, listPlans, updatePlan } from '../controllers/plans.controller';
import { createPlanValidator, updatePlanValidator } from '../validators/plan.validators';

export const plansRouter = Router();

plansRouter.use(authGuard);

plansRouter.get('/', listPlans);
plansRouter.get('/summary', getPlanSummary);
plansRouter.post('/', createPlanValidator, validateRequest, createPlan);
plansRouter.patch('/:id', updatePlanValidator, validateRequest, updatePlan);
plansRouter.delete('/:id', deletePlan);



