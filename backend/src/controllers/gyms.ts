import Express, { type Request, type Response } from 'express';

import {
  targetGymExtractor,
  isAdmin
} from '../utils/middleware.ts';

import { Gym } from '../models/index.js';

import type { Gym as FullGym, GymPatch, GymPost, Hours } from '../utils/types/types.ts';

const gymsRouter = Express.Router();

// GET all gyms
gymsRouter.get('/', async (_req, res) => {
  const gyms = await Gym.findAll();
  return res.json(gyms);
});

// POST a new gym
gymsRouter.post('/', ...isAdmin, async (req: Request<unknown, unknown, GymPost>, res: Response<FullGym>) => {
  const { name, chain, street, streetNumber, city, notes, openingHours, closingHours } = req.body;

  const gym = await Gym.create({ name, chain, street, streetNumber, city, notes, openingHours, closingHours });

  return res.status(201).json(gym);
});

// PUT for admins to modify everything except id and timestamps
gymsRouter.put('/:id', ...isAdmin, targetGymExtractor, async (req: Request<{ id: string; }, unknown, GymPost>, res: Response<FullGym>) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gym = req.targetGym;
  const { name, chain, street, streetNumber, city, notes, openingHours, closingHours } = req.body;

  await gym.update({
    name: name,
    chain: chain,
    street: street,
    streetNumber: streetNumber,
    city: city,
    notes: notes,
    openingHours: openingHours,
    closingHours: closingHours
  });
  await gym.save();

  return res.status(200).json(gym);
});

// ADD PERMISSIONS: gym-owners
// PATCH for admins to edit service hours
gymsRouter.patch('/:id', ...isAdmin, targetGymExtractor, async (req: Request<{ id: string; }, unknown, { openingHours: Hours, closingHours: Hours; }>, res: Response<FullGym>) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gym = req.targetGym;
  const { openingHours, closingHours } = req.body;

  await gym.update({
    openingHours: openingHours,
    closingHours: closingHours
  });
  await gym.save();

  return res.status(200).json(gym);
});

// ADD PERMISSIONS: gym-owners
// PATCH for gym-owners to edit information other than service hours
gymsRouter.patch('/:id', targetGymExtractor, async (req: Request<{ id: string; }, unknown, GymPatch>, res: Response<FullGym>) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gym = req.targetGym;
  const { name, chain, street, streetNumber, city, notes } = req.body;

  await gym.update({
    name: name,
    chain: chain,
    street: street,
    streetNumber: streetNumber,
    city: city,
    notes: notes
  });
  await gym.save();

  return res.status(200).json(gym);
});

// DELETE for admins to delete a gym
gymsRouter.delete('/:id', ...isAdmin, targetGymExtractor, async (req, res) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gym = req.targetGym;
  await gym.destroy();

  return res.status(204).end();
});

export default gymsRouter;