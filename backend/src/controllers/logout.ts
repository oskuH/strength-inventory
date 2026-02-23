import Express, { type Request, type Response } from 'express';

import { tokenExtractor } from '../utils/middleware.ts';

import Session from '../models/session.ts';

const logoutRouter = Express.Router();

// DELETE for users to log out
logoutRouter.delete(
  '/',
  tokenExtractor,
  async (req: Request, res: Response) => {
    const session = await Session.findOne({ where: { token: req.token } });

    if (session) {
      await session.destroy();
    }
    return res.status(204).end();
  }
);

export default logoutRouter;
