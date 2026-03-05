import Express, { type Request, type Response } from 'express';

import {
  isAdmin,
  isAdminOrManager,
  isManager,
  targetGymExtractor
} from '../utils/middleware.ts';

import { Equipment, Gym, Membership, User } from '../models/index.ts';

import type {
  Gym as FullGym,
  GymPatch,
  GymPatchHours,
  GymPost
} from '@strength-inventory/schemas';

const gymsRouter = Express.Router();

// GET all gyms
gymsRouter.get('/', async (_req, res) => {
  const gyms = await Gym.findAll({
    include: [{
      model: User,
      as: 'managers',
      attributes: [
        'id', 'username', 'email', 'name'
      ]
    },
    {
      model: Membership,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    {
      model: Equipment,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }]
  });
  return res.json(gyms);
});

gymsRouter.get('/:id', targetGymExtractor, (req, res) => {
  if (!req.targetGym) {
    throw new Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const gym = req.targetGym;
  return res.json(gym);
});

// POST a new gym
gymsRouter.post(
  '/',
  ...isAdmin,
  async (
    req: Request<unknown, unknown, GymPost>,
    res: Response<FullGym>
  ) => {
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      notes
    } = req.body;

    const gym = await Gym.create({
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      notes
    });

    return res.status(201).json(gym);
  }
);

// PUT for admins to modify everything except id and timestamps
gymsRouter.put(
  '/:id',
  ...isAdmin,
  targetGymExtractor,
  async (
    req: Request<{ id: string; }, unknown, GymPost>,
    res: Response<FullGym>
  ) => {
    if (!req.targetGym) {
      throw new Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions,
      url,
      notes
    } = req.body;

    await gym.update({
      name: name,
      chain: chain,
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      openingHoursEveryone: openingHoursEveryone,
      openingHoursMembers: openingHoursMembers,
      openingHoursExceptions: openingHoursExceptions,
      url: url,
      notes: notes
    });
    await gym.save();

    return res.status(200).json(gym);
  }
);

// PATCH for admins and managers to edit opening hours
gymsRouter.patch(
  '/:id',
  targetGymExtractor,
  ...isAdminOrManager,
  async (
    req: Request<{ id: string; }, unknown, GymPatchHours>,
    res: Response<FullGym>
  ) => {
    if (!req.targetGym) {
      throw new Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const {
      openingHoursEveryone,
      openingHoursMembers,
      openingHoursExceptions
    } = req.body;

    await gym.update({
      openingHoursEveryone: openingHoursEveryone,
      openingHoursMembers: openingHoursMembers,
      openingHoursExceptions: openingHoursExceptions
    });
    await gym.save();

    return res.status(200).json(gym);
  }
);

// PATCH for managers to edit information other than service hours
gymsRouter.patch(
  '/:id',
  targetGymExtractor,
  ...isManager,
  async (
    req: Request<{ id: string; }, unknown, GymPatch>,
    res: Response<FullGym>
  ) => {
    if (!req.targetGym) {
      throw new Error('Gym missing from request.');
    }  // Should never trigger after middleware.

    const gym = req.targetGym;
    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      url,
      notes
    } = req.body;

    await gym.update({
      name: name,
      chain: chain,
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      url: url,
      notes: notes
    });
    await gym.save();

    return res.status(200).json(gym);
  }
);

// DELETE for admins to delete a gym
gymsRouter.delete('/:id', ...isAdmin, targetGymExtractor, async (req, res) => {
  if (!req.targetGym) {
    throw new Error('Gym missing from request.');
  }  // Should never trigger after middleware.

  const gym = req.targetGym;
  await gym.destroy();

  return res.status(204).end();
});

export default gymsRouter;
