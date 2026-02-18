import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from 'sequelize';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './config.ts';

import {
  Equipment,
  Gym,
  GymEquipment,
  GymManagers,
  GymMemberships,
  Membership,
  Session,
  User
} from '../models/index.ts';

import {
  type Gym as FullGym,
  LoginRequestSchema,
  PasswordSchema,
  UserNamesSchema,
  UserPostSchema,
  UserPutSchema,
  UserSchema,
  type UserTokenPayload
} from '@strength-inventory/schemas';

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
  return;
};

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
    next(err);  // err passed to the Express built-in error handler
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
    const decodedToken = jwt.verify(req.token, JWT_SECRET) as UserTokenPayload;
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
  if (!req.user) {
    res.status(401).json({ error: 'User missing from request.' });
    return;
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERUSER') {
    res.status(403).json({ error: 'Admin rights required.' });
    return;
  }
  next();
};

const isAdmin = [tokenExtractor, userExtractor, isUserAdmin];

const isUserManager = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User missing from request.' });
    return;
  }

  if (req.user.role !== 'MANAGER') {
    res.status(403).json({ error: 'Manager rights required.' });
    return;
  } else {
    let gymId: string;
    if (req.targetGym) {  // junction POSTs and Gym PATCHes
      gymId = req.targetGym.id;
    } else if (req.targetGymEquipment) {  // GymEquipment DELETE
      gymId = req.targetGymEquipment.gymId;
    } else if (req.targetGymMembership) {  // GymMembership DELETE
      gymId = req.targetGymMembership.gymId;
    } else {
      res.status(400).json({ error: 'Gym id missing from request.' });
      return;
    }

    const junction = await GymManagers.findOne({
      where: {
        userId: req.user.id,
        gymId: gymId
      }
    });

    if (!junction) {
      res.status(403).json({ error: 'Admin or manager rights required.' });
      return;
    }
  }

  next();
};

const isManager = [tokenExtractor, userExtractor, isUserManager];  // Will throw an error if there is no preceding target extractor.

const isUserAdminOrManager = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User missing from request.' });
    return;
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERUSER' && req.user.role !== 'MANAGER') {
    res.status(403).json({ error: 'Admin or manager rights required.' });
    return;
  } else {
    if (req.user.role === 'MANAGER') {
      let gymId: string;
      if (req.targetGym) {  // junction POSTs and Gym PATCHes
        gymId = req.targetGym.id;
      } else if (req.targetGymEquipment) {  // GymEquipment DELETE
        gymId = req.targetGymEquipment.gymId;
      } else if (req.targetGymMembership) {  // GymMembership DELETE
        gymId = req.targetGymMembership.gymId;
      } else {
        res.status(400).json({ error: 'Gym id missing from request.' });
        return;
      }

      const junction = await GymManagers.findOne({
        where: {
          userId: req.user.id,
          gymId: gymId
        }
      });

      if (!junction) {
        res.status(403).json({ error: 'Admin or manager rights required.' });
        return;
      }
    }
  }

  next();
};

const isAdminOrManager = [tokenExtractor, userExtractor, isUserAdminOrManager];  // Will throw an error for managers if there is no preceding target extractor.


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
    UserPostSchema.parse(req.body);
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
    UserPutSchema.parse(req.body);
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


// membership

const targetEquipmentExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const membership = await Equipment.findByPk(id);
  if (!membership) {
    res.status(404).json({ error: `Equipment with ID ${id} not found.` });
    return;
  }

  req.targetEquipment = membership;
  next();
};


// membership

const targetMembershipExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const membership = await Membership.findByPk(id);
  if (!membership) {
    res.status(404).json({ error: `Membership with ID ${id} not found.` });
    return;
  }

  req.targetMembership = membership;
  next();
};


// login

const loginParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    LoginRequestSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};


// gymequipment

const targetGymEquipmentExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const junction = await GymEquipment.findByPk(id);
  if (!junction) {
    res.status(404).json({ error: `Association with ID ${id} not found.` });
    return;
  }

  req.targetGymEquipment = junction;
  next();
};


// gymmanagers

const targetGymManagerExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const junction = await GymManagers.findByPk(id);
  if (!junction) {
    res.status(404).json({ error: `Association with ID ${id} not found.` });
    return;
  }

  req.targetGymManager = junction;
  next();
};

const adjustUserRole = async (userId: string, emptyLength: number): Promise<void> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }

  if (user.role === 'ADMIN' || user.role === 'SUPERUSER') {
    return;
  } else {
    const gyms: FullGym[] = await user.getGyms();
    if (gyms.length === emptyLength) {
      await user.update({
        role: 'GYM-GOER'
      });
    } else {
      await user.update({
        role: 'MANAGER'
      });
    }
    return;
  }
};


// gymmemberhsips

const targetGymMembershipExtractor = async (req: Request<{ id: string; }>, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'ID missing from request.' });
    return;
  }

  const junction = await GymMemberships.findByPk(id);
  if (!junction) {
    res.status(404).json({ error: `Association with ID ${id} not found.` });
    return;
  }

  req.targetGymMembership = junction;
  next();
};


export {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  isAdmin,
  isManager,
  isAdminOrManager,
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
  targetEquipmentExtractor,
  targetMembershipExtractor,
  loginParser,
  targetGymEquipmentExtractor,
  targetGymManagerExtractor,
  adjustUserRole,
  targetGymMembershipExtractor
};