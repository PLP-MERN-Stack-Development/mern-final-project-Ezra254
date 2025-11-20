import type { Server as SocketIOServer } from 'socket.io';
import type { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Application {
      get(name: 'io'): SocketIOServer;
      set(name: 'io', value: SocketIOServer): this;
    }

    interface Locals {
      user?: IUser;
    }

    interface Request {
      userId?: string;
    }
  }
}

export {};

