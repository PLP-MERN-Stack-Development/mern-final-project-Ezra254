import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const errorHandler = (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.statusCode ?? 500;
  const message = status >= 500 ? 'Something went wrong' : error.message;

  logger.error(`HTTP ${status} - ${error.message}`, error.details ?? error.stack);

  res.status(status).json({
    message,
    details: status >= 500 ? undefined : error.details,
  });
};

