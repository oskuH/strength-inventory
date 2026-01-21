import Express, { type Request, type Response } from 'express';

import { v4 as uuid } from 'uuid';

import { Equipment } from '../models/index.js';

import type { Equipment as NewEquipment, NewEquipmentRequest } from '../utils/types.js';

const equipmentRouter = Express.Router();

// GET all equipment
equipmentRouter.get('/', async (_req, res) => {
  const equipment = await Equipment.findAll();
  return res.json(equipment);
});

// ADD PERMISSIONS: admins only
// POST a new equipment
equipmentRouter.post('/', async (req: Request<unknown, unknown, NewEquipmentRequest>, res: Response<NewEquipment>) => {
  const { name, category, manufacturer, code, weightUnit, weight, startingWeight, availableWeights, maximumWeight, notes } = req.body;

  const id: string = uuid();

  const equipment: NewEquipment = await Equipment.create({ id, name, category, manufacturer, code, weightUnit, weight, startingWeight, availableWeights, maximumWeight, notes });
  return res.json(equipment);
});

// ADD PERMISSIONS: admins only
// PUT for admins to modify everything except id and timestamps
// equipmentRouter.put('/:id')

// ADD PERMISSIONS: admins only
// DELETE for admins to delete an equipment
equipmentRouter.delete('/:id', async (req, res) => {
  const equipment = await Equipment.findByPk(req.params.id);
  if (equipment) {
    await equipment.destroy();
    return res.status(204).end();
  } else {
    return res.status(404).end();
  }
});

export default equipmentRouter;