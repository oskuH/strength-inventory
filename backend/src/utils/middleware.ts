import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from 'sequelize';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './config.ts';

import { Session, User } from '../models/index.ts';

import { type TokenPayload } from './types.ts';

const errorHandler = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    console.error(err.name);
    const messages = err.issues.map(issue => issue.message);
    return _res.status(400).json({ errors: messages });
  } else if (err instanceof ValidationError) {
    console.error(err.name);
    return _res.status(400).json({ error: err.message });
  } else {
    console.error('Unhandled error type.');
    next(err);
  }

  next();
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.replace('bearer ', '');
  } else {
    return res.status(401).json({ error: 'token missing' });
  };
  next();
};

const userExtractor = async (req: Request, res: Response, next: NextFunction) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, JWT_SECRET) as TokenPayload;
    const activeToken = await Session.findOne({ where: { token: req.token } });
    if (!activeToken) {
      return res.status(401).json({ error: 'expired token' });
    }
    if (decodedToken.id) {
      const foundUser = await User.findByPk(decodedToken.id);
      if (foundUser) {
        req.user = foundUser;
      } else {
        return res.status(401).json({ error: 'user corresponding to the token not found' });
      }
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

export { errorHandler, tokenExtractor, userExtractor };