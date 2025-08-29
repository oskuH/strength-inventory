import { Router } from 'express';

import { Gym } from '../models/index.js';

const gymsRouter = Router();

gymsRouter.get('/', async (req, res) => {
  const gyms = await Gym.findAll();
  return res.json(gyms);
});

export default gymsRouter;