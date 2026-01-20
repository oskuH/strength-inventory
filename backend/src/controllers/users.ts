import Express, { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { v4 as uuid } from 'uuid';

import { User } from '../models/index.js';

import { NewUserSchema, PasswordSchema, PutUserSchema, UserNamesSchema, UserSchema } from '../utils/schemas.ts';
import type { User as FullUser, NewUserRequest, PutUserRequest, Role } from '../utils/types.js';

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

const newPasswordParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    PasswordSchema.parse(req.body);
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

const usersRouter = Express.Router();

// GET all users
usersRouter.get('/', async (_req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

// POST a new user
usersRouter.post('/', newUserParser, async (req: Request<unknown, unknown, NewUserRequest>, res: Response<FullUser>) => {
  const { username, email, password, name } = req.body;

  const id: string = uuid();
  const salt = genSaltSync(10);
  const passwordHash = hashSync(password, salt);

  const user: FullUser = await User.create({ id, username, email, passwordHash, name });
  return res.status(201).json(user);
});

// ADD PERMISSIONS: user themselves
// PATCH for users to change username and/or name
usersRouter.patch('/:id', newNamesParser, async (req: Request<{ id: string; }, unknown, { username: string, name: string; }>, res: Response<FullUser>) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({ username: req.body.username, name: req.body.name });
    await user.save();
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
});

// ADD PERMISSIONS: user themselves
// PATCH for users to change email
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
// PATCH for users to change password
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

// ADD PERMISSIONS: admins only
// PATCH for admins to change a user's role
usersRouter.patch('/:id/role', roleParser, async (req: Request<{ id: string; }, unknown, { role: Role; }>, res: Response<FullUser>) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({ role: req.body.role });
    await user.save();
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
});

// ADD PERMISSIONS: admins only
// PUT for admins to modify everything except id and timestamps
usersRouter.put('/:id', putUserParser, async (req: Request<{ id: string; }, unknown, PutUserRequest>, res: Response<FullUser>) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update({
      username: req.body.username,
      email: req.body.email,
      emailVerified: req.body.emailVerified,
      name: req.body.name
    });
    if (req.body.password) {
      const salt = genSaltSync(10);
      const passwordHash = hashSync(req.body.password, salt);
      await user.update({ passwordHash: passwordHash });
    }
    return res.status(200).json(user);
  } else {
    return res.status(404).end();
  }
});

// ADD PERMISSIONS: user themselves and admins
// DELETE for everyone to delete a user
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