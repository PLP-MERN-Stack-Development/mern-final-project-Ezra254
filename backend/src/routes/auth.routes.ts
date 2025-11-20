import { Router } from 'express';
import { register, login, logout, me, refresh } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validators';
import { validateRequest } from '../middleware/validateRequest';
import { authGuard } from '../middleware/authGuard';

export const authRouter = Router();

authRouter.post('/register', registerValidator, validateRequest, register);
authRouter.post('/login', loginValidator, validateRequest, login);
authRouter.post('/logout', authGuard, logout);
authRouter.get('/me', authGuard, me);
authRouter.post('/refresh', refresh);

