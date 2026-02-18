import Express, { type Request, type Response } from 'express';

import { isAdminOrManager, targetGymEquipmentExtractor, targetGymExtractor } from '../utils/middleware.ts';

import { GymEquipment } from '../models/index.ts';

import type { GymEquipment as FullGymEquipment, GymEquipmentPost } from '@strength-inventory/schemas';

const gymEquipmentRouter = Express.Router();

// GET all junctions
gymEquipmentRouter.get('/', async (_req, res) => {
  const junctions = await GymEquipment.findAll();
  return res.json(junctions);
});

// POST for admins and managers to create a new junction
gymEquipmentRouter.post('/:id', targetGymExtractor, ...isAdminOrManager, async (req: Request<{ id: string; }, unknown, GymEquipmentPost>, res: Response<FullGymEquipment>) => {
  if (!req.targetGym) { throw new Error('Gym missing from request.'); }  // Should never trigger after middleware.

  const gymId = req.targetGym.id;
  const { equipmentId } = req.body;

  const junction = await GymEquipment.create({ gymId, equipmentId });

  return res.status(201).json(junction);
});

// DELETE for admins and managers to delete a junction
gymEquipmentRouter.delete('/:id', targetGymEquipmentExtractor, ...isAdminOrManager, async (req, res) => {
  if (!req.targetGymEquipment) { throw new Error('Association missing from request.'); }  // Should never trigger after middleware.

  const junction = req.targetGymEquipment;
  await junction.destroy();

  return res.status(204).end();
});

export default gymEquipmentRouter;