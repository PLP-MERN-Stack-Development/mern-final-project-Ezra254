import { Request } from 'express';
import { Server } from 'socket.io';
import { AuthenticatedRequest } from '../middleware/authGuard';

export const emitUserEvent = (req: Request, event: string, payload?: unknown) => {
  const io: Server | undefined = req.app.get('io');
  const userId = (req as AuthenticatedRequest).userId;

  if (!io || !userId) {
    return;
  }

  io.to(userId).emit(event, payload);
};



