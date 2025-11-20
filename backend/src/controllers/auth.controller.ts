import { Request, Response } from 'express';
import { User } from '../models/User';
import { tokenService } from '../services/token.service';
import { asyncHandler } from '../utils/asyncHandler';
import { setAuthCookies, clearAuthCookies } from '../utils/tokenCookies';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await User.create(req.body);
  const payload = { sub: user.id, email: user.email, roles: user.roles };
  const tokens = tokenService.generateTokens(payload);

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(201).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      preferences: user.preferences,
    },
    tokens,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = { sub: user.id, email: user.email, roles: user.roles };
  const tokens = tokenService.generateTokens(payload);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      preferences: user.preferences,
    },
    tokens,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(204).send();
});

export const me = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ user: res.locals.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.headers['x-refresh-token'] ||
    (typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : undefined);

  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  const decoded = tokenService.verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.sub);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const payload = { sub: user.id, email: user.email, roles: user.roles };
  const tokens = tokenService.generateTokens(payload);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({ tokens });
});

