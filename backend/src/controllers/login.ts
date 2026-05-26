import Express, { type Request, type Response } from 'express';

import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, NODE_ENV }
  from '../utils/config.ts';

import { loginParser, tokenExtractor, userExtractor }
  from '../utils/middleware.ts';

import { Session, User } from '../models/index.ts';

import type {
  LoginRefreshResponse,
  LoginRequest,
  LoginResponse,
  UserFrontend,
  UserTokenPayload
} from '@strength-inventory/schemas';

const loginRouter = Express.Router();

// GET for the frontend to restore auth state on app load
loginRouter.get(
  '/',
  tokenExtractor,
  userExtractor,
  (req: Request, res: Response<UserFrontend>) => {
    if (!req.user) {
      throw Error('User missing from request.');
    }  // Should never trigger after middleware.

    const { id, username, email, emailVerified, name, role } = req.user;
    const userData = {
      id: id,
      username: username,
      email: email,
      emailVerified: emailVerified,
      name: name,
      role: role
    };

    return res.status(200).send(userData);
  }
);

// POST for users to log in
loginRouter.post(
  '/',
  loginParser,
  async (
    req: Request<unknown, unknown, LoginRequest>,
    res: Response<LoginResponse>
  ) => {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username
      }
    });

    const passwordCorrect = user === null
      ? false
      : await compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).end();
    }

    const { id, email, emailVerified, name, role } = user;

    const userForTokens: UserTokenPayload = {
      id: id,
      username: username
    };

    const accessToken
      = jwt.sign(userForTokens, JWT_ACCESS_SECRET, { expiresIn: '15m' });

    const refreshToken
      = jwt.sign(userForTokens, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await Session.create({ userId: user.id, accessToken, refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      /* secure: NODE_ENV === 'production', */
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    return res.status(200).send({
      token: accessToken, id, username, email, emailVerified, name, role
    });
  }
);

interface RequestWithRefreshToken extends Request {
  cookies: { refreshToken?: string };
}


loginRouter.post('/refresh', async (
  req: RequestWithRefreshToken,
  res: Response<LoginRefreshResponse>
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    const error = Error('Refresh token missing from request.');
    error.name = 'AuthenticationError';
    throw error;
  }

  const decodedToken = jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET,
    /* Explicitly request the expected algorithm for security */
    { algorithms: ['HS256'] }
  ) as UserTokenPayload;

  const activeSession
    = await Session.findOne({ where: { refreshToken: refreshToken } });
  /* In practice, this route should not receive calls with sessionless tokens.
  In theory, though, tokens only get invalidated through timeouts,
  so this check acts as a safeguard in addition to satisfying TS.*/
  if (!activeSession) {
    const error = Error('Refresh token expired.');
    error.name = 'AuthenticationError';
    throw error;
  }

  const userForToken = {
    id: decodedToken.id,
    username: decodedToken.username
  };

  const newAccessToken
    = jwt.sign(userForToken, JWT_ACCESS_SECRET, { expiresIn: '15m' });

  await activeSession.update({
    accessToken: newAccessToken
  });

  return res.status(200).send({ token: newAccessToken });
});

export default loginRouter;
