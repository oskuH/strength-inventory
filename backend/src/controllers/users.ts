import Express, { type Request, Response } from 'express';

import { User } from '../models/index.js';

import type { User as NewUser, NewUserRequest } from '../utils/types.js';

const usersRouter = Express.Router();

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

usersRouter.post('/', async (req: Request<unknown, unknown, NewUserRequest>, res: Response<NewUser>) => {
  const { username, email, password, name } = req.body;

  /* if (!password) {
    return res.status(400).json({ error: 'password of length 3+ required' });
  } else if (password.length < 3) {
    return res.status(400).json({ error: 'password must contain at least 3 characters' });
  } */
  // MOVE THIS TO A SEPARATE VALIDATOR

  const user: NewUser = await User.create({ username, email, passwordHash: password, name });
  return res.json(user);
});

export default usersRouter;