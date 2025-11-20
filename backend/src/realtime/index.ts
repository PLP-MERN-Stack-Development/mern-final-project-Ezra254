import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { env } from '../config/env';

interface SocketWithUserData {
  data: {
    userId?: string;
  };
  request: {
    headers: {
      cookie?: string;
    };
  };
}

export const registerRealtime = (io: Server) => {
  io.use((socket: SocketWithUserData, next) => {
    try {
      const cookies = socket.request.headers.cookie ? cookie.parse(socket.request.headers.cookie) : {};
      const token = cookies.accessToken;
      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const decoded = jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;
      socket.data.userId = decoded.sub as string;
      return next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    if (socket.data.userId) {
      socket.join(socket.data.userId);
    }

    socket.emit('realtime:connected', { timestamp: new Date().toISOString() });
  });
};


