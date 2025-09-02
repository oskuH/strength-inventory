import type { Request, Response, NextFunction } from 'express';

import type { NewUserRequest } from './types.js';

const passwordValidator = (req: Request<unknown, unknown, NewUserRequest>, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'password of length 3+ required' });
  } else if (password.length < 3) {
    return res.status(400).json({ error: 'password must contain at least 3 characters' });
  }

  next();
};

const errorHandler = (err: Error, _req: Request, _res: Response, next: NextFunction) => {
  console.error(err.message);
  next();
};

export { passwordValidator, errorHandler };