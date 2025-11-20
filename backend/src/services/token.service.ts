import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

const signToken = (payload: TokenPayload, secret: string, expiresIn: string) =>
  jwt.sign(payload, secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });

export const tokenService = {
  generateTokens: (payload: TokenPayload) => ({
    accessToken: signToken(payload, env.jwtAccessSecret, env.accessTokenTtl),
    refreshToken: signToken(payload, env.jwtRefreshSecret, env.refreshTokenTtl),
  }),
  verifyAccessToken: (token: string) => jwt.verify(token, env.jwtAccessSecret) as TokenPayload,
  verifyRefreshToken: (token: string) => jwt.verify(token, env.jwtRefreshSecret) as TokenPayload,
};

