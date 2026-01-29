import Express, { type Request, type Response, type NextFunction } from 'express';

import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/config.ts';

import { Session, User } from '../models/index.ts';

import { LoginSchema } from '../utils/schemas.ts';
import type { LoginRequest, LoginResponse, TokenPayload } from '../utils/types/types.ts';

const loginRouter = Express.Router();

const loginParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    LoginSchema.parse(req.body);
    next();
  } catch (e: unknown) {
    next(e);
  }
};

loginRouter.post('/', loginParser, async (req: Request<unknown, unknown, LoginRequest>, res: Response<LoginResponse>) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username
    }
  });

  const passwordCorrect = user === null
    ? false
    : await compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).end();
  }

  const userForToken: TokenPayload = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(
    userForToken,
    JWT_SECRET
  );

  await Session.create({ userId: user.id, token });

  return res.status(200).send({ token, username });
});

export default loginRouter;