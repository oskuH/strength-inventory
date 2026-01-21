import type { User } from './src/models/index.ts';

declare global {
  namespace Express {
    interface Request {
      token?: string,
      user?: User;
    }
  }
}