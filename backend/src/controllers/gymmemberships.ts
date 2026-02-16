import Express, { type Request, type Response } from 'express';

import { isAdminOrManager, targetGymExtractor, targetGymMembershipExtractor } from '../utils/middleware.ts';

import { GymMemberships } from '../models/index.ts';

import type { GymMembership as FullGymMembership, GymMembershipPost } from '../utils/schemas.ts';

const gymMembershipsRouter = Express.Router();

// GET all junctions
gymMembershipsRouter.get('/', async (_req, res) => {
  const junctions = await GymMemberships.findAll();
  return res.json(junctions);
});

// POST for admins and managers to create a new junction
gymMembershipsRouter.post('/:id', targetGymExtractor, ...isAdminOrManager, async (req: Request<{ id: string; }, unknown, GymMembershipPost>, res: Response<FullGymMembership>) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gymId = req.targetGym.id;
  const { membershipId } = req.body;

  const junction = await GymMemberships.create({ gymId, membershipId });

  return res.status(201).json(junction);
});

// DELETE for admins and managers to delete a junction
gymMembershipsRouter.delete('/:id', targetGymMembershipExtractor, ...isAdminOrManager, async (req, res) => {
  if (!req.targetGymMembership) { throw new Error('Association missing from request.'); }  // Should never trigger after middleware.

  const junction = req.targetGymMembership;
  await junction.destroy();

  return res.status(204).end();
});

export default gymMembershipsRouter;