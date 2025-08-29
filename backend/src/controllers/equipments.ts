import { Router } from 'express';

import { Equipment } from '../models/index.js';

const equipmentRouter = Router();

equipmentRouter.get('/', async (req, res) => {
  const equipment = await Equipment.findAll();
  return res.json(equipment);
});

export default equipmentRouter;