import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from 'sequelize';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './config.ts';

import { Session, User } from '../models/index.ts';

import { type TokenPayload } from './types.ts';

const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof z.ZodError) {
    console.error(err.name);
    const messages = err.issues.map(issue => issue.message);
    res.status(400).json({ errors: messages });
    return;
  } else if (err instanceof ValidationError) {
    console.error(err.name);
    res.status(400).json({ error: err.message });
    return;
  } else {
    console.error('Unhandled error type.');
    next();
  }

  next();
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.replace('bearer ', '');
  } else {
    res.status(401).json({ error: 'Token missing.' });
    return;
  };
  next();
};

const userExtractor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, JWT_SECRET) as TokenPayload;
    const activeToken = await Session.findOne({ where: { token: req.token } });
    if (!activeToken) {
      res.status(401).json({ error: 'Token expired.' });
      return;
    }
    if (decodedToken.id) {
      const foundUser = await User.findByPk(decodedToken.id);
      if (foundUser) {
        req.user = foundUser;
      } else {
        res.status(401).json({ error: 'User corresponding to the token not found.' });
        return;
      }
    } else {
      res.status(401).json({ error: 'Token is missing user information.' });
      return;
    }
  } else {
    res.status(401).json({ error: 'Token missing.' });
    return;
  }
  next();
};

export { errorHandler, tokenExtractor, userExtractor };