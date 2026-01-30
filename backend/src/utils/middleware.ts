import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from 'sequelize';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './config.ts';

import { Equipment, Gym, Session, User } from '../models/index.ts';

import { NewUserSchema, PasswordSchema, PutUserSchema, UserNamesSchema, UserSchema } from '../utils/schemas.ts';
import { type TokenPayload } from './types/types.ts';

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
  } else if (err instanceof Error) {
    console.error(err.name);
    res.status(400).json({ error: err.message });
    return;
  } else {
    console.error('Unhandled error type.');
    next();  // TODO
  }
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.replace(/bearer /gi, '');
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

const isUserAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERUSER')) {
    res.status(403).json({ error: 'Admin rights required.' });
    return;
  }
  next();
};

const isAdmin = [tokenExtractor, userExtractor, isUserAdmin];


// user


const targetUserExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const user = await User.findByPk(id);
  if (!user) {
    res.status(404).json({ error: `User with ID ${id} not found.` });
    return;
  }

  req.targetUser = user;
  next();
};

const newNamesParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    UserNamesSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewUserSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const newEmailParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    UserSchema.pick({ email: true }).parse(req.body);
    z.object({ email: z.email() }).parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const newPasswordParser = (req: Request<{ id: string; }, unknown, { password: string; }>, _res: Response, next: NextFunction) => {
  try {
    PasswordSchema.parse(req.body.password);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const roleParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    UserSchema.pick({ role: true }).parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const putUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    PutUserSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const isUserSelf = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.id !== req.params['id']) {
    res.status(403).json({ error: 'You can only modify your own data.' });
    return;
  }
  next();
};

const isUserSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || ((req.user.id !== req.params['id']) && (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERUSER'))) {
    res.status(403).json({ error: 'You can only modify your own data.' });
  }
  next();
};

const isSelf = [tokenExtractor, userExtractor, isUserSelf];
const isSelfOrAdmin = [tokenExtractor, userExtractor, isUserSelfOrAdmin];


// gym

const targetGymExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const gym = await Gym.findByPk(id);
  if (!gym) {
    res.status(404).json({ error: `Gym with ID ${id} not found.` });
    return;
  }

  req.targetGym = gym;
  next();
};


// equipment

const targetEquipmentExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const equipment = await Equipment.findByPk(id);
  if (!equipment) {
    res.status(404).json({ error: `Equipment with ID ${id} not found.` });
    return;
  }

  req.targetEquipment = equipment;
  next();
};


export {
  errorHandler,
  tokenExtractor,
  userExtractor,
  isAdmin,
  targetUserExtractor,
  newNamesParser,
  newUserParser,
  newEmailParser,
  newPasswordParser,
  roleParser,
  putUserParser,
  isSelf,
  isSelfOrAdmin,
  targetGymExtractor,
  targetEquipmentExtractor
};