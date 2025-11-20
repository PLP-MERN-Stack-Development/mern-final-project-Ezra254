import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '') ||
      req.query.token;

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;
    req.userId = decoded.sub as string;

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

