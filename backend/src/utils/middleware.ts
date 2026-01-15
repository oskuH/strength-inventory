import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from 'sequelize';

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

export { errorHandler };