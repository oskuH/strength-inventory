import Express, { type Request, type Response } from 'express';

import { isAdmin, targetEquipmentExtractor } from '../utils/middleware.ts';

import { Equipment } from '../models/index.js';

import type {
  EquipmentPostAndPut,
  Equipment as FullEquipment
} from '@strength-inventory/schemas';

const equipmentRouter = Express.Router();

// GET all equipment
equipmentRouter.get('/', async (_req, res) => {
  const equipment = await Equipment.findAll();
  return res.json(equipment);
});

// POST a new equipment
equipmentRouter.post(
  '/',
  ...isAdmin,
  async (
    req: Request<unknown, unknown, EquipmentPostAndPut>,
    res: Response<FullEquipment>
  ) => {
    const {
      name,
      category,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      url,
      notes
    } = req.body;

    const equipment: FullEquipment = await Equipment.create({
      name,
      category,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      url,
      notes
    });

    return res.json(equipment);
  }
);

// PUT for admins to modify everything except id and timestamps
equipmentRouter.put(
  '/:id',
  ...isAdmin,
  targetEquipmentExtractor,
  async (
    req: Request<{ id: string; }, unknown, EquipmentPostAndPut>,
    res: Response<FullEquipment>
  ) => {
    if (!req.targetEquipment) {
      throw new Error('Equipment missing from request.');
    }  // Should never trigger after middleware.

    const equipment = req.targetEquipment;
    const {
      name,
      category,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      url,
      notes
    } = req.body;

    await equipment.update({
      name: name,
      category: category,
      manufacturer: manufacturer,
      code: code,
      weightUnit: weightUnit,
      weight: weight,
      startingWeight: startingWeight,
      availableWeights: availableWeights,
      maximumWeight: maximumWeight,
      url: url,
      notes: notes
    });
    await equipment.save();

    return res.status(200).json(equipment);
  }
);

// DELETE for admins to delete an equipment
equipmentRouter.delete(
  '/:id',
  ...isAdmin,
  targetEquipmentExtractor,
  async (req, res) => {
    if (!req.targetEquipment) {
      throw new Error('Equipment missing from request.');
    }  // Should never trigger after middleware.

    const equipment = req.targetEquipment;
    await equipment.destroy();

    return res.status(204).end();
  }
);

export default equipmentRouter;
