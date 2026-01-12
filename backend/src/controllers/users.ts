import Express, { type Request, type Response } from 'express';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { v4 as uuid } from 'uuid';

import { passwordValidator } from '../utils/middleware.js';

import { User } from '../models/index.js';

import type { User as NewUser, NewUserRequest } from '../utils/types.js';

const usersRouter = Express.Router();

usersRouter.get('/', async (_req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

usersRouter.post('/', passwordValidator, async (req: Request<unknown, unknown, NewUserRequest>, res: Response<NewUser>) => {
  const { username, email, password, name } = req.body;

  const id: string = uuid();
  const salt = genSaltSync(10);
  const passwordHash = hashSync(password, salt);

  const user: NewUser = await User.create({ id, username, email, passwordHash, name });
  return res.status(201).json(user);
});

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