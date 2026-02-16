import Express, { type Request, type Response } from 'express';

import { isAdmin, targetGymManagerExtractor } from '../utils/middleware.ts';

import { GymManagers } from '../models/index.ts';

import type { GymManager as FullGymManager, GymManagerPost } from '../utils/schemas.ts';

const gymManagersRouter = Express.Router();

// GET all junctions
gymManagersRouter.get('/', async (_req, res) => {
  const junctions = await GymManagers.findAll();
  return res.json(junctions);
});

// POST for admins to create a new junction
gymManagersRouter.post('/', ...isAdmin, async (req: Request<unknown, unknown, GymManagerPost>, res: Response<FullGymManager>) => {
  const { userId, gymId } = req.body;

  const junction = await GymManagers.create({ userId, gymId });

  return res.status(201).json(junction);
});

// DELETE for admins to delete a junction
gymManagersRouter.delete('/:id', ...isAdmin, targetGymManagerExtractor, async (req, res) => {
  if (!req.targetGymManager) { throw new Error('Association missing from request.'); }  // Should never trigger after middleware.

  const junction = req.targetGymManager;
  await junction.destroy();

  return res.status(204).end();
});

export default gymManagersRouter;