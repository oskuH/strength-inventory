import Express, { type Request, type Response } from 'express';

import { v4 as uuid } from 'uuid';

import { Gym } from '../models/index.js';

import type { Gym as NewGym, NewGymRequest } from '../utils/types.js';

const gymsRouter = Express.Router();

gymsRouter.get('/', async (_req, res) => {
  const gyms = await Gym.findAll();
  return res.json(gyms);
});

gymsRouter.post('/', async (req: Request<unknown, unknown, NewGymRequest>, res: Response<NewGym>) => {
  const { name, chain, street, streetNumber, city, notes, openingHours, closingHours } = req.body;

  const id: string = uuid();

  const gym = await Gym.create({ id, name, chain, street, streetNumber, city, notes, openingHours, closingHours });
  return res.status(201).json(gym);
});

gymsRouter.delete('/:id', async (req, res) => {
  const gym = await Gym.findByPk(req.params.id);
  if (gym) {
    await gym.destroy();
    return res.status(204).end();
  } else {
    return res.status(404).end();
  }
});

export default gymsRouter;