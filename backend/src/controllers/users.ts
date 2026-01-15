import Express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { v4 as uuid } from 'uuid';

import { User } from '../models/index.js';

import { NewUserSchema, PasswordSchema } from '../utils/schemas.ts';
import type { User as FullUser, NewUserRequest } from '../utils/types.js';

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
    z.email().parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const newPasswordParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    PasswordSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

const usersRouter = Express.Router();

usersRouter.get('/', async (_req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

usersRouter.post('/', newUserParser, async (req: Request<unknown, unknown, NewUserRequest>, res: Response<FullUser>) => {
  const { username, email, password, name } = req.body;

  const id: string = uuid();
  const salt = genSaltSync(10);
  const passwordHash = hashSync(password, salt);

  const user: FullUser = await User.create({ id, username, email, passwordHash, name });
  return res.status(201).json(user);
});

// ADD PERMISSIONS: user themselves
usersRouter.patch('/:id/email', newEmailParser, async (req: Request<{ id: string; }, unknown, { email: string; }>, res: Response<FullUser>) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({ email: req.body.email, emailVerified: false });
    await user.save();
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
});

// ADD PERMISSIONS: user themselves
usersRouter.patch('/:id/password', newPasswordParser, async (req: Request<{ id: string; }, unknown, { password: string; }>, res: Response<FullUser>) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    const salt = genSaltSync(10);
    const passwordHash = hashSync(req.body.password, salt);
    await user.update({ passwordHash: passwordHash });
    await user.save();
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
});

// ADD PERMISSIONS: user themselves and admins
usersRouter.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    return res.status(204).end();
  } else {
    return res.status(404).end();
  }
});

export default usersRouter;