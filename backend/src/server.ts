import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { registerRealtime } from './realtime';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

app.set('io', io);
registerRealtime(io);

const start = async () => {
  await connectDatabase();

  server.listen(env.port, () => {
    logger.info(`🚀 Server listening on port ${env.port}`);
  });
};

void start();

