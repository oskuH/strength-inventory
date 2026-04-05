import Express, { type Request, type Response } from 'express';

import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/config.ts';

import {
  loginParser, tokenExtractor, userExtractor
} from '../utils/middleware.ts';

import { Session, User } from '../models/index.ts';

import type {
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
      throw new Error('User missing from request.');
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

    const userForToken: UserTokenPayload = {
      id: id,
      username: username
    };

    const token = jwt.sign(userForToken, JWT_SECRET);

    await Session.create({ userId: user.id, token });

    return res.status(200).send({
      token, id, username, email, emailVerified, name, role
    });
  }
);

export default loginRouter;
