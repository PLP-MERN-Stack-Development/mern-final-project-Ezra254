import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: path.resolve(process.cwd(), `.env${NODE_ENV === 'development' ? '' : `.${NODE_ENV}`}`),
});

const requiredVars = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env] Missing optional variable ${key}. Provide it before deployment.`);
  }
});

export const env = {
  nodeEnv: NODE_ENV,
  isDev: NODE_ENV !== 'production',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/vitaltrack',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  accessTokenTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
  cookieDomain: process.env.COOKIE_DOMAIN,
  logLevel: process.env.LOG_LEVEL ?? 'info',
};

